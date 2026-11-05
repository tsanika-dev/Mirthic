import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Time for your daily mood check-in 💙', page: '/mood', read: false, time: '2m ago', color: 'bg-sage/20' },
  { id: '2', title: 'Take 5 minutes for yourself 🧘', page: '/exercises', read: false, time: '1h ago', color: 'bg-lavender/20' },
  { id: '3', title: 'Your weekly mood summary is ready 📊', page: '/analytics', read: true, time: '1d ago', color: 'bg-cyan/20' },
  { id: '4', title: 'New article: Understanding Stress 📖', page: '/articles', read: true, time: '2d ago', color: 'bg-peach/20' },
];

export function Topbar() {
  const { setSidebarOpen } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowNotifications(false); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => { document.removeEventListener('mousedown', handleClick); document.removeEventListener('keydown', handleEscape); };
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const handleNotificationClick = (page: string) => { navigate(page); setShowNotifications(false); };

  return (
    <header className="sticky top-0 z-20 liquid-glass-nav px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5" aria-label="Open navigation menu">
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 ml-auto" ref={panelRef}>
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5" aria-label="Notifications" aria-expanded={showNotifications}>
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-sage to-cyan text-[10px] text-white flex items-center justify-center font-medium shadow-lg shadow-sage/30">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 top-full mt-2 w-80 liquid-glass rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                  <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <h3 className="text-white text-sm font-medium">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-sage text-xs hover:text-sage/80 transition-colors">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-white/30 text-sm">No notifications</div>
                    ) : notifications.map(n => (
                      <button key={n.id} onClick={() => handleNotificationClick(n.page)} className={`w-full text-left p-4 hover:bg-white/[0.03] transition-colors flex items-start gap-3 ${!n.read ? 'bg-white/[0.02]' : ''}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-gradient-to-br from-sage to-cyan shadow-sm shadow-sage/30' : 'bg-transparent'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!n.read ? 'text-white' : 'text-white/50'}`}>{n.title}</p>
                          <p className="text-white/20 text-xs mt-0.5">{n.time}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-white/20 mt-1 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage/25 to-lavender/20 flex items-center justify-center text-xs text-white/70 font-medium cursor-pointer hover:shadow-lg hover:shadow-sage/10 transition-all" onClick={() => navigate('/profile')}>
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
          </div>
        </div>
      </div>
    </header>
  );
}