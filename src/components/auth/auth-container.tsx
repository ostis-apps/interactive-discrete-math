import { useState } from 'preact/hooks';
import { Login } from './login';
import { Register } from './register';

type AuthContainerProps = {
  onAuthSuccess?: () => void
};

export const AuthContainer = ({ onAuthSuccess }: AuthContainerProps) => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      {showRegister ? (
        <Register
          onSwitchToLogin={() => setShowRegister(false)}
        />
      ) : (
        <Login
          onSwitchToRegister={() => setShowRegister(true)}
          onAuthSuccess={onAuthSuccess}
        />
      )}
    </>
  );
};