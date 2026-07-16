import React, { useState, useEffect } from 'react';
import { X, Smile, Frown, Meh, AlertCircle, Zap } from 'lucide-react';
import API from '../api/axios';

const MOODS = [
  { id: 'happy', icon: Smile, color: 'text-green-500' },
  { id: 'normal', icon: Meh, color: 'text-blue-500' },
  { id: 'sad', icon: Frown, color: 'text-indigo-500' },
  { id: 'anxious', icon: AlertCircle, color: 'text-amber-500' }
];

const COMMON_SYMPTOMS = ['cramps', 'bloating', 'acne', 'headache', 'backache', 'fatigue', 'nausea'];

const SymptomModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: 'neutral',
    symptoms: [],
    energyLevel: 3,
    notes: ''
  });

  const toggleSymptom = (s) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s) 
        ? prev.symptoms.filter(item => item !== s) 
        : [...prev.symptoms, s]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/symptoms', formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving symptoms:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-lavender-soft p-6 flex justify-between items-center">
          <h3 className="text-xl font-bold text-lavender-dark">How are you today?</h3>
          <button onClick={onClose} className="text-lavender-dark/60 hover:text-lavender-dark"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Mood Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-4 text-center">Current Mood</label>
            <div className="flex justify-around">
              {MOODS.map(({ id, icon: Icon, color }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFormData({...formData, mood: id})}
                  className={`p-4 rounded-2xl transition-all ${formData.mood === id ? 'bg-lavender-light scale-110 shadow-inner' : 'opacity-40 hover:opacity-100'}`}
                >
                  <Icon size={32} className={color} />
                  <p className="text-[10px] mt-1 font-bold uppercase text-gray-500">{id}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Slider */}
          <div>
            <label className="flex justify-between text-xs font-bold text-gray-400 uppercase mb-2">
              Energy Level <span>{formData.energyLevel}/5</span>
            </label>
            <input 
              type="range" min="1" max="5" 
              value={formData.energyLevel}
              onChange={(e) => setFormData({...formData, energyLevel: parseInt(e.target.value)})}
              className="w-full accent-lavender-main"
            />
          </div>

          {/* Symptoms Multiselect */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSymptom(s)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    formData.symptoms.includes(s)
                    ? 'bg-lavender-main border-lavender-main text-white'
                    : 'border-lavender-soft text-gray-500 hover:border-lavender-main'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-lavender-main text-white font-black py-4 rounded-2xl shadow-lg hover:bg-lavender-dark transition-all">
            Finish Check-in
          </button>
        </form>
      </div>
    </div>
  );
};

export default SymptomModal;