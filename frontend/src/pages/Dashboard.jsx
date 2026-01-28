import React, { useEffect, useState } from 'react';
import { DollarSign, FileText, Users, TrendingUp, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} shadow-lg shadow-opacity-30`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
        {trend && (
            <div className="mt-4 flex items-center text-sm font-medium text-green-600">
                <TrendingUp size={16} className="mr-1" />
                <span>{trend}</span>
            </div>
        )}
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Error fetching stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Dashboard...</div>;

    const cards = [
        {
            title: 'Total Revenue',
            value: `₹${stats?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}`,
            icon: DollarSign,
            color: 'bg-gradient-to-tr from-green-500 to-emerald-400',
            trend: 'Up to date'
        },
        {
            title: 'Total Invoices',
            value: stats?.totalInvoices || 0,
            icon: FileText,
            color: 'bg-gradient-to-tr from-blue-500 to-cyan-400',
            trend: 'All time'
        },
        {
            title: 'Active Customers',
            value: stats?.totalCustomers || 0,
            icon: Users,
            color: 'bg-gradient-to-tr from-purple-500 to-indigo-400',
            trend: 'Registered Clients'
        },
        {
            title: 'Pending Amount',
            value: `₹${stats?.pendingrevenue?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}`,
            icon: TrendingUp,
            color: 'bg-gradient-to-tr from-orange-500 to-pink-400',
            trend: 'Unpaid Invoices'
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Here is what's happening with your business today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Recent Invoices</h3>
                        <Link to="/invoices" className="text-indigo-600 text-sm font-medium hover:underline flex items-center">
                            View All <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3">Invoice #</th>
                                    <th className="px-4 py-3">Client</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats?.recentInvoices?.map((inv) => (
                                    <tr key={inv._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-indigo-600">{inv.invoiceNumber}</td>
                                        <td className="px-4 py-3 text-gray-800">{inv.customer.name || 'Unknown'}</td>
                                        <td className="px-4 py-3 font-bold text-gray-900">₹{inv.totalAmount.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                                                 ${inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                    inv.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}
                                            `}>
                                                {inv.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!stats?.recentInvoices || stats.recentInvoices.length === 0) && (
                                    <tr><td colSpan="4" className="text-center py-4 text-gray-400">No recent activity</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-indigo-700 to-purple-800 text-white border-none flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
                        <p className="text-indigo-200 mb-6">Manage your business efficiently with these shortcuts.</p>

                        <div className="space-y-3">
                            <Link to="/invoices/create" className="flex items-center justify-center w-full bg-white text-indigo-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-100 transition-all shadow-lg">
                                + Create New Invoice
                            </Link>
                            <Link to="/customers" className="flex items-center justify-center w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-500 transition-all border border-indigo-500">
                                Add Customer
                            </Link>
                            <Link to="/products" className="flex items-center justify-center w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-500 transition-all border border-indigo-500">
                                Add Product
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
