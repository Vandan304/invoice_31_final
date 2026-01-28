import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Users,
    Package,
    Settings,
    LogOut,
    PlusCircle,
    Building2,
    CreditCard // Added
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuth(); // Use Auth Context

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Invoices', path: '/invoices', icon: FileText },
        { label: 'Create Invoice', path: '/invoices/create', icon: PlusCircle }, // Added direct link
        { label: 'Customers', path: '/customers', icon: Users },
        { label: 'Products', path: '/products', icon: Package },
        { label: 'Business Profile', path: '/profile', icon: Building2 },
        { label: 'Pricing', path: '/pricing', icon: CreditCard },
        { label: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-20">
            <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">
                        MahantAI
                    </h1>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Invoice Manager</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path; // Exact match for better highlighting
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <Icon size={20} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );
};

const MainLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="ml-64 flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                        <p className="text-gray-500">Manage your invoices and business efficiently</p>
                    </div>
                    <Link to="/invoices/create" className="btn-primary shadow-lg shadow-indigo-500/30">
                        <PlusCircle size={20} />
                        Create Invoice
                    </Link>
                </header>
                <main className="animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
