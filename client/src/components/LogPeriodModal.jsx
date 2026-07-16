import React, { useState } from 'react';
import { X, Calendar, Droplets, AlignLeft } from 'lucide-react';
import API from '../api/axios';

const LogPeriodModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0], // Defaults to today
    endDate: '',
    intensity: 'medium',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/cycles', formData);
      onSuccess(); // Refresh dashboard data
      onClose();   // Close modal
    } catch (err) {
      console.error("Error logging cycle:", err);
      alert("Failed to save period data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-lavender-main p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Droplets size={24} /> Log Period
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 text-lavender-main" size={18} />
                <input 
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 bg-lavender-light rounded-2xl border-none focus:ring-2 focus:ring-lavender-main outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">End Date (Optional)</label>
              <input 
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-4 py-3 bg-lavender-light rounded-2xl border-none focus:ring-2 focus:ring-lavender-main outline-none"
              />
            </div>
          </div>

          {/* Intensity Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3 ml-1">Flow Intensity</label>
            <div className="flex bg-lavender-light p-1 rounded-2xl">
              {['light', 'medium', 'heavy'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({...formData, intensity: level})}
                  className={`flex-1 py-2 capitalize rounded-xl transition-all font-medium ${
                    formData.intensity === level 
                    ? 'bg-white text-lavender-main shadow-sm' 
                    : 'text-gray-500 hover:text-lavender-main'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1 text-center lg:text-left">Notes</label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-3.5 text-lavender-main" size={18} />
              <textarea 
                placeholder="Any specific observations?"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full pl-11 pr-4 py-3 bg-lavender-light rounded-2xl border-none focus:ring-2 focus:ring-lavender-main outline-none resize-none h-24"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-lavender-main text-white font-black py-4 rounded-2xl shadow-lg shadow-lavender-soft hover:bg-lavender-dark transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Period Log'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogPeriodModal;