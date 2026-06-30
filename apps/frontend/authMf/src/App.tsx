import { AuthForm } from './components/AuthForm';
import { useAuthForm } from './hooks/useAuthForm';

interface AppProps {
  onAuthenticated?: () => void;
}

export const App = ({ onAuthenticated }: AppProps) => {
  const authForm = useAuthForm({ onAuthenticated });

  return <AuthForm {...authForm} />;
};

export default App;
