import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { FiBox, FiFileText, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import Input from '../components/Input';
import Spinner from '../components/Spinner';
import api from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, formData);
                toast.success('Product updated successfully!');
            } else {
                await api.post('/products', formData);
                toast.success('Product added successfully!');
            }
            setShowModal(false);
            setFormData({ name: '', description: '', price: 0 });
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            toast.error(editingProduct ? 'Failed to update product' : 'Failed to create product');
        }
    };

    const handleEdit = async (product) => {
        setEditingProduct(product);
        setShowModal(true);
        // Pre-fill gracefully before fetch completion
        setFormData({ name: product.name, description: product.description, price: product.price });
        
        try {
            // Fetch fresh product data from the backend
            const res = await api.get(`/products/${product._id}`);
            const freshData = res.data;
            setFormData({ 
                name: freshData.name, 
                description: freshData.description, 
                price: freshData.price 
            });
        } catch (error) {
            toast.error("Failed to fetch latest product details");
        }
    };

    const requestDelete = (id) => setConfirmDeleteId(id);

    const confirmDelete = async () => {
        try {
            await api.delete(`/products/${confirmDeleteId}`);
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
        } finally {
            setConfirmDeleteId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Products & Services</h1>
                    <p className="text-gray-500">Manage your catalog</p>
                </div>
                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setFormData({ name: '', description: '', price: 0 });
                        setShowModal(true);
                    }}
                    className="btn-primary"
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {loading ? <Spinner /> : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
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
                                            <div className="bg-indigo-100 p-2 border border-indigo-200 rounded-lg text-indigo-600 shrinks-0">
                                                <Package size={20} />
                                            </div>
                                            {p.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{p.description}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">₹{p.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEdit(p)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Edit2 size={18} /></button>
                                                <button onClick={() => requestDelete(p._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {products.length === 0 && <div className="p-10 text-center text-gray-400">No products found.</div>}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                        <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <Input icon={FiBox} type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <Input icon={FiFileText} type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Price</label>
                                <Input icon={FiDollarSign} type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                                <button type="submit" className="btn-primary">{editingProduct ? 'Update Product' : 'Save Product'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={!!confirmDeleteId}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setConfirmDeleteId(null)}
                confirmText="Delete"
            />
        </div>
    );
};

export default Products;
