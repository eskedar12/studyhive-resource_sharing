import { getFileIcon, formatFileSize } from '../../utils/fileHelpers.js';
import { Download } from 'lucide-react';

const FileAttachment = ({ file }) => {
  const isImage = file.mimetype?.startsWith('image/');

  // Remove fl_attachment transformation from URL — just open directly
  const cleanUrl = file.url?.replace(/\/fl_attachment:[^/]+\//, '/');

  return (
    <div className="rounded-lg overflow-hidden border border-slate-700 hover:border-sky-700 transition-colors">
      {isImage && (
        <a href={cleanUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={cleanUrl}
            alt={file.name}
            className="max-h-48 w-full object-contain bg-[#0a0f1e]"
          />
        </a>
      )}

      <a
        href={cleanUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center gap-3 bg-[#111827] px-3 py-2 hover:bg-[#1a2640] transition-colors group text-left"
      >
        <span className="text-lg shrink-0">{getFileIcon(file.mimetype)}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-300 truncate group-hover:text-sky-400">
            {file.name || 'Download file'}
          </p>
          {file.size && (
            <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
          )}
        </div>
        <Download size={14} className="text-slate-500 group-hover:text-sky-400 shrink-0" />
      </a>
    </div>
  );
};

export default FileAttachment;
