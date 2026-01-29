import { User } from './api';

export function clearAuth(): void {
  localStorage.removeItem('user');
}

export function setUser(user: User): void {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated(): boolean {
  return !!getUser();
}
