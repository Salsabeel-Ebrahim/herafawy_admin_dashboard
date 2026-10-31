// Backend response: { message, count, data: [ ...users ] }
export function extractList(data) {
  if (Array.isArray(data)) return data;
  for (const k of ['data', 'users', 'result', 'results', 'items']) {
    if (Array.isArray(data?.[k])) return data[k];
  }
  return [];
}

const fullName = (u) => `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email || 'Unknown';

// A craftsman is a user with role "Provider"
export const isCraftsman = (u) => String(u.role ?? '').toLowerCase() === 'provider';

// verificationStatus: Pending / Approved / Rejected
function toVerification(u) {
  const s = String(u.verificationStatus ?? '').toLowerCase();
  if (['approved', 'verified', 'accepted'].includes(s)) return 'approved';
  if (['rejected', 'declined'].includes(s)) return 'rejected';
  return 'pending';
}

export function toCraftsman(u) {
  return {
    id: u._id ?? u.id,
    name: fullName(u),
    email: u.email ?? '',
    specialty: u.title || '—',
    area: u.address?.district ?? '',
    city: u.address?.governorate ?? '',
    submittedAt: u.createdAt ?? '',
    status: toVerification(u),
  };
}

// Used by the Users page (customers, craftsmen and admins)
export function toAccount(u) {
  const r = String(u.role ?? '').toLowerCase();
  const s = String(u.status ?? '').toLowerCase();
  return {
    id: u._id ?? u.id,
    name: fullName(u),
    email: u.email ?? '',
    role: r === 'provider' ? 'craftsman' : r === 'admin' ? 'admin' : 'customer',
    joinedAt: u.createdAt ?? '',
    status: ['suspended', 'blocked', 'inactive', 'banned'].includes(s) ? 'suspended' : 'active',
  };
}
