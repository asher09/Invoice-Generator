import Logo from '../assets/logo.svg';

export function Navbar() {

    return (
        <div >
            <div className="flex justify-between w-full bg-[#1f1f1f] py-2.5 px-15">
                <div className="flex flex-row pl-15 " > 
                    <div>
                        <img src={Logo} alt="Logo" className="w-10.5 h-10.5" />
                    </div>
                    <div className="flex flex-col px-2 pl-3" >
                        <div className="text-white font-normal text-[20px] " >
                            levitation
                        </div>
                        <div className="text-white font-normal text-[10px] " >
                            infotech
                        </div>
                    </div>
                </div>
                <div>
                    <button type="button" className="text-black bg-[#CCF575] cursor-pointer hover:bg-[#1f1f1f] hover:border-1  hover:text-[#CCF575] font-medium rounded-lg text-sm px-5.5 py-3 text-center me-2">Login</button>
                </div>
            </div>
      </div>
    )
}