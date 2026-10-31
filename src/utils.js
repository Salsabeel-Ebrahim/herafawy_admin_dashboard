export const STATUS = {
  pending: 'Under review', approved: 'Approved', rejected: 'Rejected',
  active: 'Active', suspended: 'Suspended',
  new: 'New', in_progress: 'In progress', completed: 'Completed', cancelled: 'Cancelled',
};

export const ROLE = { customer: 'Customer', craftsman: 'Craftsman', admin: 'Admin' };

export function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso.length <= 10 ? iso + 'T00:00:00' : iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function timeAgo(iso) {
  if (!iso) return '';
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.round(h / 24);
  return `${d} day${d === 1 ? '' : 's'} ago`;
}

export const AVATAR_COLORS = [
  'bg-[#e9e6fb] text-[#5b50d6]',
  'bg-[#e0f5ec] text-[#12805c]',
  'bg-[#fdf0d6] text-[#b8710c]',
  'bg-[#fde7ea] text-[#c2394b]',
];

// rows: array of arrays
export function downloadCsv(filename, rows) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = '\uFEFF' + rows.map((r) => r.map(esc).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
