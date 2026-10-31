export function Card({ children, className = '' }) {
  return <div className={`overflow-hidden rounded-[14px] border border-line bg-white ${className}`}>{children}</div>;
}

export function Table({ columns, children, actionsLast = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={c} className={`whitespace-nowrap border-b border-line bg-[#fafafd] px-[18px] py-[13px] text-[12.5px] font-medium text-muted ${actionsLast && i === columns.length - 1 ? 'text-right' : 'text-left'}`}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export const Td = ({ children, className = '' }) => (
  <td className={`border-b border-line px-[18px] py-3.5 align-middle ${className}`}>{children}</td>
);

export function CardFoot({ count, note = 'Demo data for display only', unit = 'result' }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-t border-line px-[18px] py-3.5 text-[12.5px] text-muted">
      <span>{count} {unit}{count === 1 ? '' : 's'}</span>
      <span>{note}</span>
    </div>
  );
}

export function PageHead({ eyebrow, title, sub, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="mb-1.5 text-xs font-semibold text-primary">{eyebrow}</div>}
        <h1 className="text-[28px] font-bold leading-tight">{title}</h1>
        {sub && <p className="mt-1 text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Empty({ title, children }) {
  return (
    <div className="p-12 text-center text-muted">
      <strong className="mb-1 block text-ink">{title}</strong>{children}
    </div>
  );
}
