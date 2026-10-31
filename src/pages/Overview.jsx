import { useMemo, useState } from 'react';
import { useData } from '../store.jsx';
import { CHART, REQUESTS } from '../mock.js';
import { downloadCsv, fmtDate, timeAgo } from '../utils.js';
import CraftsmenTable from '../components/CraftsmenTable.jsx';
import DetailsModal from '../components/DetailsModal.jsx';
import ExportButton from '../components/ExportButton.jsx';
import Icon from '../components/Icon.jsx';
import { Card, Empty } from '../components/Table.jsx';

// number of items per day for the last 7 days
function lastSevenDays(dates) {
  return [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return dates.filter((x) => x && new Date(x).toDateString() === d.toDateString()).length;
  });
}

function MiniBars({ data, color }) {
  const max = Math.max(1, ...data);
  return (
    <div className="mt-4 flex h-12 items-end gap-1.5" aria-hidden="true">
      {data.map((v, i) => (
        <span key={i} className={`w-2.5 rounded-sm ${color}`} style={{ height: `${Math.max(12, (v / max) * 100)}%` }} />
      ))}
    </div>
  );
}

function StatCard({ icon, tile, label, value, sub, children }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${tile}`}><Icon name={icon} /></div>
        <div className="text-[13px] text-muted">{label}</div>
      </div>
      <div className="mt-4 text-[32px] font-bold leading-none">{value}</div>
      <div className="mt-2 text-xs text-muted">{sub}</div>
      {children}
    </div>
  );
}

function BarChart({ labels, created, completed }) {
  const max = Math.max(50, Math.ceil(Math.max(...created, ...completed) / 50) * 50);
  const ticks = [max, Math.round(max / 2), 0];
  return (
    <div className="mt-4 flex gap-3">
      <div className="flex h-[220px] flex-col justify-between pb-0 text-[11px] text-muted">
        {ticks.map((t) => <span key={t}>{t}</span>)}
      </div>
      <div className="relative flex-1">
        <div className="absolute inset-0 flex flex-col justify-between" aria-hidden="true">
          {ticks.map((t) => <div key={t} className="border-t border-line" />)}
        </div>
        <div className="relative flex h-[220px] items-end justify-around">
          {labels.map((l, i) => (
            <div key={l} className="flex h-full w-full items-end justify-center gap-1.5">
              <span title={`Completed: ${completed[i]}`} className="w-3 rounded-t bg-[#5fd0a5] sm:w-4" style={{ height: `${(completed[i] / max) * 100}%` }} />
              <span title={`New: ${created[i]}`} className="w-3 rounded-t bg-[#8b7fe8] sm:w-4" style={{ height: `${(created[i] / max) * 100}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-around text-[11px] text-muted">
          {labels.map((l) => <span key={l} className="w-full text-center">{l}</span>)}
        </div>
      </div>
    </div>
  );
}

const ACTIVITY_STYLE = {
  pending: { tile: 'bg-warn-soft text-warn', icon: 'userCheck', title: 'New craftsman join request' },
  approved: { tile: 'bg-ok-soft text-ok', icon: 'check', title: 'Craftsman approved' },
  rejected: { tile: 'bg-bad-soft text-bad', icon: 'close', title: 'Craftsman rejected' },
  customer: { tile: 'bg-primary-soft text-primary', icon: 'users', title: 'New customer registered' },
};

