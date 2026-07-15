"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AbaEmail } from "@/components/mensagens/AbaEmail";
import { AbaWhatsApp } from "@/components/mensagens/AbaWhatsApp";

type Aba = "email" | "whatsapp";

function MensagensConteudo() {
  const searchParams = useSearchParams();
  const abaParam = searchParams.get("aba");
  const idParam = searchParams.get("id");

  const abaInicial: Aba = abaParam === "whatsapp" ? "whatsapp" : "email";
  const [aba, setAba] = useState<Aba>(abaInicial);

  // O id só pré-seleciona a mensagem na aba a que ele pertence.
  const idEmailInicial = abaInicial === "email" ? idParam ?? undefined : undefined;
  const idWhatsappInicial =
    abaInicial === "whatsapp" ? idParam ?? undefined : undefined;

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-3xl font-bold text-ink">Mensagens</h1>
        <p className="mt-1 text-muted">
          Sua caixa de entrada — e a Erina já deixou rascunhos de resposta
          prontos.
        </p>
      </header>

      {/* Abas */}
      <div className="inline-flex w-fit gap-1 rounded-xl border border-border-soft bg-card p-1">
        <button
          onClick={() => setAba("email")}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
            aba === "email"
              ? "bg-primary text-white shadow-sm"
              : "text-muted hover:text-ink",
          )}
        >
          <Mail className="h-4 w-4" />
          E-mail
        </button>
        <button
          onClick={() => setAba("whatsapp")}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
            aba === "whatsapp"
              ? "bg-success text-white shadow-sm"
              : "text-muted hover:text-ink",
          )}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </button>
      </div>

      {aba === "email" ? (
        <AbaEmail idInicial={idEmailInicial} />
      ) : (
        <AbaWhatsApp idInicial={idWhatsappInicial} />
      )}
    </div>
  );
}

export default function MensagensPage() {
  return (
    <Suspense fallback={null}>
      <MensagensConteudo />
    </Suspense>
  );
}
