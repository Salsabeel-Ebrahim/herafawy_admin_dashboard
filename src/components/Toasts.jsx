import { createContext, useCallback, useContext, useState } from 'react';

const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setItems((s) => [...s, { id, message, type }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 4200);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-5 right-5 z-[60] flex max-w-[calc(100vw-2.5rem)] flex-col gap-2.5" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`flex max-w-[420px] animate-pop items-start gap-2.5 rounded-xl px-4 py-3 text-[13.5px] text-white shadow-xl ${t.type === 'error' ? 'bg-bad' : 'bg-ink'}`}>
            {t.type === 'success' && <span className="font-bold text-emerald-300">✓</span>}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
