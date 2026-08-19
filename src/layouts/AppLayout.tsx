import { useState, type ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  DoorOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Tags,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../utils/cn';
import { initials } from '../utils/format';
import { Button } from '../components/ui/Button';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const adminNav: NavItem[] = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/entries', label: 'Entrances', icon: DoorOpen },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/prices', label: 'Prices', icon: Tags },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

const receptionNav: NavItem[] = [
  { to: '/reception/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/reception/new-entry', label: 'New Entrance', icon: PlusCircle },
  { to: '/reception/my-entries', label: 'My Entries', icon: DoorOpen },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const nav = user?.role === 'ADMIN' ? adminNav : receptionNav;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-lg font-bold text-white">
          ♨
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">Hammam Manager</p>
          <p className="truncate text-xs text-teal-300/80">Moroccan Management System</p>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3" aria-label="Main navigation">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-teal-800/80 text-white'
                  : 'text-teal-100/80 hover:bg-teal-800/40 hover:text-white'
              )
            }
          >
            <item.icon className="h-5 w-5" aria-hidden />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-teal-800/60 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
            {user ? initials(user.name) : '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
            <p className="truncate text-xs text-teal-300/80">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-teal-100 hover:bg-teal-800/40 hover:text-white"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children?: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-slate-900 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-slate-900">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-4 rounded p-1 text-teal-100 hover:bg-teal-800/40"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">Moroccan Hammam</span>
            <span className="hidden sm:inline"> — Daily Operations</span>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}