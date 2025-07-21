export function ButtonWithLink({ buttonText, linkText, linkHref, onButtonClick, loading }: ButtonWithLinkProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 mt-2">
      <button
        type="button"
        onClick={onButtonClick}
        className="bg-[#303030] text-[#CCF575] font-Pretendard font-medium w-full sm:w-auto px-6 sm:px-8 py-2.5 cursor-pointer rounded-[7px] transition hover:border-1 hover:text-[#303030] hover:bg-[#76c840]"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-[#CCF575]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            Loading...
          </span>
        ) : (
          buttonText
        )}
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
  loading?: boolean;
};