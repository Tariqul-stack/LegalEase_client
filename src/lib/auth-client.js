import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  fetchOptions: {
    onSuccess: async (ctx) => {
      if (ctx.response.url?.includes('/callback/google') || 
          ctx.response.url?.includes('/sign-in/social')) {
        try {
          const session = await authClient.getSession();
          const user = session?.data?.user;
          if (user) {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google-login`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: user.name,
                  email: user.email,
                  photo: user.image || '',
                }),
              }
            );
            const data = await response.json();
            if (data.token) {
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
              // Role modal দেখানোর জন্য flag set করো
              localStorage.setItem('show_role_modal', 'true');
              window.location.href = '/';
            }
          }
        } catch (err) {
          console.error('Failed to sync with backend:', err);
        }
      }
    },
  },
});

export const { signIn, signOut, useSession } = authClient;