import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import logo from '../assets/logo1_backup.png';
import { Loader2 } from 'lucide-react';



const Register = () => {
    const { register, loading, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await register(username, email, password);
            navigate('/verify-otp', { state: { email } });
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 p-4">
            <div className="card w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <img src={logo} alt="Appifly Logo" className="h-20 w-auto mx-auto mb-4 object-contain" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Appifly Invoice Manager
                    </h1>
                    <p className="text-gray-500 mt-2">Create your account</p>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <Input
                            icon={FiUser}
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input
                            icon={FiMail}
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <Input
                            icon={FiLock}
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3 flex justify-center items-center">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={20} />
                                Processing...
                            </>
                        ) : (
                            'Register'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-500">
                        Already have an account?{' '}
                        <Link to="/sign-in" className="text-indigo-600 font-bold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
