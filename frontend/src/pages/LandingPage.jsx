import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Zap, Shield, ChevronRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Navbar */}
            <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
                        <span className="text-xl font-bold tracking-tight">Appifly</span>
                    </div>

                    <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
                        <Link to="/about" className="hover:text-indigo-600 transition-colors">About</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/sign-in" className="text-sm font-bold text-gray-700 hover:text-indigo-600">
                            Sign In
                        </Link>
                        <Link to="/register" className="bg-indigo-600 text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 overflow-hidden">
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full font-bold text-xs uppercase tracking-wide mb-8 animate-fade-in-up">
                        <Zap size={14} fill="currentColor" />
                        <span>AI-Powered Invoicing is Here</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 max-w-5xl mx-auto">
                        Professional Invoices <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            in Seconds
                        </span>
                    </h1>

                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Appifly Invoice Management helps freelancers and businesses create stunning invoices, track payments, and get paid faster with smart automation.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link to="/register" className="flex items-center justify-center gap-2 bg-indigo-600 text-white text-lg font-bold px-8 py-4 rounded-full hover:bg-indigo-700 transition-transform hover:-translate-y-1 shadow-xl shadow-indigo-200">
                            Start Creating Free <ChevronRight size={20} />
                        </Link>
                        <a href="#features" className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 text-lg font-bold px-8 py-4 rounded-full hover:bg-gray-50 transition-colors">
                            Explore Features
                        </a>
                    </div>

                    
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-3">Built for Speed & Clarity</h2>
                        <h3 className="text-4xl font-extrabold text-gray-900 mb-6">Everything you need to run your business</h3>
                        <p className="text-gray-500 text-lg">Stop wrestling with spreadsheets. Appifly Invoice Management handles the boring stuff so you can focus on work.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "AI Invoice Parsing", desc: "Upload receipts and let our AI automatically extract details to create invoices instantly.", icon: Zap },
                            { title: "Smart Email Reminders", desc: "Set automatic follow-ups for unpaid invoices. Get paid 2x faster without awkward conversations.", icon: CheckCircle },
                            { title: "Professional PDF Export", desc: "Download high-quality, branded PDFs that look great on any device or printer.", icon: Shield },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                                    <feature.icon size={28} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-gray-500 text-lg">Choose the plan that fits your business scale.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Starter */}
                        <div className="border border-gray-200 rounded-2xl p-8 hover:border-indigo-300 transition-all">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                            <div className="text-4xl font-extrabold text-gray-900 mb-1">₹0<span className="text-lg font-medium text-gray-400">/mo</span></div>
                            <p className="text-gray-500 text-sm mb-6">Perfect for freelancers just starting out.</p>
                            <Link to="/register" className="block w-full py-3 px-6 bg-indigo-50 text-indigo-700 font-bold text-center rounded-xl hover:bg-indigo-100 transition-colors">
                                7 Days Free Trial
                            </Link>
                            <ul className="mt-8 space-y-4 text-gray-600 text-sm">
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-indigo-600" /> 5 Invoices</li>
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-indigo-600" /> Basic Templates</li>
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-indigo-600" /> PDF Export</li>
                            </ul>
                        </div>

                        {/* Professional */}
                        <div className="relative border-2 border-indigo-600 rounded-2xl p-8 shadow-2xl transform scale-105 bg-white z-10">
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">MOST POPULAR</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
                            <div className="text-4xl font-extrabold text-gray-900 mb-1">₹399<span className="text-lg font-medium text-gray-400">/mo</span></div>
                            <p className="text-gray-500 text-sm mb-6">For growing businesses and agencies.</p>
                            <Link to="/register" className="block w-full py-3 px-6 bg-indigo-600 text-white font-bold text-center rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                Get Started
                            </Link>
                            <ul className="mt-8 space-y-4 text-gray-600 text-sm">
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-indigo-600" /> Unlimited Invoices</li>
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-indigo-600" /> Custom Branding</li>
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-indigo-600" /> Email Reminders</li>
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-indigo-600" /> Tax Calculation</li>
                            </ul>
                        </div>

                        {/* Enterprise */}
                        <div className="border border-gray-200 rounded-2xl p-8 hover:border-indigo-300 transition-all">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                            <div className="text-4xl font-extrabold text-gray-900 mb-1">₹1,199<span className="text-lg font-medium text-gray-400">/mo</span></div>
                            <p className="text-gray-500 text-sm mb-6">Advanced power for large teams.</p>
                            <Link to="/register" className="block w-full py-3 px-6 bg-gray-900 text-white font-bold text-center rounded-xl hover:bg-gray-800 transition-colors">
                                Contact Sales
                            </Link>
                            <ul className="mt-8 space-y-4 text-gray-600 text-sm">
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-indigo-600" /> Everything in Pro</li>
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-indigo-600" /> API Access</li>
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-indigo-600" /> Priority Support</li>
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-indigo-600" /> Audit Logs</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-6 md:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center text-white font-bold text-xs">A</div>
                                <span className="text-lg font-bold">Appifly</span>
                            </div>
                            <p className="text-gray-400 text-sm">Next-gen invoicing for next-gen businesses.</p>
                        </div>
                        <div className="flex gap-8 text-sm text-gray-400">
                            <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
                            <Link to="#" className="hover:text-white transition-colors">Terms</Link>
                            <Link to="#" className="hover:text-white transition-colors">Twitter</Link>
                            <Link to="#" className="hover:text-white transition-colors">LinkedIn</Link>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-600">
                        © 2026 Appifly Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
