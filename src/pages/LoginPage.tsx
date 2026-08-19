import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { isApiError } from '../types';

export function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        setError('Unable to connect to the server.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700 text-2xl font-bold text-white">
            ♨
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">Hammam Manager</h1>
          <p className="mt-1 text-sm text-slate-500">
            Moroccan Hammam Management System
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@hammam.ma"
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" fullWidth loading={submitting}>
            Sign in
          </Button>
          <p className="text-center text-xs text-slate-400">
            Demo accounts: admin@hammam.ma / fatima@hammam.ma
          </p>
          <Link to="/" className="block text-center text-xs text-teal-700 hover:underline">
            Back to home
          </Link>
        </form>
      </div>
    </div>
  );
}