export default function Overview() {
  const { loading, craftsmen, accounts, pendingCount, busyId, review } = useData();
  const [range, setRange] = useState('7');
  const [selected, setSelected] = useState(null);

  const chart = CHART[range];
  const people = accounts.filter((a) => a.role !== 'admin');
  const approved = craftsmen.filter((c) => c.status === 'approved').length;
  const signups = useMemo(() => lastSevenDays(accounts.map((a) => a.joinedAt)), [accounts]);
  const craftSignups = useMemo(() => lastSevenDays(craftsmen.map((c) => c.submittedAt)), [craftsmen]);
  const pendingList = craftsmen.filter((c) => c.status === 'pending');

  const activity = useMemo(() => {
    const byId = Object.fromEntries(craftsmen.map((c) => [c.id, c]));
    return [...people]
      .sort((a, b) => String(b.joinedAt).localeCompare(String(a.joinedAt)))
      .slice(0, 4)
      .map((a) => {
        const c = byId[a.id];
        const style = c ? ACTIVITY_STYLE[c.status] : ACTIVITY_STYLE.customer;
        return { id: a.id, style, text: c ? `${c.name} · ${c.specialty}` : a.name, time: timeAgo(a.joinedAt) };
      });
  }, [people, craftsmen]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  function exportReport() {
    downloadCsv('hirafawy-report.csv', [
      ['Summary'],
      ['Total users', accounts.length],
      ['Customers', accounts.filter((a) => a.role === 'customer').length],
      ['Craftsmen', craftsmen.length],
      ['Pending craftsmen', pendingCount],
      [],
      ['Name', 'Email', 'Specialty', 'Area', 'Submitted', 'Status'],
      ...craftsmen.map((c) => [c.name, c.email, c.specialty, [c.area, c.city].filter(Boolean).join(', '), fmtDate(c.submittedAt), c.status]),
    ]);
  }

  if (loading) return <div className="p-12 text-center text-muted">Loading…</div>;

  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 text-xs font-semibold text-primary">Platform summary</div>
          <h1 className="text-[32px] font-bold leading-tight"><span className="mr-2 text-[#e6a93a]">✦</span>{greeting}, System Admin</h1>
          <p className="mt-1 text-muted">A quick look at how Hirafawy is doing today.</p>
        </div>
        <ExportButton label="Export report" onClick={exportReport} />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="users" tile="bg-primary-soft text-primary" label="Total users" value={accounts.length.toLocaleString('en-US')}
          sub={`+${signups.reduce((a, b) => a + b, 0)} in the last 7 days`}>
          <MiniBars data={signups} color="bg-[#b7aef0]" />
        </StatCard>
        <StatCard icon="hammer" tile="bg-ok-soft text-ok" label="Active craftsmen" value={approved.toLocaleString('en-US')}
          sub={`${craftsmen.length} craftsmen registered`}>
          <MiniBars data={craftSignups} color="bg-[#8fdcc0]" />
        </StatCard>
        <StatCard icon="list" tile="bg-warn-soft text-warn" label="Service requests" value={REQUESTS.length.toLocaleString('en-US')} sub="Demo data for display only">
          <MiniBars data={CHART[7].created} color="bg-[#f4cf91]" />
        </StatCard>
        <StatCard icon="clock" tile="bg-bad-soft text-bad" label="Requests needing review" value={pendingCount}
          sub={<span><b className="font-semibold text-warn">Needs attention</b> · new join requests</span>}>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#eeeef4]">
            <div className="h-full rounded-full bg-[#e6a93a]" style={{ width: `${craftsmen.length ? (pendingCount / craftsmen.length) * 100 : 0}%` }} />
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted"><span>Review requests</span><span>{craftsmen.length - pendingCount} reviewed</span></div>
        </StatCard>
      </div>

      <div className="mb-5 grid gap-5 lg:grid-cols-[1fr_1.7fr]">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold">Latest activity</h2>
              <p className="text-[13px] text-muted">Latest updates on the platform</p>
            </div>
            <a href="#/users" className="text-[13px] font-semibold text-primary-dark">View all</a>
          </div>
          {activity.length === 0 ? <Empty title="No activity yet">New sign-ups will show up here.</Empty> : (
            <ul className="mt-4 divide-y divide-line">
              {activity.map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-4">
                  <div className={`grid h-10 w-10 flex-none place-items-center rounded-xl ${a.style.tile}`}><Icon name={a.style.icon} className="h-[18px] w-[18px]" /></div>
                  <div className="min-w-0">
                    <div className="font-semibold">{a.style.title}</div>
                    <div className="truncate text-[13px] text-muted">{a.text}</div>
                    <div className="text-[11.5px] text-[#a3a2b8]">{a.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Requests overview</h2>
              <p className="text-[13px] text-muted">Service request activity (demo data)</p>
            </div>
            <select value={range} onChange={(e) => setRange(e.target.value)} aria-label="Date range" className="h-10 rounded-xl border border-line bg-white px-3.5 text-[13px]">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </div>
          <div className="mt-3 flex items-center gap-5 text-xs text-muted">
            <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#8b7fe8]" />New requests</span>
            <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#5fd0a5]" />Completed requests</span>
          </div>
          <BarChart {...chart} />
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3 p-6 pb-4">
          <div>
            <h2 className="text-lg font-bold">Craftsmen join requests</h2>
            <p className="text-[13px] text-muted">Review new applications and take the right action.</p>
          </div>
          <a href="#/craftsmen" className="text-[13px] font-semibold text-primary-dark">View all requests</a>
        </div>
        {pendingList.length === 0 ? (
          <Empty title="Nothing to review">All join requests have been handled.</Empty>
        ) : (
          <CraftsmenTable items={pendingList.slice(0, 4)} busyId={busyId} onDetails={setSelected} onReview={review} />
        )}
      </Card>

      {selected && (
        <DetailsModal craftsman={craftsmen.find((x) => x.id === selected.id) || selected} busy={busyId === selected.id}
          onClose={() => setSelected(null)} onReview={review} />
      )}
    </>
  );
}
