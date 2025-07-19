export function HeadingSection({ title, subtitle }: HeadingSectionProps) {
  return (
    <>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-white font-poppins font-bold text-[28px] sm:text-[32px] md:text-[40px] leading-tight mb-2">{title}</h1>
          <p className="text-[#A7A7A7] text-[16px] sm:text-[18px] md:text-[20px] font-poppins">{subtitle}</p>
        </div>
    </>
  )
}

type HeadingSectionProps = {
  title: string;
  subtitle: string;
};