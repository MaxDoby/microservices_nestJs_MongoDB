import { useState } from 'react';
import { authenticateRequest } from '../services/auth.api';
import type { AuthFormState, AuthMode } from '../types/auth.types';

interface UseAuthFormOptions {
  onAuthenticated?: () => void;
}

export const useAuthForm = ({ onAuthenticated }: UseAuthFormOptions = {}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [form, setForm] = useState<AuthFormState>({
    name: '',
    surname: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const updateField = (field: keyof AuthFormState, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const submitAuth = async () => {
    try {
      const data = await authenticateRequest(mode, form);

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('authUser', JSON.stringify(data.user));

      setMessage(`Authenticated as ${data.user.email}`);
      onAuthenticated?.();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Authentication failed.',
      );
    }
  };

  return {
    mode,
    form,
    message,
    setMode,
    updateField,
    submitAuth,
  };
};
