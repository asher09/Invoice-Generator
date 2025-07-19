import { Logo } from '../components/Logo';

interface NavBarProps {
    type: 'Register' | 'Login' | 'Logout';
    onButtonClick?: () => void;
}

export function Navbar({type, onButtonClick} : NavBarProps) {
    return (
        <div>
            <div className="flex justify-between w-full bg-[#1f1f1f] py-2.5 px-4 sm:px-8 md:px-15">
                <Logo />
                <div>
                    <button type="button" 
                            className="text-black bg-[#CCF575] cursor-pointer hover:bg-[#1f1f1f] hover:border-1 hover:text-[#CCF575] font-medium rounded-lg text-sm px-4 sm:px-5.5 py-3 text-center"
                            onClick={onButtonClick}>
                        {type === "Register" ? "Register" : type === "Logout" ? "Logout" : "Login"}
                    </button>
                </div>
            </div>
        </div>
    )
}