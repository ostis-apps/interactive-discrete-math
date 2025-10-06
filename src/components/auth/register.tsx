import { useState } from 'preact/hooks';
import { registerUser } from './api';

type RegisterProps = {
  onSwitchToLogin?: () => void;
};

export const Register = ({ onSwitchToLogin }: RegisterProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const result = await registerUser(username, password);

      if (result.success) {
        setSuccess(true);
        setUsername('');
        setPassword('');
        // Если есть токен, можно сохранить его здесь
        if (result.accessToken) {
          localStorage.setItem('accessToken', result.accessToken);
        }
      } else {
        setError(result.error || 'Ошибка регистрации');
      }
    } catch {
      setError('Сетевая ошибка');
    } finally {
      setLoading(false);
    }

    console.log('Register in with:', { username, password });
  };

  return (
    <div class="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} class="bg-white p-6 rounded shadow-md w-80">
        <h2 class="mb-4 text-xl font-semibold">Регистрация</h2>
        <input
          type="text"
          value={username}
          onInput={e => setUsername((e.target as HTMLInputElement).value)}
          class="mb-2 p-2 border w-full"
          placeholder="Логин"
          required
        />
        <div class="mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onInput={e => setPassword((e.target as HTMLInputElement).value)}
            class="p-2 border w-full"
            placeholder="Пароль"
            required
          />
          <label class="flex items-center mt-2 text-sm select-none">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={e => setShowPassword((e.target as HTMLInputElement).checked)}
              class="mr-2"
            />
            Показать пароль
          </label>
          {error && <div class="text-red-600 mt-2 text-sm">{error}</div>}
          {success && <div class="text-green-600 mt-2 text-sm">Регистрация успешна!</div>}
          {loading && <div class="text-gray-600 mt-2 text-sm">Регистрация...</div>}
        </div>
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded w-full" disabled={loading}>
          Зарегистрироваться
        </button>
        <button
          type="button"
          class="mt-2 text-sm text-blue-500 hover:underline w-full"
          onClick={onSwitchToLogin}
        >
          Уже есть аккаунт
        </button>
      </form>
    </div>
  );
};
