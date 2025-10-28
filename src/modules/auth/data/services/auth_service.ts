'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthClient } from '../client/auth_client';
import { LoginRequest, User } from '../../main/types/auth.types';
import { useRouter } from 'next/navigation';

export const authKeys = {
  auth: ['auth'] as const,
  me: ['auth', 'me'] as const,
  session: ['auth', 'session'] as const,
} as const;

export const AuthService = {
  /**
   * Hook para manejar el inicio de sesión
   */
  useLogin() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
      mutationFn: (credentials: LoginRequest) => AuthClient.login(credentials),
      onSuccess: (data) => {
        // Guardamos la sesión en el cache
        //queryClient.setQueryData(authKeys.session, data);
        // Invalidamos la query de me para forzar una nueva petición
        queryClient.invalidateQueries({ queryKey: authKeys.me });
        // Redirigimos al dashboard
        //router.push('/dashboard');
      },
    });
  },

  /**
   * Hook para obtener los datos del usuario autenticado
   */
  useMe(enabled: boolean = true) {
    return useQuery({
      queryKey: authKeys.me,
      queryFn: () => AuthClient.me(),
      retry: 1,
      enabled, // Permite controlar si la query se ejecuta automáticamente
    });
  },

  /**
   * Hook para manejar el refresh token
   */
  useRefreshToken() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: () => AuthClient.refreshToken(),
      onSuccess: () => {
        // Invalidamos las queries relacionadas con auth para actualizarlas
        queryClient.invalidateQueries({ queryKey: authKeys.auth });
      },
    });
  },

  /**
   * Hook para manejar el cierre de sesión
   */
  useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
      mutationFn: () => AuthClient.logout(),
      onSuccess: () => {
        // Limpiamos todas las queries del cache
        queryClient.removeQueries();
        // Redirigimos al login
        router.push('/login');
      },
    });
  },
};

// Ejemplo de uso en componentes:
/*
function LoginForm() {
  const { mutate: login, isPending } = AuthService.useLogin();

  const onSubmit = (data: LoginRequest) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
    </form>
  );
}

function UserProfile() {
  const { data: user, isLoading } = AuthService.useMe();

  if (isLoading) return <div>Cargando...</div>;
  
  return <div>Bienvenido {user?.firstName}</div>;
}
*/
