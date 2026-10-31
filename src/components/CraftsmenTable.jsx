import { fmtDate } from '../utils.js';
import Badge from './Badge.jsx';
import Person from './Person.jsx';
import { Table, Td } from './Table.jsx';

const btn = 'ml-1.5 h-8 rounded-[9px] border px-3 text-[12.5px] transition disabled:opacity-50';

export default function CraftsmenTable({ items, busyId, onDetails, onReview }) {
  return (
    <Table columns={['Craftsman', 'Specialty', 'Area', 'Submitted', 'Status', 'Actions']} actionsLast>
      {items.map((c, i) => (
        <tr key={c.id} className="hover:bg-[#fcfcff]">
          <Td><Person name={c.name} email={c.email} index={i} /></Td>
          <Td>{c.specialty}</Td>
          <Td>{[c.area, c.city].filter(Boolean).join(', ') || '—'}</Td>
          <Td>{fmtDate(c.submittedAt)}</Td>
          <Td><Badge status={c.status} /></Td>
          <Td className="whitespace-nowrap text-right">
            <button className={`${btn} border-line bg-white font-medium text-[#3d3c55] hover:bg-[#f5f5fa]`} onClick={() => onDetails(c)}>Details</button>
            {c.status === 'pending' && (
              <>
                <button disabled={busyId === c.id} className={`${btn} border-ok-line bg-ok-soft font-semibold text-ok hover:bg-[#d3f0e3]`} onClick={() => onReview(c, 'approve')}>Approve</button>
                <button disabled={busyId === c.id} className={`${btn} border-bad-line bg-bad-soft font-semibold text-bad hover:bg-[#fbdcda]`} onClick={() => onReview(c, 'reject')}>Reject</button>
              </>
            )}
          </Td>
        </tr>
      ))}
    </Table>
  );
}
