export function validatePassword(password: string): string | null {
  const minLength = 8;
  const groups = [
    /[a-z]/,
    /[A-Z]/,
    /\d/,
    /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/
  ];

  if (password.length < minLength) {
    return 'Пароль должен содержать не менее 8 символов';
  }
  const matchedGroups = groups.reduce((acc, rx) => acc + Number(rx.test(password)), 0);
  if (matchedGroups < 3) {
    return 'Пароль должен содержать символы как минимум из трёх групп: строчные/заглавные латинские буквы, цифры и спецсимволы';
  }
  return null;
}