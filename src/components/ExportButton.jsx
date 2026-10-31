import Icon from './Icon.jsx';

export default function ExportButton({ label, onClick }) {
  return (
    <button onClick={onClick} className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary-dark">
      <Icon name="download" className="h-4 w-4" />{label}
    </button>
  );
}
