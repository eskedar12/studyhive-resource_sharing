const TagBadge = ({ tag, onClick, active = false }) => (
  <button
    onClick={onClick}
    className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors cursor-pointer
      ${active
        ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
        : 'bg-[#1a2640] text-sky-400 border-sky-900/40 hover:border-sky-500/50 hover:text-sky-300'
      }`}
  >
    {tag.startsWith('#') ? tag : `#${tag}`}
  </button>
);

export default TagBadge;