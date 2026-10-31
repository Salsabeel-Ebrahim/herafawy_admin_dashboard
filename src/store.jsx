import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';
import { ENDPOINTS } from './config.js';
import { extractList, isCraftsman, toAccount, toCraftsman } from './mappers.js';
import { useToast } from './components/Toasts.jsx';

const LS_REVIEW = 'review-overrides';
const LS_ACCOUNT = 'account-overrides';
const read = (k) => { try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch { return {}; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };

const Ctx = createContext(null);
export const useData = () => useContext(Ctx);

const LOCAL_NOTE = ' (saved in this browser only, no backend endpoint yet)';

export function DataProvider({ children }) {
  const toast = useToast();
  const [raw, setRaw] = useState(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [reviewOv, setReviewOv] = useState(() => read(LS_REVIEW));
  const [accountOv, setAccountOv] = useState(() => read(LS_ACCOUNT));

  const load = useCallback(async () => {
    try {
      setRaw(extractList(await api(ENDPOINTS.list)));
      setError('');
    } catch (e) {
      setError(e.message);
      toast(e.message, 'error');
      setRaw((r) => r ?? []);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const craftsmen = useMemo(
    () => (raw ?? []).filter(isCraftsman).map(toCraftsman).map((c) => ({
      ...c,
      // a local decision only applies while the backend still says "pending"
      status: c.status === 'pending' ? reviewOv[c.id] ?? c.status : c.status,
    })),
    [raw, reviewOv]
  );

  const accounts = useMemo(
    () => (raw ?? []).map(toAccount).map((a) => ({ ...a, status: accountOv[a.id] ?? a.status })),
    [raw, accountOv]
  );

  const review = useCallback(async (c, action) => {
    const verb = action === 'approve' ? 'approved' : 'rejected';
    setBusyId(c.id);
    try {
      const ep = ENDPOINTS[action];
      if (ep) {
        const { path, method, body } = ep(c);
        await api(path, { method, body: body ? JSON.stringify(body) : undefined });
        await load();
        toast(`${c.name} ${verb}`);
      } else {
        const next = { ...reviewOv, [c.id]: verb };
        setReviewOv(next);
        write(LS_REVIEW, next);
        toast(`${c.name} ${verb}${LOCAL_NOTE}`);
      }
      return true;
    } catch (e) {
      toast(e.message, 'error');
      return false;
    } finally {
      setBusyId(null);
    }
  }, [load, reviewOv, toast]);

  const setAccountStatus = useCallback(async (a, status) => {
    const key = status === 'suspended' ? 'suspend' : 'activate';
    setBusyId(a.id);
    try {
      const ep = ENDPOINTS[key];
      if (ep) {
        const { path, method, body } = ep(a);
        await api(path, { method, body: body ? JSON.stringify(body) : undefined });
        await load();
        toast(`${a.name} ${status === 'suspended' ? 'suspended' : 'activated'}`);
      } else {
        const next = { ...accountOv, [a.id]: status };
        setAccountOv(next);
        write(LS_ACCOUNT, next);
        toast(`${a.name} ${status === 'suspended' ? 'suspended' : 'activated'}${LOCAL_NOTE}`);
      }
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusyId(null);
    }
  }, [accountOv, load, toast]);

  const value = {
    loading: raw === null,
    error,
    craftsmen,
    accounts,
    pendingCount: craftsmen.filter((c) => c.status === 'pending').length,
    busyId,
    reload: load,
    review,
    setAccountStatus,
    localOnly: { review: !ENDPOINTS.approve, account: !ENDPOINTS.suspend },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
