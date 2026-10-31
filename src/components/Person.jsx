import { AVATAR_COLORS } from '../utils.js';

export function Avatar({ name, index = 0, size = 'h-[38px] w-[38px]' }) {
  return (
    <div className={`grid ${size} flex-none place-items-center rounded-[11px] font-semibold ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}>
      {name.trim()[0]?.toUpperCase()}
    </div>
  );
}

export default function Person({ name, email, index }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={name} index={index} />
      <div>
        <div className="font-semibold leading-tight">{name}</div>
        <div className="text-[11.5px] text-muted">{email}</div>
      </div>
    </div>
  );
}
