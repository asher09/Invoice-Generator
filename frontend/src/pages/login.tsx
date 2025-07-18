import { Navbar } from './../components/Navbar';
import { LabelledInput } from '../components/LabelledInput';
import { HeadingSection } from '../components/HeadingSection';
import { ButtonWithLink } from '../components/ButtonwithLink';
import { Logo } from './../components/Logo';
import login1 from '../assets/login1.png';
import login2 from '../assets/login2.jpg';
import login3 from '../assets/login3.png';
import {useState, useEffect} from 'react';
import { BACKEND_URL } from '../config.ts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const [images, setImages] = useState(0);
    const imagesArr = [login1, login2, login3];
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setImages((prev) => (prev+1) % imagesArr.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [imagesArr.length]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const sendRequest = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/user/signin`, {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            localStorage.setItem('token', response.data.token);
            console.log('Registration response:', response.data);
            console.log(response.data.token);
            navigate('/addproducts');
        } catch (error) {
            console.error('Error during registration:', error);
            // alert('Registration failed. Please try again.');
        }
        
    }
    const navButton = () => {
            navigate('/')
        }

    return (
        <div className="bg-[#141414] relative min-h-screen min-w-screen  overflow-x-hidden overflow-hidden">
            <Navbar type={"Register"} onButtonClick={navButton} />
            <div className="absolute left-2/5 top-1/4 transform -translate-y-1/2 w-[350px] h-[350px] bg-[#90E163] opacity-30 blur-[120px] z-0"></div>
            <div className="absolute -left-1/10 -bottom-1/4 transform -translate-y-1/2  w-[350px] h-[350px] bg-[#90E163] opacity-43 blur-[120px] z-0"></div>
            <div className="absolute -right-1/12 top-1/3 transform -translate-y-1/2 w-[350px] h-[350px] bg-[#4F59A8] opacity-45 blur-[120px] z-0"></div>

                <div className="flex justify-center items-center min-h-screen w-screen ">
                    <div className="flex flex-row justify-between w-screen h-full from-[#141414] via-[#222c18] to-[#2c2c2c] overflow-hidden ">
                        <div className="w-1/2 h-[100%] flex items-center justify-center">
                            <div className="relative w-[700px] h-[800px] overflow-hidden rounded-[30px]">                   
                                <div className="flex transition-transform duration-700 h-full flex-center" 
                                    style={{transform: `translateX(-${images * 560}px)`, 
                                }}
                                > 
                                    {imagesArr.map((img, idx) => (
                                        <img key={idx}
                                            src={img}
                                            alt={`Slide ${idx + 1}`}
                                            className="w-[550px] px-2.5 h[740px] object-cover rounded-[40px] last:mr-0"
                                        />
                                        ))}

                                </div>
                            </div>
                        </div>
                        <div className="w-1/2 flex flex-col pr-55 pl-10 py-12 ">
                            <div className="flex gap-3 mb-6" >
                                <Logo />
                            </div>
                            <HeadingSection
                                title="Let the Journey Begin!"
                                subtitle="This is basic login page which is used for levitation assignment purpose."
                            />
                            <LabelledInput
                                label="Email Address"
                                placeholder="Enter Email ID"
                                subtitle="This email will be displayed with your inquiry"
                                value={email}
                                onChange={(e) => {setEmail(e.target.value)}}
                            />
                            <LabelledInput
                                label=" Current Password"
                                placeholder="Enter the Password"
                                subtitle=""
                                type="password"
                                value={password}
                                onChange={(e) => {setPassword(e.target.value)}}
                            />
                            <ButtonWithLink
                                buttonText="Login"
                                linkText="Dont have an account?"
                                linkHref="/"
                                onButtonClick={sendRequest}
                            />
                        </div>
                    </div>
                </div>
        </div>
    )
}