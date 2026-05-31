const variants = {
  primary: 'bg-sky-500 hover:bg-sky-400 text-white',
  secondary: 'bg-transparent border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white',
  danger: 'bg-red-600 hover:bg-red-500 text-white',
  ghost: 'text-slate-400 hover:text-white hover:bg-[#111827]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}) => (
  <button
    className={`font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
      ${variants[variant]} ${sizes[size]} ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

export default Button;