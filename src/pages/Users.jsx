import { useState } from 'react';
import { useData } from '../store.jsx';
import { ROLE, downloadCsv, fmtDate } from '../utils.js';
import Badge from '../components/Badge.jsx';
import ExportButton from '../components/ExportButton.jsx';
import Icon from '../components/Icon.jsx';
import Person from '../components/Person.jsx';
import { Card, CardFoot, Empty, PageHead, Table, Td } from '../components/Table.jsx';

export default function Users() {
  const { loading, error, accounts, busyId, setAccountStatus, localOnly } = useData();
  const [q, setQ] = useState('');
  const [role, setRole] = useState('all');

  const term = q.trim().toLowerCase();
  const items = accounts.filter(
    (a) => (role === 'all' || a.role === role) && (!term || `${a.name} ${a.email}`.toLowerCase().includes(term))
  );

  const exportData = () =>
    downloadCsv('hirafawy-users.csv', [
      ['Name', 'Email', 'Account type', 'Registered', 'Status'],
      ...items.map((a) => [a.name, a.email, ROLE[a.role], fmtDate(a.joinedAt), a.status]),
    ]);

  return (
    <>
      <PageHead eyebrow="Account management" title="Users" sub="Browse customer and craftsman accounts."
        action={<ExportButton label="Export data" onClick={exportData} />} />

      <Card>
        <div className="flex flex-wrap gap-3 p-5">
          <label className="relative min-w-[220px] max-w-[420px] flex-1">
            <Icon name="search" className="absolute left-3.5 top-3 h-[19px] w-[19px] text-muted" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email…"
              className="h-11 w-full rounded-xl border border-line bg-white pl-[42px] pr-3.5 outline-none focus:border-primary" />
          </label>
          <select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Filter by role" className="h-11 rounded-xl border border-line bg-white px-3.5">
            <option value="all">All roles</option>
            <option value="customer">Customers</option>
            <option value="craftsman">Craftsmen</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted">Loading…</div>
        ) : items.length === 0 ? (
          <Empty title={error ? "Couldn't load users" : 'No users found'}>{error || 'Try a different search or role filter.'}</Empty>
        ) : (
          <>
            <Table columns={['User', 'Account type', 'Registered', 'Status', 'Action']} actionsLast>
              {items.map((a, i) => (
                <tr key={a.id} className="hover:bg-[#fcfcff]">
                  <Td><Person name={a.name} email={a.email} index={i} /></Td>
                  <Td>{ROLE[a.role]}</Td>
                  <Td>{fmtDate(a.joinedAt)}</Td>
                  <Td><Badge status={a.status} /></Td>
                  <Td className="text-right">
                    {a.role === 'admin' ? <span className="text-muted">—</span> : a.status === 'active' ? (
                      <button disabled={busyId === a.id} onClick={() => setAccountStatus(a, 'suspended')}
                        className="h-8 rounded-[9px] border border-bad-line bg-bad-soft px-3 text-[12.5px] font-semibold text-bad transition hover:bg-[#fbdcda] disabled:opacity-50">Suspend account</button>
                    ) : (
                      <button disabled={busyId === a.id} onClick={() => setAccountStatus(a, 'active')}
                        className="h-8 rounded-[9px] border border-ok-line bg-ok-soft px-3 text-[12.5px] font-semibold text-ok transition hover:bg-[#d3f0e3] disabled:opacity-50">Activate account</button>
                    )}
                  </Td>
                </tr>
              ))}
            </Table>
            <CardFoot count={items.length} unit="user" note={localOnly.account ? 'Suspend / activate is saved in this browser only for now' : 'Live data'} />
          </>
        )}
      </Card>
    </>
  );
}
