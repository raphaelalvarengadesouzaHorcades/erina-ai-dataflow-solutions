"use client";

import { Heart } from "lucide-react";

/**
 * Mensagem de reforço ético: aqui o objetivo é bem-estar, não produtividade
 * vigiada. Reforça o valor da Frente 02/03 do desafio.
 */
export function MensagemReforco() {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-success/20 bg-success-light/50 p-6">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success-light text-success-dark">
        <Heart className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <div>
        <h3 className="text-base font-bold text-ink">
          Aqui a meta é você — não a sua produtividade
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Estes pontos não medem quanto você produz nem servem para ninguém te
          vigiar. Eles celebram os cuidados que você tem com a sua saúde ao longo
          do dia. Ninguém no RH vê esses números do jeito individual — o
          protagonismo é seu. Cuide de você no seu ritmo. 💜
        </p>
      </div>
    </div>
  );
}
