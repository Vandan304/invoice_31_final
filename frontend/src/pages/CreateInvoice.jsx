import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, UserPlus, Calculator } from 'lucide-react';
import { FiHash, FiCalendar, FiPercent } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api'; // Use API service with interceptor
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Select from '../components/Select';

const CreateInvoice = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    // State
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]); // Added products state
    const [isLoading, setIsLoading] = useState(false);

    const [invoice, setInvoice] = useState({
        invoiceNumber: '',
        customer: null, // Selected customer object
        items: [{ id: Date.now(), productId: '', description: '', quantity: 1, unitPrice: 0, total: 0 }],
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

    // Fetch REAL Customers, Products, and Business Settings
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [custRes, prodRes, bizRes] = await Promise.all([
                    api.get('/customers'),
                    api.get('/products'),
                    api.get('/business')
                ]);
                setCustomers(custRes.data);
                setProducts(prodRes.data);
                if (bizRes.data && bizRes.data.defaultTaxRate !== undefined) {
                    setInvoice(prev => ({ ...prev, taxRate: bizRes.data.defaultTaxRate }));
                }
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    const handleItemChange = (index, field, value) => {
        setInvoice(prev => {
            const newItems = prev.items.map((item, i) => {
                if (i !== index) return item;

                const updatedItem = { ...item, [field]: value };

                // Auto calculate item total
                if (field === 'quantity' || field === 'unitPrice') {
                    const qty = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(item.quantity) || 0;
                    const price = field === 'unitPrice' ? parseFloat(value) || 0 : parseFloat(item.unitPrice) || 0;
                    updatedItem.total = qty * price;
                }
                return updatedItem;
            });
            return { ...prev, items: newItems };
        });
    };

    const handleProductSelect = (index, productId) => {
        const product = products.find(p => p._id === productId);
        if (!product) return;

        setInvoice(prev => {
            const newItems = prev.items.map((item, i) => {
                if (i !== index) return item;

                return {
                    ...item,
                    productId: product._id,
                    description: product.name,
                    unitPrice: product.price,
                    quantity: 1,
                    total: product.price
                };
            });
            return { ...prev, items: newItems };
        });
    };

    const addItem = () => {
        setInvoice(prev => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    id: Date.now() + Math.random(),
                    productId: '',
                    description: '',
                    quantity: 1,
                    unitPrice: 0,
                    total: 0
                }
            ]
        }));
    };

    const removeItem = (index) => {
        setInvoice(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!invoice.customer) return toast.error("Please select a customer");

            // Filter out empty items
            const validItems = invoice.items.filter(item => item.description.trim() !== '');
            if (validItems.length === 0) return toast.error("Please add at least one item with a description");

            const payload = {
                ...invoice,
                items: validItems,
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
            toast.success("Invoice Saved Successfully!");
            navigate('/invoices');
        } catch (error) {
            console.error("Error creating invoice", error);
            toast.error("Failed to save invoice");
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
                        <Select
                            onChange={(e) => {
                                const cust = customers.find(c => c._id === e.target.value);
                                setInvoice({ ...invoice, customer: cust });
                            }}
                        >
                            <option value="">Select Customer</option>
                            {customers.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </Select>
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
                        <Input
                            icon={FiHash}
                            type="text"
                            className="bg-gray-50"
                            placeholder="Auto-generated"
                            value={invoice.invoiceNumber}
                            onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <Input
                                icon={FiCalendar}
                                type="date"
                                value={invoice.issueDate ? new Date(invoice.issueDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => setInvoice({ ...invoice, issueDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <Input
                                icon={FiCalendar}
                                type="date"
                                value={invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="card">
                <h3 className="text-lg font-bold mb-4">Items</h3>
                <div className="overflow-x-auto">
                    <div className="mb-4 min-w-[700px]">
                        <div className="grid grid-cols-[1fr_150px_120px_100px_40px] gap-4 px-4 py-2 text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <div>Product / Description</div>
                            <div className="text-center">Qty</div>
                            <div className="text-right">Price</div>
                            <div className="text-right">Total</div>
                            <div></div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {invoice.items.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-[1fr_150px_120px_100px_40px] gap-4 px-4 py-3 items-start">
                                    <div className="space-y-2">
                                        <Select
                                            className="text-sm py-1"
                                            onChange={(e) => handleProductSelect(index, e.target.value)}
                                            value={item.productId || ''}
                                        >
                                            <option value="">Select Product (Auto-fill)</option>
                                            {products.map(p => (
                                                <option key={p._id} value={p._id}>{p.name} - ₹{p.price}</option>
                                            ))}
                                        </Select>
                                        <Input
                                            type="text"
                                            placeholder="Item name or description"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newQty = Math.max(1, (parseFloat(item.quantity) || 1) - 1);
                                                handleItemChange(index, 'quantity', newQty);
                                            }}
                                            className="w-8 h-9 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold transition-colors flex items-center justify-center shrink-0"
                                            title="Decrease Quantity"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="w-16 h-9 px-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 font-medium"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                            min="1"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newQty = (parseFloat(item.quantity) || 0) + 1;
                                                handleItemChange(index, 'quantity', newQty);
                                            }}
                                            className="w-8 h-9 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold transition-colors flex items-center justify-center shrink-0"
                                            title="Increase Quantity"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div>
                                        <Input
                                            type="number"
                                            className="text-right w-full"
                                            value={item.unitPrice}
                                            onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                        />
                                    </div>
                                    <div className="text-right font-medium text-gray-900 pt-2 break-words">
                                        ₹{item.total.toFixed(2)}
                                    </div>
                                    <div className="flex justify-center pt-2">
                                        <button
                                            onClick={() => removeItem(index)}
                                            className="text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={addItem} className="btn-outline w-full border-dashed border-2">
                    <Plus size={18} /> Add Item
                </button>
            </div>

            {/* Summary */}
            <div className="flex justify-end mt-8">
                <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center text-gray-700">
                        <span className="font-medium">Subtotal</span>
                        <span className="font-bold text-gray-900">₹{subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                        <span className="font-medium">Tax ({invoice.taxRate}%)</span>
                        <span className="font-bold text-gray-900">₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                        <span className="font-medium">Discount (%)</span>
                        <Input
                            type="number"
                            className="w-28 text-right bg-white shadow-sm"
                            icon={FiPercent}
                            value={invoice.discountRate}
                            onChange={(e) => setInvoice({ ...invoice, discountRate: parseFloat(e.target.value) || 0 })}
                            min="0"
                            max="100"
                        />
                    </div>
                    {invoice.discountRate > 0 && (
                        <div className="flex justify-between items-center text-green-600">
                            <span className="font-medium">Discount Amount</span>
                            <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="border-t border-gray-300 pt-4 flex justify-between items-center text-2xl font-black text-indigo-600 shadow-sm">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateInvoice;
