import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

const OtpVerification = () => {
    const { verifyOtp, resendOtp, loading, user } = useAuth(); // Assuming 'user' might be available or not, check context
    const navigate = useNavigate();
    const location = useLocation();

    // State for 6 digits
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(300); // 5 minutes
    const [canResend, setCanResend] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const inputRefs = useRef([]);
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/sign-in');
            return;
        }

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [email, navigate]);

    // Auto verify when all 6 digits are filled
    useEffect(() => {
        const code = otp.join('');
        if (code.length === 6 && !isVerifying) {
            handleVerify(code);
        }
    }, [otp]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous input on Backspace if current is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            const digits = pastedData.split('');
            const newOtp = [...otp];
            digits.forEach((digit, idx) => {
                if (idx < 6) newOtp[idx] = digit;
            });
            setOtp(newOtp);
            // Focus last filled or first empty
            const nextFocus = Math.min(digits.length, 5);
            inputRefs.current[nextFocus].focus();
        }
    };

    const handleVerify = async (code) => {
        setIsVerifying(true);
        setError('');
        try {
            await verifyOtp(email, code);
            // Success animation or slight delay could go here if needed
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed. Please try again.');
            setIsVerifying(false);
            // Clear inputs on failure? Optional. keeping them for now so user can see what they typed.
        }
    };

    const handleResend = async () => {
        setError('');
        setOtp(['', '', '', '', '', '']);
        try {
            await resendOtp(email);
            setTimer(300);
            setCanResend(false);
            inputRefs.current[0].focus();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend OTP');
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-xl relative z-10 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                        <Mail size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Check your inbox</h1>
                    <p className="text-gray-500">
                        We sent a verification code to <br />
                        <span className="font-semibold text-gray-800">{email}</span>
                    </p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center justify-center animate-shake">
                        {error}
                    </div>
                )}

                <div className="space-y-8">
                    <div className="flex justify-center gap-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                disabled={isVerifying}
                                className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200
                                    ${digit ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-gray-50 text-gray-400'}
                                    focus:border-indigo-600 focus:ring-indigo-100
                                `}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => handleVerify(otp.join(''))}
                        disabled={otp.some(d => !d) || isVerifying}
                        className={`w-full py-4 rounded-xl text-white font-semibold flex items-center justify-center transition-all duration-300
                            ${(otp.some(d => !d) || isVerifying) ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-0.5'}
                        `}
                    >
                        {isVerifying ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={20} />
                                Verifying...
                            </>
                        ) : (
                            <>
                                Verify Email <ArrowRight className="ml-2" size={20} />
                            </>
                        )}
                    </button>

                    <div className="text-center text-sm">
                        {canResend ? (
                            <div className="flex items-center justify-center space-x-2 text-gray-500">
                                <span>Didn't receive the email?</span>
                                <button
                                    onClick={handleResend}
                                    className="flex items-center text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                                >
                                    <RefreshCw size={14} className="mr-1" /> Click to resend
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-400 font-medium">
                                Resend code in <span className="text-indigo-600">{formatTime(timer)}</span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <button
                        onClick={() => navigate('/sign-in')}
                        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ← Back to Login
                    </button>
                </div>
            </div>

            {/* Custom Keyframes for decorations (optional if not global) */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default OtpVerification;
