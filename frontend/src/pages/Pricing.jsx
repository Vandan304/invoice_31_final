import React, { useEffect, useState } from 'react';
import { CreditCard, Check, Shield, Zap } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Pricing = () => {
    const { user } = useAuth(); // Assuming useAuth gives basic user details
    const [currentPlan, setCurrentPlan] = useState('free');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCurrentUserPlan();
    }, []);

    const fetchCurrentUserPlan = async () => {
        try {
            const res = await api.get('/auth/me');
            if (res.data) {
                setCurrentPlan(res.data.planType);
            }
        } catch (error) {
            console.error("Error fetching plan", error);
        }
    };

    const handleBuy = async (planType) => {
        if (!user) return alert("Please login first");
        setLoading(true);

        try {
            // 1. Create Order
            const { data } = await api.post('/payments/create-order', { planType });
            const { order, key_id } = data;

            // 2. Open Razorpay
            const options = {
                key: key_id,
                amount: order.amount,
                currency: order.currency,
                name: "Invoice Management System",
                description: `${planType.toUpperCase()} Subscription`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        await api.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        alert("Payment Successful! Plan Upgraded.");
                        fetchCurrentUserPlan();
                    } catch (err) {
                        alert("Payment Verification Failed");
                    }
                },
                prefill: {
                    name: user.username,
                    email: user.email,
                    contact: ""
                },
                theme: {
                    color: "#4f46e5"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Payment Error", error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Choose the plan that best fits your business needs. Upgrade anytime to unlock more features.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Free Plan */}
                <div className={`card relative p-8 border-2 ${currentPlan === 'free' ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-transparent'}`}>
                    {currentPlan === 'free' && (
                        <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                            Current Plan
                        </span>
                    )}
                    <h3 className="text-lg font-bold text-gray-500 uppercase tracking-widest">Free</h3>
                    <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-bold tracking-tight text-gray-900">₹0</span>
                        <span className="text-gray-500 ml-1">/limited</span>
                    </div>
                    <p className="mt-2 text-gray-500 text-sm">Best for individual freelancers just starting out.</p>
                    <ul className="mt-6 space-y-4">
                        <li className="flex gap-3 text-sm text-gray-600">
                            <Check className="text-green-500 flex-shrink-0" size={20} />
                            Up to 5 Invoices/month
                        </li>
                        <li className="flex gap-3 text-sm text-gray-600">
                            <Check className="text-green-500 flex-shrink-0" size={20} />
                            Basic PDF Generation
                        </li>
                    </ul>
                    <button className="btn-outline w-full mt-8" disabled>
                        {currentPlan === 'free' ? 'Active' : 'Downgrade not available'}
                    </button>
                </div>

                {/* Monthly Plan */}
                <div className={`card relative p-8 border-2 ${currentPlan === 'monthly' ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-transparent'} transform hover:-translate-y-1 transition-transform`}>
                    {currentPlan === 'monthly' && (
                        <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                            Current Plan
                        </span>
                    )}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-b-xl uppercase tracking-wider shadow-lg">
                        Most Popular
                    </div>
                    <h3 className="text-lg font-bold text-indigo-600 uppercase tracking-widest mt-4">Monthly</h3>
                    <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-bold tracking-tight text-gray-900">₹399</span>
                        <span className="text-gray-500 ml-1">/month</span>
                    </div>
                    <p className="mt-2 text-gray-500 text-sm">Perfect for small businesses and growing teams.</p>
                    <ul className="mt-6 space-y-4">
                        <li className="flex gap-3 text-sm text-gray-600">
                            <Check className="text-indigo-500 flex-shrink-0" size={20} />
                            Unlimited Invoices
                        </li>
                        <li className="flex gap-3 text-sm text-gray-600">
                            <Check className="text-indigo-500 flex-shrink-0" size={20} />
                            Custom Branding
                        </li>
                        <li className="flex gap-3 text-sm text-gray-600">
                            <Check className="text-indigo-500 flex-shrink-0" size={20} />
                            Email Support
                        </li>
                    </ul>
                    <button
                        onClick={() => handleBuy('monthly')}
                        disabled={currentPlan === 'monthly' || loading}
                        className={`w-full mt-8 ${currentPlan === 'monthly' ? 'btn-outline' : 'btn-primary'}`}
                    >
                        {currentPlan === 'monthly' ? 'Active' : 'Choose Monthly'}
                    </button>
                </div>

                {/* Yearly Plan */}
                <div className={`card relative p-8 border-2 ${currentPlan === 'yearly' ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-transparent'}`}>
                    {currentPlan === 'yearly' && (
                        <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                            Current Plan
                        </span>
                    )}
                    <h3 className="text-lg font-bold text-gray-500 uppercase tracking-widest">Yearly</h3>
                    <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-bold tracking-tight text-gray-900">₹3999</span>
                        <span className="text-gray-500 ml-1">/year</span>
                    </div>
                    <p className="mt-2 text-green-600 text-sm font-bold">Save ₹789 per year</p>
                    <ul className="mt-6 space-y-4">
                        <li className="flex gap-3 text-sm text-gray-600">
                            <Check className="text-green-500 flex-shrink-0" size={20} />
                            Everything in Monthly
                        </li>
                        <li className="flex gap-3 text-sm text-gray-600">
                            <Check className="text-green-500 flex-shrink-0" size={20} />
                            Priority 24/7 Support
                        </li>
                        <li className="flex gap-3 text-sm text-gray-600">
                            <Check className="text-green-500 flex-shrink-0" size={20} />
                            Advanced Analytics
                        </li>
                    </ul>
                    <button
                        onClick={() => handleBuy('yearly')}
                        disabled={currentPlan === 'yearly' || loading}
                        className={`w-full mt-8 ${currentPlan === 'yearly' ? 'btn-outline' : 'btn-primary'}`}
                    >
                        {currentPlan === 'yearly' ? 'Active' : 'Choose Yearly'}
                    </button>
                </div>
            </div>

            <div className="flex justify-center gap-8 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                    <Shield size={16} /> Secure Payment
                </div>
                <div className="flex items-center gap-2">
                    <Zap size={16} /> Instant Activation
                </div>
            </div>
        </div>
    );
};

export default Pricing;
