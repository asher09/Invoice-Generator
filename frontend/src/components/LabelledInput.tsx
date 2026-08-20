type LabelledInputProps = {
  label: string;
  placeholder: string;
  subtitle: string;
  type?: string;
  value: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  trailingText?: string;
  onTrailingClick?: () => void;
};

export function LabelledInput({ label, placeholder, subtitle, value, type, onChange, trailingText, onTrailingClick }: LabelledInputProps) {
  return (
    <div className="mb-5">
      <span className="block text-white font-poppins font-medium text-[16px] mb-1">{label}</span>
      <div className="relative">
        <input
          type={type || "text"}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          className={`w-full text-white bg-[#202020] border border-[#424647] rounded-[4px] h-[44px] px-4 py-7 font-poppins text-[14px] focus:outline-none mb-1 ${trailingText ? 'pr-20' : ''}`}
          required
        />
        {trailingText && onTrailingClick && (
          <button
            type="button"
            onClick={onTrailingClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] hover:text-[#90E163] font-poppins text-[11px] cursor-pointer transition-colors"
          >
            {trailingText}
          </button>
        )}
      </div>
      <span className="text-[#B8B8B8] font-poppins text-[14px]">{subtitle}</span>
    </div>
  );
}