type LabelledInputProps = {
  label: string;
  placeholder: string;
  subtitle: string;
  type?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export function LabelledInput({ label, placeholder, subtitle, type, onChange }: LabelledInputProps) {
  return (
    <div className="mb-5">
      <span className="block text-white font-poppins font-medium text-[16px] mb-1">{label}</span>
      <input
        type={type || "text"}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full bg-[#202020] border border-[#424647] rounded-[4px] h-[44px] px-4 py-7 text-[#707070] font-poppins text-[14px] focus:outline-none mb-1"
        required
      />
      <span className="text-[#B8B8B8] font-poppins text-[14px]">{subtitle}</span>
    </div>
  );
}