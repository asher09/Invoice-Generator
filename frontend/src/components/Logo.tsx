import logo from '../assets/Logo.svg';

export function Logo() {
    
    return (
        <div className="flex flex-row" > 
                    <div>
                        <img src={logo} alt="Logo" className="w-10.5 h-10.5" />
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
    )
}