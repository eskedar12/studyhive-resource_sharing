const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-[#111827] border border-slate-800 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  </div>
);

export default TypingIndicator;