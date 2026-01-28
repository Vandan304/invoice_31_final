import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Download, Search } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Invoices = () => {
    const { token } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                // Context sets global header, but we can verify or just call directly
                // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const res = await api.get('/invoices');
                setInvoices(res.data);
            } catch (error) {
                console.error("Failed to fetch invoices", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const handleDownload = async (id, invoiceNumber) => {
        try {
            const res = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${invoiceNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Failed to download PDF", error);
            alert("Could not download PDF");
        }
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
                    <p className="text-gray-500">Manage and track your invoices</p>
                </div>
                <Link to="/invoices/create" className="btn-primary">
                    <Plus size={20} />
                    New Invoice
                </Link>
            </div>

            <div className="card">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            className="input-field pl-10"
                            placeholder="Search by invoice # or client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading invoices...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3">Invoice #</th>
                                    <th className="px-6 py-3">Client</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Due Date</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredInvoices.map((inv) => (
                                    <tr key={inv._id} className="hover:bg-gray-50 group transition-colors">
                                        <td className="px-6 py-4 font-medium text-indigo-600">{inv.invoiceNumber}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{inv.customer.name}</div>
                                            <div className="text-xs text-gray-500">{inv.customer.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(inv.issueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            ${inv.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`
                                                px-2 py-1 rounded-full text-xs font-medium uppercase
                                                ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : ''}
                                                ${inv.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                                                ${inv.status === 'overdue' ? 'bg-red-100 text-red-700' : ''}
                                                ${inv.status === 'draft' ? 'bg-gray-100 text-gray-700' : ''}
                                            `}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="View Details">
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(inv._id, inv.invoiceNumber)}
                                                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                                    title="Download PDF"
                                                >
                                                    <Download size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredInvoices.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-10 text-gray-400">
                                            No invoices found. Create one to get started!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Invoices;
