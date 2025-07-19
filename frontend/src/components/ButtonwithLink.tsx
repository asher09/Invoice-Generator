export function ButtonWithLink({ buttonText, linkText, linkHref, onButtonClick }: ButtonWithLinkProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 mt-2">
      <button
        type="button"
        onClick={onButtonClick}
        className="bg-[#303030] text-[#CCF575] font-Pretendard font-medium w-full sm:w-auto px-6 sm:px-8 py-2.5 cursor-pointer rounded-[7px] transition hover:border-1 hover:text-[#303030] hover:bg-[#76c840]"
      >
        {buttonText}
      </button>
      {linkText && (
        <a href={linkHref} className="text-[#DCDCDC] font-poppins text-sm sm:text-base hover:underline">
          {linkText}
        </a>
      )}
    </div>
  );
}

type ButtonWithLinkProps = {
  buttonText: string;
  linkText: string;
  linkHref: string;
  onButtonClick?: () => void;
};