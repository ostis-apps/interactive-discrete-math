import { useState } from 'preact/hooks';

type UserMenuProps = {
  username?: string | null;
  onLogout: () => void;
};

export const UserMenu = ({ username, onLogout }: UserMenuProps) => {
  const [open, setOpen] = useState(false);
  const safeUsername = username ? String(username) : '';
  const firstLetter = safeUsername.length > 0 ? safeUsername[0].toUpperCase() : '?';

  return (
    <div class="absolute top-4 right-6 z-50">
      <button
        class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-lg ring-2 ring-blue-400"
        onClick={() => setOpen(o => !o)}
        title={safeUsername}
      >
        {firstLetter}
      </button>
      {open && (
        <div class="mt-2 w-48 right-0 bg-white border rounded shadow-lg absolute">
          <div class="px-4 py-3 border-b text-gray-700">{safeUsername || 'Без имени'}</div>
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            class="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};