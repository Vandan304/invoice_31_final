import React, { useEffect, useState } from 'react';
import { Plus, Search, Trash2, Edit2, Mail, MapPin, Phone } from 'lucide-react';
import api from '../services/api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [editingCustomer, setEditingCustomer] = useState(null);

    // Form State
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/customers');
            setCustomers(res.data);
        } catch (error) {
            console.error("Error fetching customers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone || '',
            address: customer.address || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCustomer) {
                await api.put(`/customers/${editingCustomer._id}`, formData);
            } else {
                await api.post('/customers', formData);
            }
            setShowModal(false);
            setFormData({ name: '', email: '', phone: '', address: '' });
            setEditingCustomer(null);
            fetchCustomers();
        } catch (error) {
            console.error("Error saving customer", error);
            alert(editingCustomer ? "Failed to update customer" : "Failed to create customer");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/customers/${id}`);
            fetchCustomers();
        } catch (error) {
            alert("Failed to delete");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
                    <p className="text-gray-500">Manage your client base</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCustomer(null);
                        setFormData({ name: '', email: '', phone: '', address: '' });
                        setShowModal(true);
                    }}
                    className="btn-primary"
                >
                    <Plus size={20} />
                    Add Customer
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customers.map(c => (
                        <div key={c._id} className="card hover:shadow-md transition-all group relative">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(c)} className="text-gray-400 hover:text-indigo-600"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(c._id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
                                    {c.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{c.name}</h3>
                                    <p className="text-xs text-gray-500">Added {new Date(c.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-gray-400" />
                                    {c.email}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-gray-400" />
                                    {c.phone || 'No phone'}
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin size={16} className="text-gray-400" />
                                    {c.address || 'No address'}
                                </div>
                            </div>
                        </div>
                    ))}
                    {customers.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-400">
                            No customers found. Add your first one!
                        </div>
                    )}
                </div>
            )}

            {/* Simple Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input type="text" required className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" required className="input-field" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input type="text" className="input-field" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <textarea className="input-field" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                                <button type="submit" className="btn-primary">{editingCustomer ? 'Update Customer' : 'Save Customer'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
