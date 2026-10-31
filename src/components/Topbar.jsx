import Icon from './Icon.jsx';

const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export default function Topbar({ title, onMenu, onRefresh }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-white px-3.5 lg:px-7">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} aria-label="Open menu" className="grid h-9 w-9 place-items-center rounded-[10px] border border-line text-[#4b4a63] hover:bg-[#f7f7fc] lg:hidden">
          <Icon name="menu" className="h-[18px] w-[18px]" />
        </button>
        <div className="flex items-center gap-2 text-muted">
          <span>Hirafawy</span><span className="opacity-60">/</span>
          <strong className="font-semibold text-ink">{title}</strong>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-2 rounded-[10px] border border-warn-line bg-warn-soft px-3 py-1 text-xs font-semibold text-[#7a4d06] sm:inline-flex">
          <i className="h-[7px] w-[7px] rounded-full bg-[#d99a1d]" />Demo mode
        </span>
        <button onClick={onRefresh} title="Refresh data" aria-label="Refresh data" className="grid h-9 w-9 place-items-center rounded-[10px] border border-line text-[#4b4a63] hover:bg-[#f7f7fc]">
          <Icon name="refresh" className="h-[18px] w-[18px]" />
        </button>
        <span className="hidden text-[13px] text-muted md:block">{today}</span>
      </div>
    </header>
  );
}
