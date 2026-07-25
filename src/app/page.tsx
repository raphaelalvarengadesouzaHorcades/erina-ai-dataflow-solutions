"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Heart, Brain, Zap, Shield, Clock, MessageCircle, Mail, ChevronRight } from "lucide-react";

export default function LandingPage() {
  // Scroll-reveal
  useEffect(() => {
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion:reduce)").matches;

    const targets: [HTMLElement, number][] = [];
    document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((g) => {
      Array.from(g.children).forEach((c, i) =>
        targets.push([c as HTMLElement, i])
      );
    });
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      targets.push([el, Number(el.getAttribute("data-reveal")) || 0]);
    });

    if (reduce) {
      targets.forEach(([el]) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    targets.forEach(([el, i]) => {
      el.classList.add("reveal");
      el.style.transitionDelay = `${i * 90}ms`;
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Assistente IA",
      description: "A Erina acompanha você durante a jornada, tirando dúvidas e ajudando na organização.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Controle de Jornada",
      description: "Registre seu ponto, pausas e intervalos de forma simples e transparente.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Modo Emergência",
      description: "Em situações urgentes, a IA responde automaticamente seus e-mails e mensagens.",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "E-mail Integrado",
      description: "Acesse seus e-mails diretamente no CRM, com resumos inteligentes da IA.",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "WhatsApp",
      description: "Visualize e responda mensagens do WhatsApp sem sair da plataforma.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Conformidade",
      description: "Sua jornada sempre dentro das regras trabalhistas, com alertas preventivos.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f5ff] to-white">
      {/* Estilos para animação */}
      <style>{`
        .reveal { opacity: 0; transform: translateY(26px); transition: opacity .7s cubic-bezier(.22,.7,.2,1), transform .7s cubic-bezier(.22,.7,.2,1); will-change: opacity, transform; }
        .reveal.in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion:reduce) { .reveal { opacity: 1 !important; transform: none !important; } }
      `}</style>

      {/* ============ NAV ============ */}
      <header className="border-b border-[#e5e2ee] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7b61ff] to-[#9b85ff] flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1a1b2e]">Erina</span>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7b61ff] text-white font-semibold rounded-xl hover:bg-[#6a4bf5] transition-colors"
          >
            Acessar Portal
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-reveal="">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ede9fe] text-[#7b61ff] text-sm font-medium mb-6">
                <Heart className="w-4 h-4" />
                Seu bem-estar em primeiro lugar
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-[#1a1b2e] leading-tight mb-6">
                Produtividade com{" "}
                <span className="text-[#7b61ff]">saúde mental</span>
              </h1>
              <p className="text-lg text-[#5c5870] mb-8 max-w-lg leading-relaxed">
                O Erina é seu companheiro de trabalho. Uma IA que cuida de você 
                enquanto você cuida do que importa. Sem invasão, sem pressão — 
                só apoio inteligente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#7b61ff] text-white font-bold rounded-xl hover:bg-[#6a4bf5] transition-all shadow-lg shadow-[#7b61ff]/25"
                >
                  Entrar no Portal
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-[#6b6780]">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Sistema online
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Seguro e privado
                </span>
              </div>
            </div>

            {/* Card de demonstração */}
            <div data-reveal="1" className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7b61ff]/20 to-[#9b85ff]/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-[#7b61ff]/10 border border-[#e5e2ee] p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#ede9fe] flex items-center justify-center">
                    <Brain className="w-6 h-6 text-[#7b61ff]" />
                  </div>
                  <div>
                    <div className="font-bold text-[#1a1b2e]">Erina</div>
                    <div className="text-xs text-[#6b6780]">Assistente de IA</div>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#7b61ff]" />
                    <div className="w-2 h-2 rounded-full bg-[#7b61ff]/50" />
                    <div className="w-2 h-2 rounded-full bg-[#7b61ff]/25" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#f7f5ff] rounded-2xl p-4">
                    <p className="text-sm text-[#3a3654]">
                      👋 Olá! Estou aqui para ajudar. Durante seu intervalo, 
                      vou verificar seus e-mails e mensagens. Quando você voltar, 
                      te conto tudo o que aconteceu.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 bg-white border border-[#e5e2ee] rounded-xl p-3 text-center hover:border-[#7b61ff] hover:bg-[#f7f5ff] transition-colors cursor-pointer">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-[#7b61ff]" />
                      <span className="text-xs font-medium text-[#3a3654]">Intervalo</span>
                    </div>
                    <div className="flex-1 bg-white border border-[#e5e2ee] rounded-xl p-3 text-center hover:border-red-400 hover:bg-red-50 transition-colors cursor-pointer">
                      <Zap className="w-5 h-5 mx-auto mb-1 text-red-500" />
                      <span className="text-xs font-medium text-[#3a3654]">Emergência</span>
                    </div>
                  </div>

                  <div className="bg-[#dcfce7] rounded-2xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">Tudo certo!</span>
                    </div>
                    <p className="text-xs text-green-700">
                      Sua jornada está em conformidade. Você tem 2h de saldo positivo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16" data-reveal="">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1b2e] mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-lg text-[#5c5870] max-w-2xl mx-auto">
              Ferramentas integradas para você trabalhar melhor, com mais foco 
              e menos estresse.
            </p>
          </div>

          <div data-reveal-group="" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-6 bg-white rounded-2xl border border-[#e5e2ee] hover:border-[#7b61ff]/30 hover:shadow-lg hover:shadow-[#7b61ff]/5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#ede9fe] flex items-center justify-center text-[#7b61ff] mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1a1b2e] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#5c5870] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ COMO FUNCIONA ============ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16" data-reveal="">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1b2e] mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-[#5c5870]">
              Três passos simples para uma jornada mais leve
            </p>
          </div>

          <div data-reveal-group="" className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Trabalhe normalmente",
                description: "A Erina fica em segundo plano, pronta para ajudar quando você precisar. Sem interrupções.",
              },
              {
                step: "02",
                title: "Faça uma pausa",
                description: "Clique em 'Intervalo' quando precisar descansar. A IA cuida das suas demandas enquanto isso.",
              },
              {
                step: "03",
                title: "Volte informado",
                description: "Ao retornar, receba um resumo completo do que aconteceu. Nada passa despercebido.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-extrabold text-[#ede9fe] mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-[#1a1b2e] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#5c5870] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div data-reveal="" className="relative bg-gradient-to-br from-[#7b61ff] to-[#6a4bf5] rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative">
              <Heart className="w-12 h-12 text-white/80 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Pronto para começar?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Acesse o portal e descubra como a Erina pode transformar 
                sua experiência de trabalho.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#7b61ff] font-bold rounded-xl hover:bg-[#f7f5ff] transition-colors shadow-lg"
              >
                Acessar o Portal
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-[#e5e2ee] bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7b61ff] to-[#9b85ff] flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#1a1b2e]">Erina</span>
          </div>
          <p className="text-sm text-[#6b6780]">
            Sua saúde mental importa. 💜
          </p>
          <p className="text-sm text-[#6b6780]">
            © {new Date().getFullYear()} Erina. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
