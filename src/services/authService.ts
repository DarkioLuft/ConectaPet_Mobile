import { RegisterProfileDto } from '@/dtos/profile.dto';
import { profileService } from './profileService';
import { supabase, supabaseNotPersistent } from './supabase';

export const authService = {
        // Faz login no Supabase e retorna a sessão e o perfil do usuário
        async login(email: string, password: string) {
                const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                });

                if (error) throw error;
                if (!data || !data.user) throw new Error('Erro ao autenticar o usuário.');

                const profileId = data.user.id;

                const profile = await profileService.findById(profileId);

                if (!profile) {
                        // Destrói a sessão
                        await supabase.auth.signOut();
                        throw new Error("Dados do usuário não encontrados.");
                }

                return {
                        session: data.session,
                        profile: profile
                };
        },

        // Cria o usuário no auth, e ativa trigger para salvar na tabela profiles
        async register(payload: RegisterProfileDto) {
                const { error } = await supabaseNotPersistent.auth.signUp({
                        email: payload.email,
                        password: payload.password,
                        options: {
                                data: {
                                        full_name: payload.fullName,
                                        email: payload.email,
                                        cpf: payload.cpf,
                                        phone: payload.phone,
                                        avatar_url: payload.avatarUrl ?? null,
                                        birth_date: payload.birthDate ?? null,
                                }
                        }
                });

                console.log(error)
                if (error) throw error;
        },

        // Busca a sessão atual
        async getSession() {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                        throw error;
                }
                if (!session) {
                        throw Error('Sessão não encontrada!')
                }

                return session.user;
        },

        // Busca mudanças no estado da sessão, e executa callback
        onAuthStateChange(callback: (user: any) => void) {
                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                        callback(session?.user ?? null);
                });

                // Retorna a inscrição
                return subscription;
        },

        // Faz o LogOut
        async signOut() {
                const { error } = await supabase.auth.signOut();

                if (error) {
                        return error;
                }
        }
};