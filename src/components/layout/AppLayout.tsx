import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNavbar } from './Sidebar';
import { AIChat } from '../ai/AIChat';
import { GlobalMusicPlayer } from '../music/GlobalMusicPlayer';
import { useAppContext } from '../../context/AppContext';

export function AppLayout() {
  const { sidebarOpen, setSidebarOpen } = useAppContext();

  return (
    <div className="min-h-screen text-[#F7F8F5] font-sans" style={{ position: 'relative' }}>
      {/* Default dark background for pages without their own video */}
      <div className="fixed inset-0 bg-[#07090D]" style={{ zIndex: 0 }} />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={`fixed inset-y-0 left-0 z-40 lg:hidden transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar mobile onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="relative lg:ml-64" style={{ zIndex: 10 }}>
        <Topbar />
        <main className="min-h-[calc(100vh-64px)] pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNavbar />

      {/* Global Music Player (persists across routes) */}
      <GlobalMusicPlayer />

      {/* AI Chat */}
      <AIChat />
    </div>
  );
}