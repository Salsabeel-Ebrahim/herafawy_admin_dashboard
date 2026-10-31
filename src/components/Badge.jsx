import { STATUS } from '../utils.js';

const TONES = {
  pending: 'bg-warn-soft text-warn',
  approved: 'bg-ok-soft text-ok', completed: 'bg-ok-soft text-ok', active: 'bg-ok-soft text-ok',
  rejected: 'bg-bad-soft text-bad', suspended: 'bg-bad-soft text-bad', cancelled: 'bg-bad-soft text-bad',
  new: 'bg-primary-soft text-primary', in_progress: 'bg-primary-soft text-primary',
};

export default function Badge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold ${TONES[status] || ''}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS[status] || status}
    </span>
  );
}
