
import { Navbar } from './../components/Navbar';
import { LabelledInput } from '../components/LabelledInput';
import { HeadingSection } from '../components/HeadingSection';
import { ButtonWithLink } from '../components/ButtonwithLink';
import login3 from '../assets/login3.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config.ts';
import axios from 'axios';

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const sendRequest = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/user/signup`, {
                name,
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            alert('Registration Successfull');
            console.log('Registration response:', response.data);
            navigate('/login')
        } catch (error) {
            console.error('Error during registration:', error);
            // alert('Registration failed. Please try again.');
        }
    }
    const navButton = () => {
        navigate('/login')
    }
    
    return (
        <div className="bg-[#141414] w-full h-full items-center">
            <Navbar type={"Login"} onButtonClick={navButton} />
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
                                value={name}
                                onChange={(e) => {setName(e.target.value)}}
                            />
                            <LabelledInput
                                label="Email Address"
                                placeholder="Enter Email ID"
                                subtitle="This email will be displayed with your inquiry"
                                value={email}
                                onChange={(e) => {setEmail(e.target.value)}}
                            />
                            <LabelledInput
                                label="Password"
                                placeholder="Enter the Password"
                                subtitle="Any further updates will be forwarded on this Email ID"
                                value={password}
                                onChange={(e) => {setPassword(e.target.value)}}
                                type="password"
                            />
                            <ButtonWithLink
                                buttonText="Register"
                                linkText="Already have account ?"
                                linkHref="/login"
                                onButtonClick={sendRequest}
                            />
                        </div>
                        <div className="w-3/5 flex items-center justify-center pr-0 -mr-30 ">
                            <img src={login3} alt="Connecting People Billboard" className="w-[95%] h-[95%] object-cover border rounded-[60px]  "/>
                        </div>
                    </div>
                </div>
        </div>
    )
}