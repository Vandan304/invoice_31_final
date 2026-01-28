import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import api from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', price: 0 });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', formData);
            setShowModal(false);
            setFormData({ name: '', description: '', price: 0 });
            fetchProducts();
        } catch (error) {
            alert("Failed to create product");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete product?")) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (error) {
            alert("Failed to delete");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Products & Services</h1>
                    <p className="text-gray-500">Manage your catalog</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary">
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="card overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(p => (
                                <tr key={p._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                                            <Package size={20} />
                                        </div>
                                        {p.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{p.description}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">${p.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button className="text-gray-400 hover:text-indigo-600"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(p._id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && <div className="p-10 text-center text-gray-400">No products found.</div>}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input type="text" required className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <input type="text" className="input-field" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Price</label>
                                <input type="number" required className="input-field" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                                <button type="submit" className="btn-primary">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
