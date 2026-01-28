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

    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const handleView = (invoice) => {
        setSelectedInvoice(invoice);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/invoices/${id}`, { status: newStatus });
            setInvoices(invoices.map(inv => inv._id === id ? { ...inv, status: newStatus } : inv));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

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
                                            ₹{inv.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={inv.status}
                                                onChange={(e) => handleStatusChange(inv._id, e.target.value)}
                                                className={`
                                                    px-2 py-1 rounded-full text-xs font-medium uppercase border-none outline-none cursor-pointer appearance-none text-center bg-opacity-20
                                                    ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : ''}
                                                    ${inv.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                                                    ${inv.status === 'overdue' ? 'bg-red-100 text-red-700' : ''}
                                                    ${inv.status === 'draft' ? 'bg-gray-100 text-gray-700' : ''}
                                                `}
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="pending">Pending</option>
                                                <option value="paid">Paid</option>
                                                <option value="overdue">Overdue</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleView(inv)}
                                                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                                    title="View Details"
                                                >
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

            {/* Invoice Preview Modal */}
            {selectedInvoice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in-up">
                        {/* Header */}
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Invoice: {selectedInvoice.invoiceNumber}</h2>
                                <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded ${selectedInvoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {selectedInvoice.status}
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleDownload(selectedInvoice._id, selectedInvoice.invoiceNumber)}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <Download size={18} /> Download
                                </button>
                                <button
                                    onClick={() => setSelectedInvoice(null)}
                                    className="p-2 hover:bg-gray-200 rounded-full text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 overflow-y-auto space-y-8">
                            {/* Top Info */}
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">From</h3>
                                    <p className="font-bold text-lg">My Business</p>
                                    {/* Ideally fetch business profile here, but for now generic or from invoice if specific fields existed */}
                                </div>
                                <div className="text-right">
                                    <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Bill To</h3>
                                    <p className="font-bold text-lg">{selectedInvoice.customer.name}</p>
                                    <p className="text-gray-600">{selectedInvoice.customer.email}</p>
                                    <p className="text-gray-600 whitespace-pre-line">{selectedInvoice.customer.address}</p>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-8 p-4 bg-gray-50 rounded-lg border">
                                <div>
                                    <p className="text-gray-500 text-sm">Issue Date</p>
                                    <p className="font-medium">{new Date(selectedInvoice.issueDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Due Date</p>
                                    <p className="font-medium">{selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate).toLocaleDateString() : '-'}</p>
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3">Description</th>
                                            <th className="px-4 py-3 text-right">Qty</th>
                                            <th className="px-4 py-3 text-right">Price</th>
                                            <th className="px-4 py-3 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {selectedInvoice.items.map((item, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-3 font-medium">{item.description}</td>
                                                <td className="px-4 py-3 text-right">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right">₹{item.unitPrice.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right font-bold">₹{item.total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="flex justify-end">
                                <div className="w-64 space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{selectedInvoice.subTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span>₹{selectedInvoice.taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Discount</span>
                                        <span>-₹{selectedInvoice.discountAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-indigo-600 border-t pt-2">
                                        <span>Total</span>
                                        <span>₹{selectedInvoice.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invoices;
