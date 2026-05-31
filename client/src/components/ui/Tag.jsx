import { X } from 'lucide-react';

const Tag = ({ label, onRemove }) => (
  <span className="tag-badge flex items-center gap-1">
    {label.startsWith('#') ? label : `#${label}`}
    {onRemove && (
      <button onClick={onRemove} className="hover:text-white transition-colors ml-1">
        <X size={10} />
      </button>
    )}
  </span>
);

export default Tag;