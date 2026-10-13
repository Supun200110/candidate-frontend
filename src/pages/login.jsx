import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleLogin() {
       if (!email || !password) {
        toast.error("කරුණාකර විස්තර ඇතුළත් කරන්න", {
           
            style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
        return;
    }

    setLoading(true);

    axios.post(import.meta.env.VITE_BACKEND_URL + "/api/admin/login", {
        email: email,
        password: password
    })
    .then((response) => {
        setLoading(false);
        
        
        toast.success("පිවිසීම සාර්ථකයි! සාදරයෙන් පිළිගනිමු.", {
            duration: 3000,
            
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admin", JSON.stringify(response.data.admin));

        navigate("/admin");
    })
    .catch((error) => {
        setLoading(false);
        const errorMsg = error.response?.data?.message || "ඊමේල් ලිපිනය හෝ මුරපදය වැරදියි!";
        
        
        toast.error(errorMsg, {
            style: { border: '1px solid #ff4b4b', padding: '16px', color: '#ff4b4b' }
        });
    });
    }

    return (
        <div className="w-full h-screen flex flex-col md:flex-row bg-[#f8f9fa] overflow-hidden relative">
            
            
            <div className="hidden md:flex md:w-[50%] h-full bg-[#592c68] justify-center items-center flex-col p-8 text-white">
                <div className="w-full max-w-[300px] mb-6">
                    <img src="\logo1.png" alt="Election Commission" className="w-full h-auto object-contain drop-shadow-2xl" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-center">
                    Election Management System
                </h1>
                <p className="mt-4 text-purple-200 justify-center items-center ">Official Admin Portal</p>
            </div>

           
            <div className="w-full md:w-[50%] h-full flex items-center justify-center p-4">
                <div className="w-full max-w-[450px] bg-white shadow-2xl rounded-2xl flex flex-col justify-center items-center py-10 px-8 border border-gray-100">

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h2>
                    <p className="text-gray-500 mb-8 font-medium">Please enter your credentials</p>

                 
                    <div className="w-full mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[50px] bg-gray-50 border border-gray-300 focus:border-[#592c68] rounded-xl px-4 text-gray-800 outline-none focus:ring-4 focus:ring-purple-500/10 transition-all"
                            type="email"
                            placeholder="admin@election.gov.lk"
                        />
                    </div>

                  
                    <div className="w-full mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-[50px] bg-gray-50 border border-gray-300 focus:border-[#592c68] rounded-xl px-4 text-gray-800 outline-none focus:ring-4 focus:ring-purple-500/10 transition-all"
                            type="password"
                            placeholder="••••••••"
                        />
                    </div>

                    
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className={`w-full h-[50px] ${loading ? 'bg-gray-400' : 'bg-[#592c68] hover:bg-[#462153]'} text-white font-bold text-lg rounded-xl shadow-lg transform active:scale-[0.98] transition-all duration-200 mb-6`}
                    >
                        {loading ? "Verifying..." : "Login to Portal"}
                    </button>

                    <div className="w-full flex flex-col items-center gap-3 text-sm">
                        <p className="text-gray-500 italic">
                            Authorized Personnel Only
                        </p>
                       
                    </div>
                </div>
            </div>
        </div>
    );
}