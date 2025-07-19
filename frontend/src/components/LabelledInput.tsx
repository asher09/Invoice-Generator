type LabelledInputProps = {
  label: string;
  placeholder: string;
  subtitle: string;
  type?: string;
  value: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export function LabelledInput({ label, placeholder, subtitle, value, type, onChange }: LabelledInputProps) {
  return (
    <div className="mb-5">
      <span className="block text-white font-poppins font-medium text-[16px] mb-1">{label}</span>
      <input
        type={type || "text"}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className="w-full text-white bg-[#202020] border border-[#424647] rounded-[4px] h-[44px] px-4 py-7 font-poppins text-[14px] focus:outline-none mb-1"
        required
      />
      <span className="text-[#B8B8B8] font-poppins text-[14px]">{subtitle}</span>
    </div>
  );
}