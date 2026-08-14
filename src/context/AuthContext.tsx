import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UserAccount {
  id: string;
  name: string;
  surname?: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role?: 'CLIENT' | 'ADMIN' | 'BARBER';
  provider: 'google' | 'local' | 'supabase';
  createdAt: string;
}

export interface RegisterPayload {
  name: string;
  surname: string;
  email: string;
  phone: string;
  password?: string;
}

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginWithGoogle: (googleUser?: Partial<UserAccount>) => Promise<UserAccount>;
  loginWithCredentials: (emailOrPhone: string, password?: string) => Promise<UserAccount>;
  loginAdmin: (email: string, password: string) => Promise<UserAccount>;
  registerUser: (payload: RegisterPayload) => Promise<UserAccount>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'hypecut_active_user';

declare global {
  interface Window {
    google?: any;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);

  const fetchUserProfile = async (userId: string): Promise<string> => {
    if (!isSupabaseConfigured) return 'CLIENT';
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      return data?.role || 'CLIENT';
    } catch {
      return 'CLIENT';
    }
  };

  useEffect(() => {
    // 1. Check Supabase Auth session if configured
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          const u = session.user;
          const metadata = u.user_metadata || {};
          const role = await fetchUserProfile(u.id);

          const account: UserAccount = {
            id: u.id,
            name: metadata.name || metadata.full_name || u.email?.split('@')[0] || 'Cliente',
            surname: metadata.surname || '',
            email: u.email || '',
            phone: metadata.phone || '',
            avatarUrl: metadata.avatar_url,
            role: (role as any) || 'CLIENT',
            provider: u.app_metadata?.provider === 'google' ? 'google' : 'supabase',
            createdAt: u.created_at,
          };
          saveActiveUser(account);
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const u = session.user;
          const metadata = u.user_metadata || {};
          const role = await fetchUserProfile(u.id);

          const account: UserAccount = {
            id: u.id,
            name: metadata.name || metadata.full_name || u.email?.split('@')[0] || 'Cliente',
            surname: metadata.surname || '',
            email: u.email || '',
            phone: metadata.phone || '',
            avatarUrl: metadata.avatar_url,
            role: (role as any) || 'CLIENT',
            provider: u.app_metadata?.provider === 'google' ? 'google' : 'supabase',
            createdAt: u.created_at,
          };
          saveActiveUser(account);
        } else {
          setUser(null);
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Local fallback restore
      try {
        const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Erro ao carregar usuário salvo:', e);
      }
    }

    // Dynamically load Google Identity Services SDK
    const googleScript = document.createElement('script');
    googleScript.src = 'https://accounts.google.com/gsi/client';
    googleScript.async = true;
    googleScript.defer = true;
    document.head.appendChild(googleScript);

    return () => {
      if (googleScript.parentNode) googleScript.parentNode.removeChild(googleScript);
    };
  }, []);

  const saveActiveUser = (userAcc: UserAccount) => {
    setUser(userAcc);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userAcc));
  };

  const loginWithGoogle = async (googleUserOverride?: Partial<UserAccount>): Promise<UserAccount> => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // Supabase OAuth if available
    if (isSupabaseConfigured && !googleUserOverride) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    }

    // Google Identity Services SDK direct flow
    if (googleClientId && window.google?.accounts?.oauth2 && !googleUserOverride) {
      return new Promise<UserAccount>((resolve, reject) => {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile',
          callback: async (response: any) => {
            if (response.error) {
              return reject(new Error(response.error));
            }
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` },
              });
              const profile = await res.json();

              const account: UserAccount = {
                id: 'usr-g-' + profile.sub,
                name: profile.given_name || profile.name || 'Cliente Google',
                surname: profile.family_name || '',
                email: profile.email || 'cliente.google@gmail.com',
                phone: '47999998888',
                avatarUrl: profile.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                role: 'CLIENT',
                provider: 'google',
                createdAt: new Date().toISOString(),
              };

              saveActiveUser(account);
              resolve(account);
            } catch (err) {
              reject(err);
            }
          },
        });
        client.requestAccessToken();
      });
    }

    // Default / Mock / Override fallback
    const name = googleUserOverride?.name || 'Cliente Google';
    const email = googleUserOverride?.email || 'cliente.google@gmail.com';
    const avatarUrl = googleUserOverride?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
    const phone = googleUserOverride?.phone || '47999998888';

    const account: UserAccount = {
      id: googleUserOverride?.id || 'usr-g-' + Math.random().toString(36).substring(2, 9),
      name,
      surname: googleUserOverride?.surname || '',
      email,
      phone,
      avatarUrl,
      role: 'CLIENT',
      provider: 'google',
      createdAt: new Date().toISOString(),
    };

    saveActiveUser(account);
    return account;
  };

  const loginWithCredentials = async (emailOrPhone: string, password?: string): Promise<UserAccount> => {
    const cleanSearch = emailOrPhone.trim().toLowerCase();

    // Supabase Auth Login
    if (isSupabaseConfigured && cleanSearch.includes('@') && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanSearch,
        password,
      });

      if (error) {
        throw new Error(error.message || 'Credenciais inválidas.');
      }

      if (data.user) {
        const metadata = data.user.user_metadata || {};
        const role = await fetchUserProfile(data.user.id);
        const account: UserAccount = {
          id: data.user.id,
          name: metadata.name || cleanSearch.split('@')[0],
          surname: metadata.surname || '',
          email: data.user.email || cleanSearch,
          phone: metadata.phone || '',
          role: (role as any) || 'CLIENT',
          provider: 'supabase',
          createdAt: data.user.created_at,
        };
        saveActiveUser(account);
        return account;
      }
    }

    // Local / Dev Fallback: Secure Session without saving plaintext password
    const isEmail = cleanSearch.includes('@');
    const account: UserAccount = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      name: isEmail ? cleanSearch.split('@')[0] : 'Cliente',
      surname: '',
      email: isEmail ? cleanSearch : `${cleanSearch.replace(/\D/g, '')}@hypecut.com`,
      phone: isEmail ? '47999998888' : cleanSearch,
      role: 'CLIENT',
      provider: 'local',
      createdAt: new Date().toISOString(),
    };

    saveActiveUser(account);
    return account;
  };

  const loginAdmin = async (email: string, password: string): Promise<UserAccount> => {
    const cleanEmail = email.trim().toLowerCase();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        throw new Error(error.message || 'E-mail ou senha incorretos.');
      }

      if (data.user) {
        const role = await fetchUserProfile(data.user.id);
        if (role !== 'ADMIN') {
          await supabase.auth.signOut();
          throw new Error('Acesso negado: sua conta não possui privilégios de administrador.');
        }

        const metadata = data.user.user_metadata || {};
        const account: UserAccount = {
          id: data.user.id,
          name: metadata.name || 'Administrador',
          surname: metadata.surname || '',
          email: data.user.email || cleanEmail,
          phone: metadata.phone || '',
          role: 'ADMIN',
          provider: 'supabase',
          createdAt: data.user.created_at,
        };
        saveActiveUser(account);
        return account;
      }
    }

    throw new Error('Supabase não configurado para autenticação administrativa segura.');
  };

  const registerUser = async (payload: RegisterPayload): Promise<UserAccount> => {
    const cleanEmail = payload.email.trim().toLowerCase();

    // Supabase Auth Registration with Bcrypt server-side hashing
    if (isSupabaseConfigured && payload.password) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: payload.password,
        options: {
          data: {
            name: payload.name.trim(),
            surname: payload.surname.trim(),
            phone: payload.phone.trim(),
            role: 'CLIENT',
          },
        },
      });

      if (error) {
        throw new Error(error.message || 'Erro ao cadastrar usuário.');
      }

      if (data.user) {
        const account: UserAccount = {
          id: data.user.id,
          name: payload.name.trim(),
          surname: payload.surname.trim(),
          email: cleanEmail,
          phone: payload.phone.trim(),
          role: 'CLIENT',
          provider: 'supabase',
          createdAt: data.user.created_at,
        };
        saveActiveUser(account);
        return account;
      }
    }

    // Local / Dev Fallback
    const account: UserAccount = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      name: payload.name.trim(),
      surname: payload.surname.trim(),
      email: cleanEmail,
      phone: payload.phone.trim(),
      role: 'CLIENT',
      provider: 'local',
      createdAt: new Date().toISOString(),
    };

    saveActiveUser(account);
    return account;
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Logout error:', e);
      }
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        loginWithGoogle,
        loginWithCredentials,
        loginAdmin,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
