// hooks/useAuthToken.ts
import { useAppSelector } from '../state/hooks';

export const useAuthToken = (): string | undefined => {
  const token = useAppSelector((state) => state.auth.token);
  return token ? String(token) : undefined;
};
