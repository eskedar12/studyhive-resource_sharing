const Input = ({ label, error, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm text-slate-400 mb-1">{label}</label>}
    <input
      className={`input-field ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

export default Input;