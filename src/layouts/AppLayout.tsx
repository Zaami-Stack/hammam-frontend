import { useState, type ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  DoorOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  ShieldCheck,
  Tags,
  Users,
  X,
  Droplets,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
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
  { to: '/admin/new-entry', label: 'New Entrance', icon: PlusCircle },
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

function BrandMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-800 text-xl text-white shadow-md shadow-teal-900/30',
        className
      )}
    >
      <Droplets aria-hidden className="h-5 w-5" />
    </div>
  );
}

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
      <div className="flex items-center gap-3 px-5 py-6">
        <BrandMark className="h-11 w-11" />
        <div className="min-w-0">
          <p className="font-display truncate text-[15px] font-bold text-white">Hammam Manager</p>
          <p className="truncate text-[11px] font-medium text-teal-200/70">Moroccan Management System</p>
        </div>
      </div>

      <nav className="mt-1 flex-1 space-y-1 px-3" aria-label="Main navigation">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-teal-600/90 to-teal-700/60 text-white shadow-md shadow-teal-950/30'
                  : 'text-teal-100/70 hover:bg-white/5 hover:text-white'
              )
            }
          >
            <item.icon className="h-[18px] w-[18px]" aria-hidden />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-xs font-bold text-white ring-2 ring-white/10">
            {user ? initials(user.name) : '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white">{user?.name}</p>
            <p className="truncate text-[11px] text-teal-200/60">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-teal-100/70 hover:bg-white/10 hover:text-white"
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
  const { user } = useAuth();

  const pageLabel: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/new-entry': 'New Entrance',
    '/admin/entries': 'Entrances',
    '/admin/users': 'Users',
    '/admin/prices': 'Prices',
    '/admin/reports': 'Reports',
    '/reception/dashboard': 'Dashboard',
    '/reception/new-entry': 'New Entrance',
    '/reception/my-entries': 'My Entries',
  };
  const currentLabel = pageLabel[window.location.pathname] ?? 'Operations';

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-gradient-to-b from-teal-950 via-teal-900 to-teal-950 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="animate-fade-in absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <aside className="animate-fade-up absolute inset-y-0 left-0 w-72 bg-gradient-to-b from-teal-950 via-teal-900 to-teal-950">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-teal-100/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200/70 bg-sand-50/85 px-4 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <span className="hidden h-4 w-px bg-slate-300 sm:block" aria-hidden />
            <span className="font-display truncate text-sm font-bold text-slate-800">
              {currentLabel}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700 sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              {user?.role === 'ADMIN' ? 'Administrator' : 'Reception'}
            </span>
          </div>
        </header>
        <main key={currentLabel} className="animate-fade-in mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}