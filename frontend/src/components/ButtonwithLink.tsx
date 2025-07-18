

export function ButtonWithLink({ buttonText, linkText, linkHref, onButtonClick }: ButtonWithLinkProps) {
    
  return (
    <div className="flex items-center gap-5 mt-2">
      <button
        type="button"
        onClick={onButtonClick}
        className="bg-[#303030] text-[#CCF575] font-Pretendard font-weight-[500]
        font-medium px-6 py-2.5 cursor-pointer rounded-[7px] transition hover:border-1 hover:text-[#303030] hover:bg-[#76c840]"
      >
        {buttonText}
      </button>
      <a href={linkHref} className="text-[#DCDCDC] font-poppins text-base hover:underline">
        {linkText}
      </a>
    </div>
  );
}




type ButtonWithLinkProps = {
  buttonText: string;
  linkText: string;
  linkHref: string;
  onButtonClick?: () => void;
};