import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, UserPlus, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Use API service with interceptor
import { useAuth } from '../context/AuthContext';

const CreateInvoice = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    // State
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [invoice, setInvoice] = useState({
        invoiceNumber: '',
        customer: null, // Selected customer object
        items: [{ id: 1, description: '', quantity: 1, unitPrice: 0, total: 0 }],
        taxRate: 0,
        discountRate: 0,
        notes: '',
        status: 'pending'
    });

    // Calculations
    const subTotal = invoice.items.reduce((acc, item) => acc + (item.total || 0), 0);
    const taxAmount = (subTotal * invoice.taxRate) / 100;
    const discountAmount = (subTotal * invoice.discountRate) / 100;
    const total = subTotal + taxAmount - discountAmount;

    // Fetch REAL Customers
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await api.get('/customers');
                setCustomers(res.data);
            } catch (error) {
                console.error("Error fetching customers", error);
            }
        };
        fetchCustomers();
    }, []);

    const handleItemChange = (index, field, value) => {
        const newItems = [...invoice.items];
        newItems[index][field] = value;

        // Auto calculate item total
        if (field === 'quantity' || field === 'unitPrice') {
            const qty = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(newItems[index].quantity) || 0;
            const price = field === 'unitPrice' ? parseFloat(value) || 0 : parseFloat(newItems[index].unitPrice) || 0;
            newItems[index].total = qty * price;
        }
        setInvoice({ ...invoice, items: newItems });
    };

    const addItem = () => {
        setInvoice({
            ...invoice,
            items: [...invoice.items, { id: Date.now(), description: '', quantity: 1, unitPrice: 0, total: 0 }]
        });
    };

    const removeItem = (index) => {
        const newItems = invoice.items.filter((_, i) => i !== index);
        setInvoice({ ...invoice, items: newItems });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!invoice.customer) return alert("Please select a customer");

            const payload = {
                ...invoice,
                subTotal,
                taxAmount,
                discountAmount,
                totalAmount: total,
                customer: {
                    name: invoice.customer?.name,
                    email: invoice.customer?.email,
                    address: invoice.customer?.address,
                    customerId: invoice.customer?._id
                }
            };

            await api.post('/invoices', payload);
            alert("Invoice Saved Successfully!");
            navigate('/invoices');
        } catch (error) {
            console.error("Error creating invoice", error);
            alert("Failed to save invoice");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">New Invoice</h1>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="btn-primary"
                >
                    <Save size={20} />
                    {isLoading ? 'Saving...' : 'Save Invoice'}
                </button>
            </div>

            <div className="card grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bill To</label>
                    <div className="flex gap-2">
                        <select
                            className="input-field"
                            onChange={(e) => {
                                const cust = customers.find(c => c._id === e.target.value);
                                setInvoice({ ...invoice, customer: cust });
                            }}
                        >
                            <option value="">Select Customer</option>
                            {customers.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                        <button className="btn-outline px-3" onClick={() => navigate('/customers')}>
                            <UserPlus size={20} />
                        </button>
                    </div>
                    {invoice.customer && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 animate-fade-in">
                            <p className="font-bold text-gray-900">{invoice.customer.name}</p>
                            <p>{invoice.customer.email}</p>
                            <p>{invoice.customer.address}</p>
                        </div>
                    )}
                </div>

                {/* Invoice Details */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                        <input
                            type="text"
                            className="input-field bg-gray-50"
                            placeholder="Auto-generated"
                            value={invoice.invoiceNumber}
                            onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input type="date" className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input type="date" className="input-field" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="card">
                <h3 className="text-lg font-bold mb-4">Items</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left mb-4">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-2 w-1/2">Description</th>
                                <th className="px-4 py-2 w-24">Qty</th>
                                <th className="px-4 py-2 w-32">Price</th>
                                <th className="px-4 py-2 w-32">Total</th>
                                <th className="px-4 py-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {invoice.items.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Item name or description"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            className="input-field text-center"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            className="input-field text-right"
                                            value={item.unitPrice}
                                            onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2 text-right font-medium text-gray-900">
                                        ${item.total.toFixed(2)}
                                    </td>
                                    <td className="p-2 text-center">
                                        <button
                                            onClick={() => removeItem(index)}
                                            className="text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={addItem} className="btn-outline w-full border-dashed border-2">
                    <Plus size={18} /> Add Item
                </button>
            </div>

            {/* Summary */}
            <div className="flex justify-end">
                <div className="w-full md:w-1/3 space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Tax (%)</span>
                        <input
                            type="number"
                            className="w-20 input-field py-1 text-right"
                            value={invoice.taxRate}
                            onChange={(e) => setInvoice({ ...invoice, taxRate: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Discount (%)</span>
                        <input
                            type="number"
                            className="w-20 input-field py-1 text-right"
                            value={invoice.discountRate}
                            onChange={(e) => setInvoice({ ...invoice, discountRate: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center text-xl font-bold text-indigo-600">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateInvoice;
