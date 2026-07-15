import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ------------------------------------------------------------------ */
/* Tipos públicos                                                      */
/* ------------------------------------------------------------------ */

export type Papel = "funcionario" | "gestor";

export interface Usuario {
  nome: string;
  email: string;
  cargo: string;
  role: Papel;
}

/** Usuário no banco mock: usuário + senha. */
interface UsuarioMock extends Usuario {
  senha: string;
}

export interface LoginResultado {
  ok: boolean;
  erro?: string;
}

export interface AuthState {
  /* --- estado --- */
  usuario: Usuario | null;
  autenticado: boolean;
  /** Lista mock de usuários que valida o login (persistida). */
  usuarios: UsuarioMock[];
  /** true depois que o estado foi reidratado do localStorage (evita flash/SSR mismatch). */
  hidratado: boolean;

  /* --- ações --- */
  login: (email: string, senha: string) => LoginResultado;
  logout: () => void;
  cadastrarFuncionario: (dados: {
    nome: string;
    email: string;
    cargo: string;
  }) => LoginResultado;
  setHidratado: (v: boolean) => void;
}

/* ------------------------------------------------------------------ */
/* Dados mock                                                          */
/* ------------------------------------------------------------------ */

/** Senha padrão de todos os usuários demo. */
export const SENHA_DEMO = "123.321.00";

const USUARIOS_INICIAIS: UsuarioMock[] = [
  {
    nome: "Mariana Souza",
    email: "mariana@demo.com",
    cargo: "Desenvolvedora",
    role: "funcionario",
    senha: SENHA_DEMO,
  },
  {
    nome: "Rafael Andrade",
    email: "gestor@demo.com",
    cargo: "Gerente de Projetos",
    role: "gestor",
    senha: SENHA_DEMO,
  },
];

function semSenha(u: UsuarioMock): Usuario {
  const { senha: _senha, ...resto } = u;
  void _senha;
  return resto;
}

/* ------------------------------------------------------------------ */
/* Store (persistido em localStorage — chave 'erina-auth')             */
/* ------------------------------------------------------------------ */

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      /* --- estado inicial --- */
      usuario: null,
      autenticado: false,
      usuarios: USUARIOS_INICIAIS,
      hidratado: false,

      /* --- ações --- */
      login: (email, senha) => {
        const alvo = email.trim().toLowerCase();
        const usuario = get().usuarios.find(
          (u) => u.email.toLowerCase() === alvo
        );

        if (!usuario) {
          return { ok: false, erro: "E-mail não encontrado." };
        }
        if (usuario.senha !== senha) {
          return { ok: false, erro: "Senha incorreta." };
        }

        set({ usuario: semSenha(usuario), autenticado: true });
        return { ok: true };
      },

      logout: () => set({ usuario: null, autenticado: false }),

      cadastrarFuncionario: ({ nome, email, cargo }) => {
        const alvo = email.trim().toLowerCase();
        if (!nome.trim() || !alvo || !cargo.trim()) {
          return { ok: false, erro: "Preencha nome, e-mail e cargo." };
        }
        if (get().usuarios.some((u) => u.email.toLowerCase() === alvo)) {
          return { ok: false, erro: "Já existe um usuário com esse e-mail." };
        }

        const novo: UsuarioMock = {
          nome: nome.trim(),
          email: email.trim(),
          cargo: cargo.trim(),
          role: "funcionario",
          senha: SENHA_DEMO,
        };
        set((s) => ({ usuarios: [...s.usuarios, novo] }));
        return { ok: true };
      },

      setHidratado: (v) => set({ hidratado: v }),
    }),
    {
      name: "erina-auth",
      // Persiste sessão + lista de usuários (funcionários cadastrados sobrevivem ao reload).
      partialize: (s) => ({
        usuario: s.usuario,
        autenticado: s.autenticado,
        usuarios: s.usuarios,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHidratado(true);
      },
    }
  )
);
