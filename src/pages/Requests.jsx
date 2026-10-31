import { useState } from 'react';
import { REQUESTS } from '../mock.js';
import { downloadCsv } from '../utils.js';
import Badge from '../components/Badge.jsx';
import ExportButton from '../components/ExportButton.jsx';
import Icon from '../components/Icon.jsx';
import { Card, CardFoot, Empty, PageHead, Table, Td } from '../components/Table.jsx';

const money = (n) => `${n.toLocaleString('en-US')} EGP`;

export default function Requests() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');

  const term = q.trim().toLowerCase();
  const items = REQUESTS.filter(
    (r) => (status === 'all' || r.status === status) && (!term || `${r.id} ${r.service} ${r.customer}`.toLowerCase().includes(term))
  );

  const exportData = () =>
    downloadCsv('hirafawy-service-requests.csv', [
      ['Request no.', 'Service', 'Customer', 'Area', 'Proposed price (EGP)', 'Status'],
      ...items.map((r) => [r.id, r.service, r.customer, r.area, r.price, r.status]),
    ]);

  return (
    <>
      <PageHead eyebrow="Operations tracking" title="Service requests" sub="Track requests and the progress of each service."
        action={<ExportButton label="Export data" onClick={exportData} />} />

      <Card>
        <div className="flex flex-wrap gap-3 p-5">
          <label className="relative min-w-[220px] max-w-[420px] flex-1">
            <Icon name="search" className="absolute left-3.5 top-3 h-[19px] w-[19px] text-muted" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by request no. or service…"
              className="h-11 w-full rounded-xl border border-line bg-white pl-[42px] pr-3.5 outline-none focus:border-primary" />
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className="h-11 rounded-xl border border-line bg-white px-3.5">
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {items.length === 0 ? (
          <Empty title="No requests found">Try a different search or status filter.</Empty>
        ) : (
          <>
            <Table columns={['Request no.', 'Service', 'Customer', 'Area', 'Proposed price', 'Status']}>
              {items.map((r) => (
                <tr key={r.id} className="hover:bg-[#fcfcff]">
                  <Td className="font-semibold">{r.id}</Td>
                  <Td>{r.service}</Td>
                  <Td>{r.customer}</Td>
                  <Td>{r.area}</Td>
                  <Td>{money(r.price)}</Td>
                  <Td><Badge status={r.status} /></Td>
                </tr>
              ))}
            </Table>
            <CardFoot count={items.length} unit="request" note="Demo data for display only (no backend endpoint yet)" />
          </>
        )}
      </Card>
    </>
  );
}
