import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Calendar as CalendarIcon, Droplets, Activity, Heart, Plus, ChevronRight, Trash2 } from 'lucide-react';
import { format, isWithinInterval, parseISO, startOfDay } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import LogPeriodModal from '../components/LogPeriodModal';
import SymptomModal from '../components/SymptomModal';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
import { BookOpen } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [insights, setInsights] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [insightsRes, cyclesRes] = await Promise.all([
        API.get('/stats/insights'),
        API.get('/cycles')
      ]);
      setInsights(insightsRes.data.data);
      setCycles(cyclesRes.data.data.cycles);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCycle = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await API.delete(`/cycles/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const getTileClassName = ({ date, view }) => {
    if (view !== 'month') return;

    const day = startOfDay(date);

    const isPeriodDay = cycles.some(cycle => {
      const start = startOfDay(parseISO(cycle.startDate));
      const end = cycle.endDate ? startOfDay(parseISO(cycle.endDate)) : start;
      return isWithinInterval(day, { start, end });
    });

    if (isPeriodDay) return 'bg-lavender-main text-white rounded-full';

    if (insights?.predictedNextPeriod) {
      const predicted = startOfDay(parseISO(insights.predictedNextPeriod));
      if (day.getTime() === predicted.getTime()) return 'border-2 border-dashed border-lavender-main text-lavender-main rounded-full';
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-lavender-light flex items-center justify-center">
        <div className="animate-pulse text-lavender-main font-semibold">Loading your cycle...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender-light pb-12">
      {/* Header / Welcome */}
      <header className="bg-white px-6 pt-12 pb-8 rounded-b-[3rem] shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/learn" className="text-gray-400 hover:text-lavender-main transition-colors">
            <BookOpen size={20} />
          </Link>
          <Link to="/settings" className="text-gray-400 hover:text-lavender-main transition-colors">
            <SettingsIcon size={20} />
          </Link>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-rose-400 transition-colors text-sm font-bold flex items-center gap-1"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Prediction & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-lavender-main text-white p-8 rounded-[2rem] shadow-xl shadow-lavender-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon size={20} className="text-lavender-soft" />
                <span className="uppercase tracking-wider text-sm font-semibold text-lavender-soft">Next Period</span>
              </div>
              <h2 className="text-5xl font-black mb-2">
                {insights?.daysUntilNextPeriod ?? '??'} Days
              </h2>
              <p className="text-lavender-light opacity-90">
                Predicted to start: <span className="font-bold">{insights?.predictedNextPeriod ? new Date(insights.predictedNextPeriod).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Soon'}</span>
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-8 bg-white text-lavender-main font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-lavender-light transition-colors w-full"
            >
              <Plus size={20} /> Log Period Start
            </button>
          </section>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-lavender-soft flex items-center gap-4">
              <div className="bg-lavender-light p-4 rounded-2xl text-lavender-main">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Avg. Cycle Length</p>
                <p className="text-2xl font-bold text-gray-800">{insights?.averageCycleLength || 28} Days</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-lavender-soft flex items-center gap-4">
              <div className="bg-rose-50 p-4 rounded-2xl text-rose-400">
                <Heart size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Common Symptom</p>
                <p className="text-2xl font-bold text-gray-800 capitalize">
                  {insights?.topRecentSymptom || 'No data yet'}
                </p>
              </div>
            </div>
          </div>

          {/* Daily Check-in CTA */}
          <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-lavender-soft flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-lavender-soft p-4 rounded-2xl text-lavender-dark">
                <Droplets size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Daily Check-in</h3>
                <p className="text-gray-500 text-sm">Log your mood & symptoms.</p>
              </div>
            </div>
            <button
              onClick={() => setIsSymptomModalOpen(true)}
              className="w-full bg-lavender-soft text-lavender-dark font-bold py-3 px-6 rounded-2xl hover:bg-lavender-main hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Log Today <ChevronRight size={20} />
            </button>
          </section>
        </div>

        {/* Center/Right: Calendar */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-lavender-soft h-fit">
          <h3 className="text-xl font-black text-gray-800 mb-6">Your Cycle View</h3>
          <div className="calendar-container">
            <Calendar
              tileClassName={getTileClassName}
              className="border-none w-full font-nunito"
            />
          </div>

          <div className="mt-6 flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-lavender-main rounded-full"></span> Logged
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-dashed border-lavender-main rounded-full"></span> Predicted
            </div>
          </div>

          {/* Past Cycles List */}
          <div className="mt-8">
            <h4 className="text-md font-bold text-gray-700 mb-4">Past Cycles</h4>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {cycles.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No cycles logged yet.</p>
              ) : (
                cycles.map((cycle) => (
                  <div key={cycle._id} className="group flex items-center justify-between p-4 rounded-2xl bg-lavender-light/50 border border-transparent hover:border-lavender-soft transition-all">
                    <div>
                      <p className="font-bold text-gray-700">
                        {format(new Date(cycle.startDate), 'MMM d')} — {cycle.endDate ? format(new Date(cycle.endDate), 'MMM d') : 'Present'}
                      </p>
                      <span className="text-xs uppercase font-bold text-lavender-main tracking-wider">
                        {cycle.intensity} flow
                      </span>
                    </div>
                    <button
                      onClick={() => deleteCycle(cycle._id)}
                      className="p-2 text-gray-300 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </main>

      <LogPeriodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
      <SymptomModal
        isOpen={isSymptomModalOpen}
        onClose={() => setIsSymptomModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};

export default Dashboard;