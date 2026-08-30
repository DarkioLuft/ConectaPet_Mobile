import { z } from 'zod';

/**
 * Variaveis de ambiente do app.
 *
 * Só o prefixo EXPO_PUBLIC_ chega ao bundle — e tudo que chega ao bundle e publico.
 * A anon key do Supabase pode ficar aqui (e protegida por RLS).
 * A service_role key NUNCA — ela ignora todo o RLS e so existe em Edge Functions.
 */
const schema = z.object({
  SUPABASE_URL: z
    .string()
    .url()
    // A URL da API nao tem caminho: https://<ref>.supabase.co
    // Erro classico: colar a URL do dashboard
    // (https://supabase.com/dashboard/project/<ref>), que passa como URL valida
    // e so falha em runtime com "Failed to fetch".
    .refine((v) => {
      try {
        return new URL(v).pathname === '/';
      } catch {
        return false;
      }
    }, 'use a Project URL (https://<ref>.supabase.co), nao a URL do dashboard'),
  SUPABASE_ANON_KEY: z.string().min(20),
  GOOGLE_MAPS_API_KEY: z.string().optional(),
});

const parsed = schema.safeParse({
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
});

/** false enquanto o .env.local nao estiver preenchido. */
export const isEnvConfigured = parsed.success;

/** Mensagem legivel para exibir na tela durante o desenvolvimento. */
export const envError = parsed.success
  ? null
  : parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' | ');

/**
 * Valores validados. Se o .env.local estiver vazio, caem para string vazia
 * em vez de derrubar o app no import — cheque isEnvConfigured antes de usar.
 */
export const env = parsed.success
  ? parsed.data
  : { SUPABASE_URL: '', SUPABASE_ANON_KEY: '', GOOGLE_MAPS_API_KEY: undefined };
