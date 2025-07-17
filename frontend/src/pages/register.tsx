
import { Navbar } from './../components/Navbar';
import { LabelledInput } from '../components/LabelledInput';
import { HeadingSection } from '../components/HeadingSection';
import { ButtonWithLink } from '../components/ButtonwithLink';
import BillboardMockup from '../assets/BillboardMockup.png';

export function Register() {
    
    return (
        <div className="bg-[#141414] w-full h-full items-center">
            <Navbar/>
            <div className="absolute left-2/5 top-1/4 transform -translate-y-1/2 w-[300px] h-[300px] bg-[#90E163] opacity-30 blur-[120px] z-0"></div>
            <div className="absolute -left-1/10 -bottom-1/4 transform -translate-y-1/2  w-[300px] h-[300px] bg-[#90E163] opacity-43 blur-[120px] z-0"></div>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="flex flex-row justify-between from-[#141414] via-[#222c18] to-[#2c2c2c] overflow-hidden relative z-10 w-full ">
                        <div className="flex flex-col  pr-15 pl-40 py-8 w-2/5">
                            <HeadingSection
                                title="Sign up to begin journey"
                                subtitle="This is basic signup page which is used for levitation assignment purpose."
                            />
                            <LabelledInput
                                label="Enter your name"
                                placeholder="Enter Email ID"
                                subtitle="This name will be displayed with your inquiry"
                            />
                            <LabelledInput
                                label="Email Address"
                                placeholder="Enter Email ID"
                                subtitle="This email will be displayed with your inquiry"
                            />
                            <LabelledInput
                                label="Password"
                                placeholder="Enter the Password"
                                subtitle="Any further updates will be forwarded on this Email ID"
                                type="password"
                            />
                            <ButtonWithLink
                                buttonText="Register"
                                linkText="Already have account ?"
                                linkHref="/login"
                            />
                        </div>
                        <div className="w-3/5 flex items-center justify-center pr-0 -mr-30 ">
                            <img src={BillboardMockup} alt="Connecting People Billboard" className="w-[95%] h-[95%] object-cover border rounded-[60px]  "/>
                        </div>
                    </div>
                </div>
        </div>
    )
}