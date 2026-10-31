import Icon from './Icon.jsx';
import { Avatar } from './Person.jsx';

export const NAV = [
  { key: 'overview', label: 'Overview', icon: 'grid' },
  { key: 'craftsmen', label: 'Craftsmen', icon: 'hammer' },
  { key: 'users', label: 'Users', icon: 'users' },
  { key: 'requests', label: 'Service requests', icon: 'list' },
];

export default function Sidebar({ route, pending, open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-ink/45 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col overflow-y-auto border-r border-line bg-white px-[18px] pt-6 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-1.5 pb-5">
          <div className="grid h-[42px] w-[42px] place-items-center rounded-xl bg-primary text-[22px] font-bold text-white shadow-md shadow-primary/30">H</div>
          <div>
            <div className="text-xl font-bold leading-none">Hirafawy</div>
            <div className="mt-1 text-xs text-muted">Admin panel</div>
          </div>
        </div>

        <div className="px-2.5 py-2 text-xs text-muted">Main menu</div>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <a key={n.key} href={`#/${n.key}`} onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-[11px] font-medium transition-colors ${route === n.key ? 'bg-primary-soft font-semibold text-primary-dark' : 'text-[#4b4a63] hover:bg-[#f4f3fb]'}`}>
              <Icon name={n.icon} />
              <span>{n.label}</span>
              {n.key === 'craftsmen' && pending > 0 && (
                <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-[#ffe3e1] px-1.5 text-[11px] font-bold text-bad">{pending}</span>
              )}
            </a>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <div className="rounded-2xl bg-primary-soft p-4">
            <div className="mb-2 grid h-[26px] w-[26px] place-items-center rounded-lg bg-white font-bold text-primary">?</div>
            <h4 className="mb-1 text-sm font-semibold">Need help?</h4>
            <p className="mb-2.5 text-xs text-[#5c5b78]">Review the project data or contact the development team.</p>
            <a href="#/overview" className="text-xs font-semibold text-primary-dark">Help center</a>
          </div>
        </div>

        <div className="-mx-[18px] mt-4 flex items-center gap-2.5 border-t border-line px-6 py-4">
          <Avatar name="System Admin" index={0} />
          <div>
            <div className="text-[13px] font-semibold leading-tight">System Admin</div>
            <div className="text-[11px] text-muted">Admin account</div>
          </div>
        </div>
      </aside>
    </>
  );
}
