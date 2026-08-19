import { useEffect, useState } from 'react';
import { KeyRound, Pencil, Plus, Search, ShieldCheck, ShieldOff, UserPlus } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync';
import { useForm } from '../../hooks/useForm';
import { usersService, type CreateUserInput, type UpdateUserInput } from '../../services/users.service';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { PaginationBar } from '../../components/ui/Pagination';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { formatDateTime, formatDate } from '../../utils/format';
import { isApiError, Role, User } from '../../types';

interface UserFilters {
  page: number;
  limit: number;
  search: string;
  role: string;
  status: string;
}

const initialFilters: UserFilters = { page: 1, limit: 10, search: '', role: '', status: '' };

export function AdminUsersPage() {
  const toast = useToast();
  const [filters, setFilters] = useState<UserFilters>(initialFilters);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [statusTarget, setStatusTarget] = useState<User | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<User | null>(null);

  const users = useAsync(
    () =>
      usersService.list({
        page: filters.page,
        limit: filters.limit,
        search: filters.search || undefined,
        role: (filters.role || undefined) as Role | undefined,
        status: (filters.status || undefined) as 'active' | 'inactive' | undefined,
      }),
    [filters.page, filters.limit, filters.search, filters.role, filters.status]
  );

  const applyFilter = (patch: Partial<UserFilters>) =>
    setFilters((current) => ({ ...current, ...patch, page: 1 }));

  const refresh = () => {
    users.reload();
  };

  const columns: Column<User>[] = [
    { key: 'name', header: 'Nom', render: (row) => <span className="font-semibold">{row.name}</span> },
    { key: 'email', header: 'E-mail' },
    {
      key: 'role',
      header: 'Rôle',
      render: (row) => (
        <Badge tone={row.role === 'ADMIN' ? 'amber' : 'blue'}>{row.role === 'ADMIN' ? 'Administrateur' : 'Réception'}</Badge>
      ),
    },
    {
      key: 'is_active',
      header: 'Statut',
      render: (row) =>
        row.is_active ? <Badge tone="green">Actif</Badge> : <Badge tone="red">Inactif</Badge>,
    },
    {
      key: 'created_at',
      header: 'Créé le',
      render: (row) => <span className="text-slate-500">{formatDate(row.created_at)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setEditing(row)} aria-label={`Modifier ${row.name}`}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStatusTarget(row)}
            aria-label={row.is_active ? `Désactiver ${row.name}` : `Activer ${row.name}`}
          >
            {row.is_active ? (
              <ShieldOff className="h-4 w-4 text-red-600" />
            ) : (
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPasswordTarget(row)}
            aria-label={`Réinitialiser le mot de passe de ${row.name}`}
          >
            <KeyRound className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Gestion des utilisateurs"
        description="Créez et gérez les comptes du personnel"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> Nouvel utilisateur
          </Button>
        }
      />

      <Card className="mb-4" padding={false}>
        <div className="flex flex-wrap items-end gap-3 p-4">
          <div className="flex w-full flex-1 gap-2">
            <div className="relative w-full sm:min-w-52 sm:flex-1">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={filters.search}
                onChange={(event) => applyFilter({ search: event.target.value })}
                placeholder="Rechercher par nom ou e-mail"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>
          <Select
            label="Rôle"
            value={filters.role}
            onChange={(event) => applyFilter({ role: event.target.value })}
            className="w-full sm:w-36"
          >
            <option value="">Tous</option>
            <option value="ADMIN">Administrateur</option>
            <option value="RECEPTION">Réception</option>
          </Select>
          <Select
            label="Statut"
            value={filters.status}
            onChange={(event) => applyFilter({ status: event.target.value })}
            className="w-full sm:w-36"
          >
            <option value="">Tous</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </Select>
        </div>
      </Card>

      <Card padding={false}>
        {users.loading && <LoadingSpinner label="Chargement des utilisateurs..." />}
        {users.error && <ErrorMessage error={users.error} onRetry={users.reload} />}
        {users.data && (
          <>
            {users.data.data.length === 0 ? (
              <EmptyState title="Aucun utilisateur trouvé" description="Créez un utilisateur pour commencer." />
            ) : (
              <DataTable columns={columns} rows={users.data.data} rowKey={(row) => row.id} />
            )}
            <PaginationBar
              pagination={users.data.pagination}
              onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
            />
          </>
        )}
      </Card>

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          toast.success('Utilisateur créé');
          refresh();
        }}
      />

      <EditUserModal
        user={editing}
        onClose={() => setEditing(null)}
        onUpdated={() => {
          setEditing(null);
          toast.success('Utilisateur mis à jour');
          refresh();
        }}
      />

      <ConfirmDialog
        open={statusTarget !== null}
        title={statusTarget?.is_active ? "Désactiver l'utilisateur" : "Activer l'utilisateur"}
        message={
          statusTarget
            ? `Êtes-vous sûr de vouloir ${statusTarget.is_active ? 'désactiver' : 'activer'} ${statusTarget.name} ?`
            : ''
        }
        confirmLabel={statusTarget?.is_active ? 'Désactiver' : 'Activer'}
        tone={statusTarget?.is_active ? 'danger' : 'primary'}
        onCancel={() => setStatusTarget(null)}
        onConfirm={async () => {
          if (!statusTarget) return;
          try {
            await usersService.setStatus(statusTarget.id, !statusTarget.is_active);
            toast.success(`${statusTarget.name} a été ${statusTarget.is_active ? 'désactivé' : 'activé'}`);
            setStatusTarget(null);
            refresh();
          } catch (err) {
            toast.error(isApiError(err) ? err.message : 'Impossible de modifier le statut');
          }
        }}
      />

      <ResetPasswordModal
        user={passwordTarget}
        onClose={() => setPasswordTarget(null)}
        onReset={() => {
          setPasswordTarget(null);
          toast.success('Mot de passe mis à jour');
        }}
      />
    </div>
  );
}

function CreateUserModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const { values, setValue, reset } = useForm<CreateUserInput & { confirm: string }>({
    name: '',
    email: '',
    password: '',
    confirm: '',
    role: 'RECEPTION',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (values.password !== values.confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await usersService.create({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      reset();
      onCreated();
    } catch (err) {
      setError(isApiError(err) ? err.message : "Impossible de créer l'utilisateur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Créer un utilisateur"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={submit} loading={submitting}>
            <UserPlus className="h-4 w-4" /> Créer l'utilisateur
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Nom complet" value={values.name} onChange={(e) => setValue('name', e.target.value)} required />
        <Input label="E-mail" type="email" value={values.email} onChange={(e) => setValue('email', e.target.value)} required />
        <Select label="Rôle" value={values.role} onChange={(e) => setValue('role', e.target.value as Role)}>
          <option value="RECEPTION">Réception</option>
          <option value="ADMIN">Administrateur</option>
        </Select>
        <Input
          label="Mot de passe"
          type="password"
          value={values.password}
          onChange={(e) => setValue('password', e.target.value)}
          hint="Au moins 8 caractères, avec une majuscule, une minuscule et un chiffre."
          required
        />
        <Input
          label="Confirmer le mot de passe"
          type="password"
          value={values.confirm}
          onChange={(e) => setValue('confirm', e.target.value)}
          required
        />
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      </div>
    </Modal>
  );
}

function EditUserModal({
  user,
  onClose,
  onUpdated,
}: {
  user: User | null;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { values, setValue, reset } = useForm<UpdateUserInput>({ name: '', email: '', role: 'RECEPTION' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email, role: user.role });
    }
  }, [user, reset]);

  const submit = async () => {
    if (!user) return;
    setError(null);
    setSubmitting(true);
    try {
      await usersService.update(user.id, values);
      onUpdated();
    } catch (err) {
      setError(isApiError(err) ? err.message : "Impossible de mettre à jour l'utilisateur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={user !== null}
      title={`Modifier l'utilisateur${user ? ` — ${user.name}` : ''}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={submit} loading={submitting}>
            Enregistrer
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Nom complet" value={values.name} onChange={(e) => setValue('name', e.target.value)} required />
        <Input label="E-mail" type="email" value={values.email} onChange={(e) => setValue('email', e.target.value)} required />
        <Select label="Rôle" value={values.role} onChange={(e) => setValue('role', e.target.value as Role)}>
          <option value="RECEPTION">Réception</option>
          <option value="ADMIN">Administrateur</option>
        </Select>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <p className="text-xs text-slate-500">Créé le {user ? formatDateTime(user.created_at) : ''}</p>
      </div>
    </Modal>
  );
}

function ResetPasswordModal({
  user,
  onClose,
  onReset,
}: {
  user: User | null;
  onClose: () => void;
  onReset: () => void;
}) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!user) return;
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await usersService.resetPassword(user.id, password);
      setPassword('');
      setConfirm('');
      onReset();
    } catch (err) {
      setError(isApiError(err) ? err.message : 'Impossible de réinitialiser le mot de passe');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={user !== null}
      title={`Réinitialiser le mot de passe${user ? ` — ${user.name}` : ''}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={submit} loading={submitting}>
            Réinitialiser
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Nouveau mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="Au moins 8 caractères, avec une majuscule, une minuscule et un chiffre."
          required
        />
        <Input
          label="Confirmer le nouveau mot de passe"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      </div>
    </Modal>
  );
}