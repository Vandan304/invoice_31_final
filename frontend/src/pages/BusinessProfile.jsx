import React, { useState, useEffect } from 'react';
import { FiSave, FiBriefcase, FiMail, FiPhone, FiMapPin, FiFileText, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';

const BusinessProfile = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        businessName: '',
        email: '',
        phone: '',
        address: '',
        gstNumber: '',
        website: '',
        defaultTaxRate: 0,
        currency: 'INR'
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/business');
                if (res.data && res.data._id) {
                    setFormData(res.data);
                }
            } catch (error) {
                console.error("Error fetching business profile", error);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, logoUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/business', formData);
            toast.success("Business Profile Saved Successfully!");
        } catch (error) {
            console.error("Error saving profile", error);
            toast.error("Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Business Profile</h1>
                <p className="text-gray-500 mt-1">Manage your company information and billing defaults.</p>
            </div>

            <form onSubmit={handleSubmit} className="card space-y-8">
                {/* Basic Info */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Branding</h3>
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                            {formData.logoUrl ? (
                                <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-gray-400 text-xs text-center px-2">No Logo</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended: PNG or JPG, max 2MB.</p>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                            <Input
                                icon={FiBriefcase}
                                type="text"
                                name="businessName"
                                required
                                value={formData.businessName}
                                onChange={handleChange}
                                placeholder="e.g. Acme Corp"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GST / Tax ID</label>
                            <Input
                                icon={FiFileText}
                                type="text"
                                name="gstNumber"
                                value={formData.gstNumber}
                                onChange={handleChange}
                                placeholder="e.g. 29AAAAA0000A1Z5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <Input
                                icon={FiMail}
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="billing@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <Input
                                icon={FiPhone}
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                            <Input
                                icon={FiGlobe}
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="www.example.com"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <Textarea
                                icon={FiMapPin}
                                name="address"
                                rows="3"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Registered office address..."
                            />
                        </div>
                    </div>
                </div>

                {/* Configuration */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Invoice Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                            <Select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Default Tax Rate (%)</label>
                            <Input
                                type="number"
                                name="defaultTaxRate"
                                value={formData.defaultTaxRate}
                                onChange={handleChange}
                                placeholder="18"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={loading} className="btn-primary px-8">
                        <FiSave size={20} />
                        {loading ? 'Saving Changes...' : 'Save Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BusinessProfile;
