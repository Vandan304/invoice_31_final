import React, { useState, useEffect } from 'react';
import { Save, Building, Mail, Phone, MapPin, FileText, Globe } from 'lucide-react';
import api from '../services/api';

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
            alert("Business Profile Saved Successfully!");
        } catch (error) {
            console.error("Error saving profile", error);
            alert("Failed to save profile");
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
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="businessName"
                                    required
                                    className="input-field "
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GST / Tax ID</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="gstNumber"
                                    className="input-field pl-10"
                                    value={formData.gstNumber}
                                    onChange={handleChange}
                                    placeholder="e.g. 29AAAAA0000A1Z5"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="input-field pl-10"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="billing@company.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="phone"
                                    className="input-field pl-10"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="website"
                                    className="input-field pl-10"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="www.example.com"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                <textarea
                                    name="address"
                                    rows="3"
                                    className="input-field pl-10 pt-2"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Registered office address..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Invoice Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                            <select
                                name="currency"
                                className="input-field"
                                value={formData.currency}
                                onChange={handleChange}
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Default Tax Rate (%)</label>
                            <input
                                type="number"
                                name="defaultTaxRate"
                                className="input-field"
                                value={formData.defaultTaxRate}
                                onChange={handleChange}
                                placeholder="18"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={loading} className="btn-primary px-8">
                        <Save size={20} />
                        {loading ? 'Saving Changes...' : 'Save Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BusinessProfile;
