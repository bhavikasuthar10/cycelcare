import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Info, AlertTriangle } from 'lucide-react';

const libraryContent = [
  {
    title: "What's a \"Normal\" Cycle?",
    text: "A menstrual cycle is counted from the first day of one period to the first day of the next. A typical cycle can range from about 21 to 35 days, and periods usually last 2 to 7 days. It's common for cycle length to vary a little from month to month. Flow can range from light to heavy and may change slightly from cycle to cycle."
  },
  {
    title: "Why Periods Can Be Late or Early",
    text: "Several everyday factors can shift the timing of a period, including stress, changes in sleep or diet, significant weight changes, travel, intense exercise, or minor illness. Hormonal birth control can also change cycle patterns. A cycle being a few days early or late is usually not a cause for concern, especially if it happens occasionally."
  },
  {
    title: "Common Symptoms, Explained",
    text: "Many people experience physical or emotional changes around their period, including cramps, bloating, fatigue, headaches, or mood changes. These are linked to natural hormonal shifts during the cycle and vary a lot from person to person in intensity."
  },
  {
    title: "When to See a Doctor",
    text: "While variation is normal, it's worth checking in with a doctor or gynecologist if you experience: periods that stop for several months (without pregnancy), unusually heavy bleeding (soaking through a pad/tampon every hour for several hours), severe pain that disrupts daily life, cycles consistently shorter than 21 days or longer than 35 days, or any bleeding between periods."
  }
];

const HealthLibrary = () => {
  return (
    <div className="min-h-screen bg-lavender-light p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-lavender-dark font-bold mb-8 hover:translate-x-[-4px] transition-transform">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-black text-gray-800 flex items-center gap-3">
            <BookOpen className="text-lavender-main" size={36} /> Health Library
          </h1>
          <p className="text-gray-500 mt-2">Empowering you with knowledge about your body.</p>
        </header>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mb-8 flex gap-3">
          <AlertTriangle className="text-amber-500 shrink-0" size={20} />
          <p className="text-amber-800 text-xs leading-relaxed">
            <strong>Medical Disclaimer:</strong> This information is general and educational, not a substitute for professional medical advice. Please consult a doctor for concerns specific to you.
          </p>
        </div>

        <div className="space-y-6">
          {libraryContent.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-lavender-soft transition-hover hover:shadow-md">
              <h2 className="text-xl font-bold text-lavender-dark mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-lavender-main rounded-full" />
                {item.title}
              </h2>
              <p className="text-gray-600 leading-relaxed italic">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <footer className="mt-12 text-center text-gray-400 text-sm pb-8">
          <p>© 2024 CycleCare Health Education Module</p>
        </footer>
      </div>
    </div>
  );
};

export default HealthLibrary;