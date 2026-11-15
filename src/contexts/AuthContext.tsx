import { User } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { authService } from '@/services/authService';
import { profileService } from '@/services/profileService';
import { handleError } from '@/utils/errorHandler';

interface AuthContextData {
        user: User | null;
        isVolunteer: boolean;
        loading: boolean;
}

interface AuthProviderProps {
        children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
        const [user, setUser] = useState<User | null>(null);
        const [isVolunteer, setIsVolunteer] = useState(false);
        const [loading, setLoading] = useState(true);

        const sincronizarUsuario = async (usuario: User | null) => {
                if (usuario) {
                        const volunteerStatus = await profileService.getUserIsVolunteer(usuario.id);
                        setIsVolunteer(volunteerStatus);
                        setUser(usuario); // 👈 Seta o user DEPOIS de ter o isVolunteer pronto
                } else {
                        setIsVolunteer(false);
                        setUser(null);
                }
        };

        useEffect(() => {
                const verificarSessaoInicial = async () => {
                        try {
                                const usuarioLogado = await authService.getSession();

                                if (usuarioLogado) {
                                        const volunteerStatus = await profileService.getUserIsVolunteer(usuarioLogado.id);
                                        setIsVolunteer(volunteerStatus);
                                        setUser(usuarioLogado);
                                } else {
                                        setIsVolunteer(false);
                                        setUser(null);
                                }
                        } catch (error: any) {
                                handleError(error.message, 'Não foi possível carregar os dados da sessão.');
                                await authService.signOut()
                        } finally {
                                setLoading(false);
                        }
                };

                verificarSessaoInicial();

                const subscription = authService.onAuthStateChange(async (usuarioAtualizado) => {
                        try {
                                await sincronizarUsuario(usuarioAtualizado);
                        } catch (error: any) {
                                handleError(error.message, 'Erro ao atualizar permissões do usuário.');
                        } finally {
                                setLoading(false);
                        }
                });

                return () => {
                        subscription.unsubscribe();
                };
        }, []);

        return (
                <AuthContext.Provider value={{ user, isVolunteer, loading }}>
                        {children}
                </AuthContext.Provider>
        );
}

export function useAuth() {
        return useContext(AuthContext);
}