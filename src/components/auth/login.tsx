import { useState } from 'preact/hooks';
import { loginUser } from './api'
import { setAuthenticated } from './use-auth-state.ts'

type LoginProps = {
  onSwitchToRegister?: () => void;
  onAuthSuccess?: () => void;
};

export const Login = ({ onSwitchToRegister, onAuthSuccess }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: Event) => {
    event.preventDefault()
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const result = await loginUser(username, password);

      if (result.success) {
        setSuccess(true);
        setUsername('');
        setPassword('');
        if (onAuthSuccess) {
          onAuthSuccess();
        }
        if (result.accessToken && result.user) {
        setAuthenticated(result.accessToken, result.user);
        }
      } else {
        setError(result.error || 'Ошибка входа');
      }
    } catch {
      setError('Сетевая ошибка');
    } finally {
      setLoading(false);
    }
    console.log('Logging in with:', { username, password });
  }

  return (
    <div class="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} class="bg-white p-6 rounded shadow-md w-80">
        <h2 class="mb-4 text-xl font-semibold">Вход</h2>
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
            type={showPassword ? "text" : "password"}
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
          {success && <div class="text-green-600 mt-2 text-sm">Авторизация успешна!</div>}
          {loading && <div class="text-gray-600 mt-2 text-sm">Авторизация...</div>}
        </div>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded w-full" disabled={loading}>
          Войти
        </button>
        <button
          type="button"
          class="mt-2 text-sm text-blue-500 hover:underline w-full"
          onClick={onSwitchToRegister}
        >
          Создать аккаунт
        </button>
      </form>
    </div>
  );
};