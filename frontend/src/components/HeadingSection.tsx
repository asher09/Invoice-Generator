

export function HeadingSection({ title, subtitle }: HeadingSectionProps) {

  return (
    <>
        <div className="mb-8">
          <h1 className="text-white font-poppins font-bold text-[40px] leading-tight mb-2">{title}</h1>
          <p className="text-[#DCDCDC] text-[20px] font-poppins text-base">{subtitle}</p>
        </div>
    </>
  )
}



type HeadingSectionProps = {
  title: string;
  subtitle: string;
};