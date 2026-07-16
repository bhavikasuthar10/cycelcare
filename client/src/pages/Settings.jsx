import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { User, Mail, Calendar, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
    const { user, setUser } = useAuth();
   const [formData, setFormData] = useState({
  name: user?.name || '',
  email: user?.email || '',
  averageCycleLength: user?.averageCycleLength || 28,
  useManualCycleLength: user?.useManualCycleLength || false,
   partnerEmail: user?.partnerEmail || '',
  partnerNotificationsEnabled: user?.partnerNotificationsEnabled || false
});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            const res = await API.patch('/auth/updateMe', formData);
            setUser(res.data.data.user); // Update global auth state
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            alert("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-lavender-light p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Navigation */}
                <Link to="/" className="inline-flex items-center gap-2 text-lavender-dark font-bold mb-8 hover:translate-x-[-4px] transition-transform">
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-lavender-soft overflow-hidden">
                    <div className="bg-lavender-main p-8 text-white">
                        <h1 className="text-3xl font-black">Settings</h1>
                        <p className="opacity-80">Manage your profile and cycle preferences</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 text-green-600 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in">
                                <CheckCircle size={20} />
                                <span className="font-bold text-sm">Settings updated successfully!</span>
                            </div>
                        )}

                        {/* Profile Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Personal Info</h3>

                            <div className="relative">
                                <User className="absolute left-4 top-4 text-lavender-main" size={20} />
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-lavender-light rounded-2xl border-none focus:ring-2 focus:ring-lavender-main outline-none"
                                />
                            </div>

                            <div className="relative">
                                <Mail className="absolute left-4 top-4 text-lavender-main" size={20} />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-lavender-light rounded-2xl border-none focus:ring-2 focus:ring-lavender-main outline-none"
                                />
                            </div>
                        </div>

                        {/* Cycle Logic Section */}
                        <div className="space-y-4 pt-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Cycle Tracking</h3>
                            <div className="bg-lavender-light p-6 rounded-3xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="text-lavender-main" size={24} />
                                        <div>
                                            <p className="font-bold text-gray-700">Average Cycle Length</p>
                                            <p className="text-xs text-gray-500">Used for period predictions</p>
                                        </div>
                                    </div>
                                    <input
                                        type="number"
                                        min="21"
                                        max="45"
                                        value={formData.averageCycleLength}
                                        onChange={(e) => setFormData({ ...formData, averageCycleLength: e.target.value })}
                                        className="w-20 p-2 text-center font-bold text-lavender-dark bg-white rounded-xl border-none focus:ring-2 focus:ring-lavender-main outline-none"
                                    />
                                </div>
                                <p className="text-[11px] text-gray-400 leading-relaxed italic">
                                    Note: CycleCare will automatically refine this number as you log more periods, but you can manually override it here.
                                </p>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white">
                                    <div>
                                        <p className="font-bold text-gray-700 text-sm">Use manual value only</p>
                                        <p className="text-[11px] text-gray-400">Override smart predictions with the number above</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, useManualCycleLength: !formData.useManualCycleLength })}
                                        className={`w-14 h-8 rounded-full transition-colors relative ${formData.useManualCycleLength ? 'bg-lavender-main' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${formData.useManualCycleLength ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Partner Support Mode Section */}
<div className="space-y-4 pt-4">
  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Partner Support Mode</h3>
  <div className="bg-lavender-light p-6 rounded-3xl">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="font-bold text-gray-700 text-sm">Enable partner notifications</p>
        <p className="text-[11px] text-gray-400 mt-1">
          Your partner will only receive a gentle reminder — never your dates, symptoms, or personal health data.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setFormData({...formData, partnerNotificationsEnabled: !formData.partnerNotificationsEnabled})}
        className={`w-14 h-8 rounded-full transition-colors relative flex-shrink-0 ml-4 ${formData.partnerNotificationsEnabled ? 'bg-lavender-main' : 'bg-gray-300'}`}
      >
        <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${formData.partnerNotificationsEnabled ? 'left-7' : 'left-1'}`}></div>
      </button>
    </div>

    {formData.partnerNotificationsEnabled && (
      <input 
        type="email"
        placeholder="Partner's email address"
        value={formData.partnerEmail}
        onChange={(e) => setFormData({...formData, partnerEmail: e.target.value})}
        className="w-full px-4 py-3 bg-white rounded-2xl border-none focus:ring-2 focus:ring-lavender-main outline-none mt-2"
      />
    )}
  </div>
</div>

                        {/* Submit */}
                        <button
                            disabled={loading}
                            className="w-full bg-lavender-main text-white font-black py-4 rounded-2xl shadow-lg shadow-lavender-soft hover:bg-lavender-dark transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={20} />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="mt-8 p-6 bg-rose-50 rounded-3xl border border-rose-100 flex items-center justify-between">
                    <div>
                        <p className="text-rose-600 font-bold text-sm">Privacy & Data</p>
                        <p className="text-rose-400 text-xs">Permanently delete your account and all health data.</p>
                    </div>
                    <button className="px-4 py-2 bg-white text-rose-500 text-xs font-bold rounded-xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;