import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0d1425] border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-slate-800">
            <h2 className="font-bold text-white text-lg">{title}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;