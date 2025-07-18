
import { Navbar } from './../components/Navbar';
import { HeadingSection } from './../components/HeadingSection';
import { LabelledInput } from '../components/LabelledInput';
import { ButtonWithLink } from './../components/ButtonwithLink';
import { useState } from 'react';
import { BACKEND_URL } from '../config.ts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function AddProducts() {
    const [products, setProducts] = useState<{name: string, price: number|string, qty: number|string}[]>([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [qty, setQty] = useState('');
    const navigate = useNavigate();

    const total = products.reduce((sum, p) => sum + Number(p.price) * Number(p.qty),0);
    const gst = (total*0.18).toFixed(2);
    const grandTotal = (total + Number(gst)).toFixed(2);


    const handleAddProducts = () => {
        if(!name || !price || !qty) return ;
        setProducts([...products, {name, price, qty }]);
        setName('');
        setPrice('');
        setQty('');
    };

    const handleGeneratePDF = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`${BACKEND_URL}/api/invoice/generate`, {
                products: products.map(p=> ({
                    name: p.name,
                    qty: Number(p.qty),
                    rate: Number(p.price)
                }))
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` ,
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'inovoice.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            alert('Failed to gnerate PDf')
        }

    }
    const navButton = () => {
        navigate('/login');
        localStorage.removeItem('toke')
    }



    return (
        <div className="bg-[#141414] min-h-screen w-full">
            <Navbar type={"Logout"} onButtonClick={navButton} />
            <div className="absolute left-1/3 top-1 transform -translate-y-1/2 w-[350px] h-[350px] bg-[#4F59A8] opacity-45 blur-[120px] z-0"></div>
            <div className="justify-center w-full px-40 py-25 " >
                <div className="flex flex-col justify-center items-start">
                    <div className="w-[40%] py-5" >
                        <HeadingSection 
                            title="Add Products"
                            subtitle="This is basic login page which is used for levitation assignment purpose."
                        />
                    </div>
                    <div className="w-full" >
                        <div className="flex gap-8">
                            <div className="w-1/3">
                                <LabelledInput
                                    label="Product Name"
                                    placeholder="Enter the product name"
                                    subtitle=""
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div className="w-1/3">
                                <LabelledInput
                                    label="Product Price"
                                    placeholder="Enter the price"
                                    subtitle=""
                                    type="number"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="w-1/3">
                                <LabelledInput
                                    label="Quantity"
                                    placeholder="Enter the Qty"
                                    subtitle=""
                                    type="number"
                                    value={qty}
                                    onChange={e => setQty(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center m-10" >
                            <ButtonWithLink
                                buttonText="Add Product  +"
                                linkText=""
                                linkHref=""
                                onButtonClick={handleAddProducts}
                            />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto p-5 w-full">
                        <table className="min-w-full text-white rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-[#ffffff] text-[#000000] text-[14px] font-normal">
                                    <th className="px-4 py-2 text-left">Product name</th>
                                    <th className="px-4 py-2 text-left">Price</th>
                                    <th className="px-4 py-2 text-left">Quantity <span className="inline-block">&#8595;</span></th>
                                    <th className="px-4 py-2 text-left">Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p, idx) => (
                                  <tr key={idx} className="border border-[#3F3F3F]">
                                    <td className="px-4 py-2 text-[14px] font-normal">{p.name}</td>
                                    <td className="px-4 py-2 text-[14px] font-normal ">{p.price}</td>
                                    <td className="px-4 py-2 text-[14px] font-normal ">{p.qty}</td>
                                    <td className="px-4 py-2 text-[14px] font-normal ">INR {Number(p.price) * Number(p.qty)}</td>
                                </tr>  
                                ))}
                                <tr className="border border-[#3f3f3f]" >
                                    <td colSpan={3} className="px-4 py-2 text-right text-[#ffffff]">Sub-Total</td>
                                    <td className="px-4 py-2 text-[14px] font-normal ">INR {total}</td>
                                </tr>
                                <tr className="border border-[#3f3f3f]" >
                                    <td colSpan={3} className="px-4 py-2 text-right text-[#ffffff]">Incl + GST 18%</td>
                                    <td className="px-4 py-2 text-[14px] font-normal ">INR {grandTotal}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="flex justify-center p-10" >
                          <button className="bg-[#303030] text-[#CCF575] font-semibold font-weight-[500]
                                            3030] hover:bg-[#76c840] px-20 py-2.5 rounded-[7px] hover:text-[#303030] cursor-pointer"
                                    onClick={handleGeneratePDF}>
                                Generate PDF Invoice
                            </button>  
                        </div>
                        
                    </div>
                </div>
            </div>
            
        </div>
    )
}