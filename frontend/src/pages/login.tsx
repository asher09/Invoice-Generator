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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setImages((prev) => (prev+1) % imagesArr.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [imagesArr.length]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const sendRequest = async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }
    
    const navButton = () => {
        navigate('/')
    }

    return (
        <div className="bg-[#141414] relative min-h-screen overflow-x-hidden">
            <Navbar type={"Register"} onButtonClick={navButton} />
            <div className="absolute left-2/5 top-1/4 transform -translate-y-1/2 w-[350px] h-[350px] bg-[#90E163] opacity-30 blur-[120px] z-0"></div>
            <div className="absolute -left-1/10 -bottom-1/4 transform -translate-y-1/2  w-[350px] h-[350px] bg-[#90E163] opacity-43 blur-[120px] z-0"></div>
            <div className="absolute -right-1/12 top-1/3 transform -translate-y-1/2 w-[350px] h-[350px] bg-[#4F59A8] opacity-45 blur-[120px] z-0"></div>

            <div className="flex justify-center items-center min-h-screen">
                <div className="flex flex-col md:flex-row justify-between w-full h-full from-[#141414] via-[#222c18] to-[#2c2c2c] overflow-hidden">
                    <div className="hidden md:flex md:w-1/2 h-full items-center justify-center">
                        <div className="relative w-[400px] lg:w-[700px] h-[600px] lg:h-[800px] overflow-hidden rounded-[30px]">                   
                            <div className="flex transition-transform duration-700 h-full flex-center" 
                                style={{transform: `translateX(-${images * (window.innerWidth > 1024 ? 560 : 320)}px)`}}
                            > 
                                {imagesArr.map((img, idx) => (
                                    <img key={idx}
                                        src={img}
                                        alt={`Slide ${idx + 1}`}
                                        className="w-[300px] lg:w-[550px] px-2.5 h-[580px] lg:h-[740px] object-cover rounded-[40px] last:mr-0"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-1/2 flex flex-col px-4 sm:px-8 md:px-10 lg:pr-16 py-8 md:py-12">
                        <div className="flex gap-3 mb-6">
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
                            label="Current Password"
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
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}