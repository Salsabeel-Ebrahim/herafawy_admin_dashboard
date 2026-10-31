import { useState } from 'react';
import { useData } from '../store.jsx';
import CraftsmenTable from '../components/CraftsmenTable.jsx';
import DetailsModal from '../components/DetailsModal.jsx';
import Icon from '../components/Icon.jsx';
import { Card, CardFoot, Empty, PageHead } from '../components/Table.jsx';

export default function Craftsmen() {
  const { loading, error, craftsmen, busyId, review, localOnly } = useData();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState(null);

  const term = q.trim().toLowerCase();
  const items = craftsmen.filter(
    (c) =>
      (status === 'all' || c.status === status) &&
      (!term || [c.name, c.email, c.specialty, c.area, c.city].join(' ').toLowerCase().includes(term))
  );

  return (
    <>
      <PageHead title="Craftsmen" sub="Review applications and approve or reject new craftsmen." />

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="relative min-w-[220px] max-w-[420px] flex-1">
          <Icon name="search" className="absolute left-3.5 top-3 h-[19px] w-[19px] text-muted" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or specialty…"
            className="h-11 w-full rounded-xl border border-line bg-white pl-[42px] pr-3.5 outline-none focus:border-primary" />
        </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className="h-11 rounded-xl border border-line bg-white px-3.5">
          <option value="all">All statuses</option>
          <option value="pending">Under review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <Card>
        {loading ? (
          <div className="p-12 text-center text-muted">Loading…</div>
        ) : items.length === 0 ? (
          <Empty title={error ? "Couldn't load craftsmen" : 'No craftsmen found'}>{error || 'Try a different search or status filter.'}</Empty>
        ) : (
          <>
            <CraftsmenTable items={items} busyId={busyId} onDetails={setSelected} onReview={review} />
            <CardFoot count={items.length} note={localOnly.review ? 'Approve / reject is saved in this browser only for now' : 'Live data'} />
          </>
        )}
      </Card>

      {selected && (
        <DetailsModal craftsman={craftsmen.find((x) => x.id === selected.id) || selected} busy={busyId === selected.id}
          onClose={() => setSelected(null)} onReview={review} />
      )}
    </>
  );
}
