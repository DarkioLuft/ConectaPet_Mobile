import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Menu temporario de desenvolvimento.
 * Serve para navegar pelas rotas enquanto as telas nao existem.
 * Remover quando o fluxo de autenticacao da Sprint 1 entrar.
 */
const ROTAS = [
  { grupo: '(auth)', itens: [
    { href: '/login', label: 'Login' },
    { href: '/cadastro', label: 'Criar conta' },
    { href: '/recuperar-senha', label: 'Recuperar senha' },
  ]},
  { grupo: '(onboarding)', itens: [
    { href: '/preferencias', label: 'Preferencias do adotante' },
  ]},
  { grupo: '(app)', itens: [
    { href: '/vitrine', label: 'Vitrine de adocao' },
    { href: '/mapa', label: 'Mapa de ONGs' },
    { href: '/avisos', label: 'Feed de avisos' },
    { href: '/perfil', label: 'Meu perfil' },
    { href: '/favoritos', label: 'Favoritos' },
    { href: '/animal/1', label: 'Detalhe do animal (id=1)' },
    { href: '/ong/1', label: 'Perfil da ONG (id=1)' },
    { href: '/doacao/1', label: 'Doacao Pix (ONG id=1)' },
  ]},
  { grupo: '(ong)', itens: [
    { href: '/dashboard', label: 'Painel da ONG' },
    { href: '/animais', label: 'Animais da ONG' },
    { href: '/animais/novo', label: 'Cadastrar animal' },
    { href: '/animais/1/editar', label: 'Editar animal (id=1)' },
  ]},
] as const;

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-primary-light">
      <ScrollView contentContainerClassName="px-5 py-6">
        <Text className="text-3xl font-bold text-primary">ConectaPet</Text>
        <Text className="mt-1 text-muted">
          Menu de desenvolvimento — estrutura de rotas da Fase 6.
        </Text>

        {ROTAS.map((secao) => (
          <View key={secao.grupo} className="mt-6">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              {secao.grupo}
            </Text>
            {secao.itens.map((item) => (
              <Link key={item.href} href={item.href as never} asChild>
                <Pressable className="mb-2 rounded-xl bg-white px-4 py-3 active:bg-primary-light">
                  <Text className="text-base text-primary-dark">{item.label}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
