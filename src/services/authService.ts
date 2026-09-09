import { RegisterUserDto } from '@/dtos/user.dto';
import { supabase } from './supabase';

export const authService = {
        // async login(email: string, password: string) {
        //         const { data, error } = await supabase.auth.signInWithPassword({
        //                 email,
        //                 password,
        //         });

        //         if (error) throw error;
        //         if (!data || !data.user) throw new Error('Erro ao autenticar o usuário.');

        //         const userId = data.user.id;

        //         const userProfile = await userAccountService.findById(userId);

        //         if (userProfile?.deleted_at) {
        //                 // Destrói a sessão
        //                 await supabase.auth.signOut();
        //                 throw new Error("Conta do usuário está inativa.");
        //         }

        //         return {
        //                 session: data.session,
        //                 user: userProfile
        //         };
        // },

        // Cria o usuário no auth, e ativa trigger para salvar na tabela profiles
        async register(payload: RegisterUserDto) {
                const { data, error } = await supabase.auth.signUp({
                        email: payload.email,
                        password: payload.password,
                        options: {
                                data: {
                                        full_name: payload.full_name,
                                        email: payload.email,
                                        cpf: payload.cpf,
                                        phone: payload.phone,
                                        avatar_url: payload.avatar_url ?? null,
                                        birth_date: payload.birth_date ?? null,
                                }
                        }
                });

                console.log(error)
                if (error) throw error;
                if (!data || !data.user) throw Error('Usuário não encontrado.')

                return data;
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

        async signOut() {
                const { error } = await supabase.auth.signOut();

                if (error) {
                        return error;
                }

                return null
        }
};