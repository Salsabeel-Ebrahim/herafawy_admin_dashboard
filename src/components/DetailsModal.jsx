import { useEffect } from 'react';
import Icon from './Icon.jsx';
import { Avatar } from './Person.jsx';
import { STATUS, fmtDate } from '../utils.js';

const Row = ({ k, v }) => (
  <p className="mb-3 text-[#4b4a63]"><b className="font-semibold text-[#3b3a55]">{k}:</b> {v}</p>
);

export default function DetailsModal({ craftsman: c, busy, onClose, onReview }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const act = async (action) => {
    const ok = await onReview(c, action);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid animate-fade place-items-center bg-ink/45 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Craftsman details" className="w-full max-w-[480px] animate-pop rounded-[20px] bg-white p-7 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <h2 className="text-[21px] font-bold">Craftsman details</h2>
          <button onClick={onClose} aria-label="Close" className="grid h-[30px] w-[30px] place-items-center rounded-lg text-muted hover:bg-[#f3f3f8]">
            <Icon name="close" className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <Avatar name={c.name} index={0} size="h-11 w-11" />
          <div>
            <div className="font-semibold leading-tight">{c.name}</div>
            <div className="text-[11.5px] text-muted">{c.email}</div>
          </div>
        </div>

        <Row k="Specialty" v={c.specialty} />
        <Row k="Area" v={[c.area, c.city].filter(Boolean).join(', ') || '—'} />
        <Row k="Submitted" v={fmtDate(c.submittedAt)} />
        <Row k="Current status" v={STATUS[c.status]} />
        <p className="mb-6 mt-[18px] text-muted">ID and documents are not available in the demo version.</p>

        {c.status === 'pending' && (
          <div className="flex gap-3">
            <button disabled={busy} onClick={() => act('approve')} className="h-[46px] flex-1 rounded-xl bg-primary font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50">Approve application</button>
            <button disabled={busy} onClick={() => act('reject')} className="h-[46px] flex-1 rounded-xl border border-bad-line bg-bad-soft font-semibold text-bad transition hover:bg-[#fbdcda] disabled:opacity-50">Reject application</button>
          </div>
        )}
      </div>
    </div>
  );
}
