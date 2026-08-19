import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  DoorOpen,
  Droplets,
  Eye,
  EyeOff,
  ReceiptText,
  Sparkles,
  Users,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { isApiError } from '../types';

const features = [
  { icon: DoorOpen, title: 'Suivi moderne des entrées', text: "Sections hommes et femmes, tarifs adultes et enfants en un geste." },
  { icon: ReceiptText, title: 'Des tarifs qui respectent le passé', text: "Une modification de tarif ne s'applique qu'aux nouvelles visites — les entrées passées restent intactes." },
  { icon: BarChart3, title: "Des rapports qui valent de l'or", text: 'Recettes quotidiennes, hebdomadaires et mensuelles de votre hammam.' },
  { icon: Users, title: "Des rôles pour toute l'équipe", text: 'Administrateurs et réceptionnistes, chacun avec son espace de travail.' },
];

export function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && user) {
    return (
      <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/reception/dashboard'} replace />
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const loggedIn = await login(email, password);
      navigate(loggedIn.role === 'ADMIN' ? '/admin/dashboard' : '/reception/dashboard', {
        replace: true,
      });
    } catch (err) {
      if (isApiError(err)) {
        setError(err.message);
      } else {
        setError('Impossible de contacter le serveur.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-[44%] overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:w-1/2">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute right-24 top-24 h-64 w-64 rounded-full border border-teal-400/10" />
          <div className="absolute right-16 top-40 h-48 w-48 rounded-full border border-teal-400/10" />
          <div className="absolute right-40 top-32 h-32 w-32 rounded-full border border-teal-400/10" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-950/40">
            <Droplets aria-hidden className="h-6 w-6" />
          </div>
          <div>
            <p className="font-display text-lg font-extrabold text-white">Hammam Manager</p>
            <p className="text-xs font-medium text-teal-200/70">Système de gestion d'un hammam marocain</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-teal-200">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Au quotidien, tout simplement
          </p>
          <h1 className="font-display mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-[2.75rem]">
            La façon moderne de gérer un <span className="text-teal-300">hammam marocain</span>.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-teal-100/70">
            Entrées, tarifs, équipe et recettes — le tout au même endroit, pensé pour
            le rythme d'une vraie journée de hammam.
          </p>
          <ul className="mt-8 space-y-4">
            {features.map((feature) => (
              <li key={feature.title} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-teal-200 ring-1 ring-inset ring-white/10">
                  <feature.icon className="h-4.5 w-4.5" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{feature.title}</p>
                  <p className="text-[13px] leading-relaxed text-teal-100/60">{feature.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-teal-200/40">
          © {new Date().getFullYear()} Hammam Manager · Morocco
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
        </div>

        <div className="animate-fade-up relative w-full max-w-sm">
          <div className="mb-8 flex flex-col items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-lg shadow-teal-800/25">
              <Droplets aria-hidden className="h-6 w-6" />
            </div>
            <h2 className="font-display mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
              Bon retour
            </h2>
            <p className="mt-1 text-sm text-slate-500">Connectez-vous pour continuer.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Adresse e-mail"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
            <div className="relative">
            <Input
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="pr-10"
              required
            />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-2 top-[34px] rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>

            {error && (
              <p
                role="alert"
                className="animate-fade-in rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <Button type="submit" size="xl" fullWidth loading={submitting}>
              Se connecter
            </Button>
          </form>

          <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">
            Accès réservé au personnel autorisé.
            <br />
            © {new Date().getFullYear()} Hammam Manager
          </p>
        </div>
      </div>
    </div>
  );
}