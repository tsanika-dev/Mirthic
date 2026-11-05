import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ExternalLink, Shield, Heart, BookOpen, AlertTriangle, ChevronRight, Search, Globe } from 'lucide-react';
import { PageVideoBackground } from '../components/ui/PageVideoBackground';
import { Link } from 'react-router-dom';
import { getHelplinesForCountry, getUserCountry, SUPPORT_TIPS } from '../services/userPreferencesService';

const RESOURCES_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260419_065931_e3ca7b53-d32e-4ad5-81de-dc9d6fcfda6d.mp4';

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<'helplines' | 'professionals' | 'tips'>('helplines');
  const [searchQuery, setSearchQuery] = useState('');
  const userCountry = getUserCountry();
  const helplines = getHelplinesForCountry(userCountry);

  const filteredHelplines = helplines.filter(h =>
    !searchQuery || h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageVideoBackground videoUrl={RESOURCES_VIDEO} overlay={0.25} />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Emergency Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="liquid-glass rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-medium mb-1">If you are in immediate danger</p>
                <p className="text-white/50 text-sm">
                  Contact your local emergency service or a qualified professional immediately.
                  Mirthic provides general wellness support and is <strong className="text-white/70">not a substitute for professional mental-health care</strong>.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="font-serif text-3xl md:text-5xl text-white tracking-tight">Support & Resources</h1>
          </div>
          <p className="text-white/50 text-base flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Resources for your region ({userCountry})
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div className="flex gap-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          {(['helplines', 'professionals', 'tips'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`liquid-glass-pill px-5 py-2 text-sm capitalize transition-all ${activeTab === tab ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'helplines' && (
            <motion.div key="helplines" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" placeholder="Search helplines..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full liquid-glass rounded-full pl-11 pr-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none" />
              </div>

              {filteredHelplines.map((helpline, i) => (
                <motion.div key={helpline.name} className={`liquid-glass rounded-2xl p-5 ${helpline.type === 'crisis' ? 'border border-amber-500/10' : ''}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-medium text-sm">{helpline.name}</h3>
                        {helpline.type === 'crisis' && <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px]">Crisis</span>}
                      </div>
                      <p className="text-white/40 text-sm mb-2">{helpline.description}</p>
                      <p className="text-white/30 text-xs">Available: {helpline.available}</p>
                    </div>
                    <a href={`tel:${helpline.number.replace(/[^0-9]/g, '')}`} className="liquid-glass-pill px-4 py-2 text-sage text-sm flex items-center gap-1.5 hover:bg-white/5 transition-colors flex-shrink-0 ml-4">
                      <Phone className="w-3.5 h-3.5" />{helpline.number}
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'professionals' && (
            <motion.div key="professionals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="liquid-glass rounded-2xl p-6">
                <h3 className="text-white font-medium mb-3">Finding Professional Support</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  If you're experiencing persistent mental health challenges, reaching out to a licensed professional can make a meaningful difference.
                </p>
                <div className="space-y-3">
                  {userCountry === 'IN' ? (
                    <>
                      {['NIMHANS (Bangalore)', 'AIIMS Mental Health', 'Psychology Today India', 'Vandrevala Foundation Counselling'].map((resource, i) => (
                        <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                          <span className="text-white/60 text-sm">{resource}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-white/30" />
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {['Psychology Today Therapist Finder', 'BetterHelp Online Therapy', 'NAMI Provider Directory', 'Your primary care physician'].map((resource, i) => (
                        <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                          <span className="text-white/60 text-sm">{resource}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-white/30" />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
              <div className="liquid-glass rounded-2xl p-5 border border-sage/10">
                <p className="text-white/40 text-sm italic">Remember: Seeking professional help is a sign of strength, not weakness. 💚</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'tips' && (
            <motion.div key="tips" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SUPPORT_TIPS.map((tip, i) => (
                <motion.div key={tip.title} className="liquid-glass rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -3 }}>
                  <Heart className="w-5 h-5 text-sage mb-3" />
                  <h3 className="text-white text-sm font-medium mb-2">{tip.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{tip.description}</p>
                </motion.div>
              ))}
              <motion.div className="sm:col-span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <Link to="/self-care" className="liquid-glass rounded-2xl p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-white text-sm font-medium">Try a Breathing Exercise</p>
                    <p className="text-white/40 text-xs mt-1">A quick way to calm your nervous system</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
