import type { SubmitEvent } from 'react';
import type { AuthFormState, AuthMode } from '../types/auth.types';

interface AuthFormProps {
  mode: AuthMode;
  form: AuthFormState;
  message: string;
  setMode: (mode: AuthMode) => void;
  updateField: (field: keyof AuthFormState, value: string) => void;
  submitAuth: () => Promise<void>;
}

export const AuthForm = ({
  mode,
  form,
  message,
  setMode,
  updateField,
  submitAuth,
}: AuthFormProps) => {
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitAuth();
  };

  return (
    <section data-testid="authMf" className="panel-stack">
      <div className="section-heading">
        <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
        <p>Manage your account access.</p>
      </div>

      <div className="segmented-control">
        <button
          type="button"
          className={mode === 'login' ? 'active' : ''}
          onClick={() => setMode('login')}
        >
          Login
        </button>

        <button
          type="button"
          className={mode === 'register' ? 'active' : ''}
          onClick={() => setMode('register')}
        >
          Register
        </button>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
            />

            <input
              placeholder="Surname"
              value={form.surname}
              onChange={(event) => updateField('surname', event.target.value)}
            />
          </>
        )}

        <input
          placeholder="Email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
        />

        <button type="submit">
          {mode === 'login' ? 'Login' : 'Create account'}
        </button>
      </form>

      {message && <p className="status-message">{message}</p>}
    </section>
  );
};
