import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';
import { env } from '@/lib/env';
import type { Database } from '@/types/database.types';

/**
 * Cliente unico do Supabase.
 * Nenhum componente ou rota deve chamar supabase.from(...) direto —
 * sempre via um service em src/services.
 */
const isNative = Platform.OS !== 'web';

export const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      // Nativo: a sessao persiste no AsyncStorage.
      // Web: supabase-js decide — localStorage no browser e memoria durante a renderizacao em Node, onde `window` nao existe.

      storage: isNative ? AsyncStorage : undefined,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// AppState so existe no app. No servidor de renderizacao web nao ha ciclo de vida.
if (isNative) {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
