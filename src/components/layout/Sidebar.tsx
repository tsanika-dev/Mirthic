import { NavLink } from 'react-router-dom';
import { Home, Activity, Leaf, FileText, Users, Heart, BarChart3, User, X, Sparkles, Headphones } from 'lucide-react';

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/mood', label: 'Mood Tracker', icon: Activity },
  { to: '/play-listen', label: 'Play & Listen', icon: Headphones },
  { to: '/self-care', label: 'Self Care', icon: Leaf },
  { to: '/articles', label: 'Articles', icon: FileText },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const bottomItems = [
  { to: '/profile', label: 'Profile', icon: User },
];

export function Sidebar({ mobile = false, onClose }: SidebarProps) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-sage/15 to-sage/5 text-white border-l-2 border-sage shadow-[inset_0_1px_0_rgba(155,191,169,0.15)]'
        : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04] border-l-2 border-transparent'
    }`;

  return (
    <aside className={`liquid-glass-nav rounded-2xl ${
      mobile ? 'w-64 h-full' : 'hidden lg:block fixed left-4 top-4 bottom-4 w-56 z-20'
    } flex flex-col py-4`}>
      {/* Logo */}
      <div className="px-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sage/30 to-lavender/20 flex items-center justify-center shadow-lg shadow-sage/10">
            <Sparkles className="w-4 h-4 text-sage" />
          </div>
          <span className="font-serif text-lg text-white">Mirthic</span>
        </div>
        {mobile && (
          <button onClick={onClose} className="text-white/40 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={mobile ? onClose : undefined} end={item.to === '/dashboard'}>
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pt-3 mt-auto space-y-0.5 border-t border-white/5">
        {bottomItems.map(item => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={mobile ? onClose : undefined}>
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export function MobileNavbar() {
  const items = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/mood', label: 'Tracker', icon: Activity },
    { to: '/play-listen', label: 'Play & Listen', icon: Headphones },
    { to: '/community', label: 'Support', icon: Heart },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 lg:hidden liquid-glass-nav border-t border-white/5 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive ? 'text-sage drop-shadow-[0_0_8px_rgba(155,191,169,0.3)]' : 'text-white/30 hover:text-white/50'
              }`
            }
            end={item.to === '/dashboard'}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
