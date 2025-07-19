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
            link.setAttribute('download', 'invoice.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            alert('Failed to generate PDF')
        }
    }
    
    const navButton = () => {
        navigate('/login');
        localStorage.removeItem('token')
    }

    return (
        <div className="bg-[#141414] min-h-screen w-full overflow-x-hidden">
            <Navbar type={"Logout"} onButtonClick={navButton} />
            
            {/* Background decorative element - responsive */}
            <div className="absolute left-1/4 sm:left-1/3 top-1 w-[250px] sm:w-[300px] lg:w-[350px] h-[250px] sm:h-[300px] lg:h-[350px] bg-[#4F59A8] opacity-45 blur-[80px] sm:blur-[100px] lg:blur-[120px] z-0"></div>
            
            <div className="flex justify-center w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-40 py-6 sm:py-8 md:py-12 lg:py-25">
                <div className="flex flex-col justify-center items-start w-full max-w-7xl relative z-10">
                    
                    {/* Header Section */}
                    <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[40%] py-4 sm:py-5 mb-4 sm:mb-6">
                        <HeadingSection 
                            title="Add Products"
                            subtitle="This is basic login page which is used for levitation assignment purpose."
                        />
                    </div>
                    
                    {/* Input Form Section */}
                    <div className="w-full mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
                            <div className="w-full sm:w-1/3">
                                <LabelledInput
                                    label="Product Name"
                                    placeholder="Enter the product name"
                                    subtitle=""
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-1/3">
                                <LabelledInput
                                    label="Product Price"
                                    placeholder="Enter the price"
                                    subtitle=""
                                    type="number"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-1/3">
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
                        
                        {/* Add Product Button */}
                        <div className="flex justify-center mt-6 sm:mt-8 lg:mt-10">
                            <ButtonWithLink
                                buttonText="Add Product  +"
                                linkText=""
                                linkHref=""
                                onButtonClick={handleAddProducts}
                            />
                        </div>
                    </div>
                    
                    {/* Table Section */}
                    <div className="w-full p-2 sm:p-4 lg:p-5">
                        {/* Mobile Card View for small screens */}
                        <div className="block sm:hidden">
                            <h3 className="text-white text-lg font-semibold mb-4">Products</h3>
                            {products.map((p, idx) => (
                                <div key={idx} className="bg-[#202020] border border-[#3F3F3F] rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white font-medium">{p.name}</span>
                                        <span className="text-[#CCF575] font-semibold">INR {Number(p.price) * Number(p.qty)}</span>
                                    </div>
                                    <div className="text-sm text-gray-300">
                                        <div>Price: INR {p.price}</div>
                                        <div>Quantity: {p.qty}</div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Mobile Summary */}
                            {products.length > 0 && (
                                <div className="bg-[#202020] border border-[#3F3F3F] rounded-lg p-4 mt-4">
                                    <div className="flex justify-between text-white mb-2">
                                        <span>Sub-Total:</span>
                                        <span>INR {total}</span>
                                    </div>
                                    <div className="flex justify-between text-white font-semibold">
                                        <span>Incl + GST 18%:</span>
                                        <span>INR {grandTotal}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="min-w-full text-white rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-[#ffffff] text-[#000000] text-[12px] sm:text-[14px] font-normal">
                                        <th className="px-2 sm:px-4 py-2 text-left">Product name</th>
                                        <th className="px-2 sm:px-4 py-2 text-left">Price</th>
                                        <th className="px-2 sm:px-4 py-2 text-left">Quantity <span className="inline-block">&#8595;</span></th>
                                        <th className="px-2 sm:px-4 py-2 text-left">Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p, idx) => (
                                        <tr key={idx} className="border border-[#3F3F3F]">
                                            <td className="px-2 sm:px-4 py-2 text-[12px] sm:text-[14px] font-normal">{p.name}</td>
                                            <td className="px-2 sm:px-4 py-2 text-[12px] sm:text-[14px] font-normal">INR {p.price}</td>
                                            <td className="px-2 sm:px-4 py-2 text-[12px] sm:text-[14px] font-normal">{p.qty}</td>
                                            <td className="px-2 sm:px-4 py-2 text-[12px] sm:text-[14px] font-normal">INR {Number(p.price) * Number(p.qty)}</td>
                                        </tr>  
                                    ))}
                                    {products.length > 0 && (
                                        <>
                                            <tr className="border border-[#3f3f3f]">
                                                <td colSpan={3} className="px-2 sm:px-4 py-2 text-right text-[#ffffff] text-[12px] sm:text-[14px]">Sub-Total</td>
                                                <td className="px-2 sm:px-4 py-2 text-[12px] sm:text-[14px] font-normal">INR {total}</td>
                                            </tr>
                                            <tr className="border border-[#3f3f3f]">
                                                <td colSpan={3} className="px-2 sm:px-4 py-2 text-right text-[#ffffff] text-[12px] sm:text-[14px]">Incl + GST 18%</td>
                                                <td className="px-2 sm:px-4 py-2 text-[12px] sm:text-[14px] font-normal font-semibold">INR {grandTotal}</td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Generate PDF Button */}
                        {products.length > 0 && (
                            <div className="flex justify-center mt-6 sm:mt-8 lg:mt-10">
                                <button 
                                    className="bg-[#303030] text-[#CCF575] font-semibold px-8 sm:px-12 lg:px-20 py-2.5 rounded-[7px] hover:bg-[#76c840] hover:text-[#303030] transition-colors duration-200 text-sm sm:text-base"
                                    onClick={handleGeneratePDF}
                                >
                                    Generate PDF Invoice
                                </button>  
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}