import { Clock, CheckCircle, HelpCircle } from 'lucide-react';

const filters = [
  { key: 'new',      label: 'New',      Icon: Clock        },
  { key: 'solved',   label: 'Solved',   Icon: CheckCircle  },
  { key: 'unsolved', label: 'Unsolved', Icon: HelpCircle   },
];

const PostFilter = ({ active, onChange }) => (
  <div className="flex gap-1 bg-[#0d1425] border border-slate-800 rounded-lg p-1 w-fit">
    {filters.map(({ key, label, Icon }) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          active === key
            ? 'bg-sky-500/20 text-sky-400'
            : 'text-slate-400 hover:text-white hover:bg-[#111827]'
        }`}
      >
        <Icon size={14} />
        {label}
      </button>
    ))}
  </div>
);

export default PostFilter;
