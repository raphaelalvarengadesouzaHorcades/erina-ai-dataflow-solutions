"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function LandingPage() {
  // Scroll-reveal — reimplementação do script original do export (IntersectionObserver).
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

  return (
    <>
      {/* Fonte + estilos do export (isolados, não tocam globals.css) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin=""
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
  .erina-landing *{box-sizing:border-box}
  .erina-landing{font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:#1a1b2e;background:#ffffff;-webkit-font-smoothing:antialiased}
  .erina-landing a{color:#6d4df0;text-decoration:none}
  .erina-landing a:hover{color:#5a3ce0}
  .erina-landing [data-reveal],.erina-landing [data-reveal-group]>*{opacity:0;transform:translateY(26px)}
  .erina-landing .reveal{transition:opacity .7s cubic-bezier(.22,.7,.2,1),transform .7s cubic-bezier(.22,.7,.2,1);will-change:opacity,transform}
  .erina-landing .reveal.in{opacity:1;transform:none}
  @media (prefers-reduced-motion:reduce){.erina-landing [data-reveal],.erina-landing [data-reveal-group]>*{opacity:1!important;transform:none!important}}
  html{scroll-behavior:smooth}
  .erina-landing section[id],.erina-landing footer[id]{scroll-margin-top:24px}
  .erina-landing h1,.erina-landing h2,.erina-landing h3,.erina-landing p,.erina-landing span,.erina-landing a{overflow-wrap:break-word;word-break:break-word}
  .erina-landing .erina-logo{flex-shrink:0;max-width:100%;height:auto;object-fit:contain}
  .erina-landing .hero-media{display:none}
  @media (max-width:900px){
    .erina-landing .nav-links{display:none!important}
    .erina-landing .hero-inner{padding:40px 22px!important;min-height:auto!important;flex-direction:column!important;align-items:stretch!important;gap:34px!important}
    .erina-landing .hero-copy{max-width:100%!important}
    .erina-landing .hero-section{min-height:auto!important;background:#eceafd!important}
    .erina-landing .hero-overlay{display:none!important}
    .erina-landing .hero-media{display:block!important;width:100%!important;max-width:420px!important;height:auto!important;margin:0 auto!important;border-radius:22px!important}
    .erina-landing h1{font-size:clamp(32px,9vw,46px)!important;letter-spacing:-1px!important}
    .erina-landing h2{font-size:clamp(26px,6.5vw,36px)!important;letter-spacing:-.5px!important}
    .erina-landing .grid-4,.erina-landing .grid-3,.erina-landing .grid-app,.erina-landing .grid-ai{grid-template-columns:1fr!important}
    .erina-landing .grid-app,.erina-landing .grid-ai{gap:36px!important}
    .erina-landing .grid-ai{padding:28px!important}
    .erina-landing .app-section{margin:56px auto!important}
    .erina-landing .nav-inner{padding:18px 20px!important}
    .erina-landing .section-pad{padding-left:20px!important;padding-right:20px!important}
    .erina-landing .footer-grid{grid-template-columns:1fr 1fr!important}
    .erina-landing .hero-cta{width:100%!important}
    .erina-landing .cta-banner{padding:32px 24px!important}
  }
  @media (max-width:560px){
    .erina-landing .hero-inner{padding:32px 18px!important}
    .erina-landing .section-pad{padding-left:16px!important;padding-right:16px!important}
    .erina-landing h1{font-size:clamp(28px,8.5vw,40px)!important}
    .erina-landing h2{font-size:clamp(23px,7vw,30px)!important}
    .erina-landing .footer-grid{gap:24px!important}
    .erina-landing .care-strip{padding:48px 0 56px!important}
    .erina-landing .underline-svg{display:none!important}
    .erina-landing .hero-badge{white-space:normal!important;height:auto!important}
  }
`}</style>

      <div className="erina-landing" style={{ width: "100%", background: "#ffffff", overflow: "hidden" }}>
        {/* ============ NAV ============ */}
        <header style={{ background: "#fbfafc" }}>
          <div
            className="nav-inner"
            style={{
              maxWidth: "1600px",
              margin: "0 auto",
              padding: "26px 44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
            }}
          >
            <a href="#topo" style={{ display: "flex", alignItems: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="erina-logo" src="/landing-logo.png" alt="ERINA.IA" style={{ height: "44px", width: "auto", display: "block" }} />
            </a>
            <nav
              className="nav-links"
              style={{ display: "flex", alignItems: "center", gap: "32px", fontSize: "15.5px", fontWeight: 500, color: "#3f3a54" }}
            >
              <a href="#topo" style={{ color: "#3f3a54" }}>Produto</a>
              <a href="#recursos" style={{ color: "#3f3a54" }}>Recursos</a>
              <a href="#beneficios" style={{ color: "#3f3a54" }}>Benefícios</a>
              <a href="#depoimentos" style={{ color: "#3f3a54" }}>Depoimentos</a>
              <a href="#precos" style={{ color: "#3f3a54" }}>Preços</a>
              <a href="#contato" style={{ color: "#3f3a54" }}>Blog</a>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <Link href="/login" style={{ fontSize: "15.5px", fontWeight: 700, color: "#6d4df0" }}>Entrar</Link>
            </div>
          </div>
        </header>

        {/* ============ HERO ============ */}
        <section
          id="topo"
          className="hero-section"
          style={{ position: "relative", background: "url(/landing-hero-bg.png) center right/cover no-repeat", backgroundColor: "#eceafd", overflow: "hidden", minHeight: "660px" }}
        >
          <div className="hero-overlay" aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#efebfd 40%,rgba(239,235,253,.7) 56%,rgba(239,235,253,0) 74%)", pointerEvents: "none", zIndex: 1 }} />
          <div className="hero-inner" style={{ maxWidth: "1600px", margin: "0 auto", padding: "80px 56px", position: "relative", zIndex: 2, minHeight: "660px", display: "flex", alignItems: "center" }}>
            <div data-reveal-group="" className="hero-copy" style={{ position: "relative", zIndex: 2, maxWidth: "600px" }}>
              <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "9px", background: "#efeafe", color: "#6d4df0", fontSize: "14px", fontWeight: 600, padding: "9px 16px", borderRadius: "12px", marginBottom: "28px" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6d4df0" strokeWidth="1.9"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></svg>
                Controle de Jornada que cuida de pessoas
              </div>
              <h1 style={{ fontSize: "62px", lineHeight: 1.02, fontWeight: 800, letterSpacing: "-1.8px", margin: "0 0 24px" }}>
                Gestão por Cuidado<br />
                <span style={{ position: "relative", display: "inline-block", color: "#6d4df0" }}>
                  e não por controle.
                  <svg className="underline-svg" style={{ position: "absolute", left: 0, bottom: "-14px", maxWidth: "100%" }} width="380" height="20" viewBox="0 0 380 20" fill="none"><path d="M4 13C70 4 250 2 376 9" stroke="#8e70f8" strokeWidth="4" strokeLinecap="round" /></svg>
                </span>
                <svg style={{ display: "inline-block", verticalAlign: "middle", marginLeft: "8px" }} width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#8e70f8" strokeWidth="1.8"><path d="M12 20.5C6 16 3.5 12.5 3.5 9.3A4.3 4.3 0 0112 6.6 4.3 4.3 0 0120.5 9.3C20.5 12.5 18 16 12 20.5Z" /></svg>
              </h1>
              <p style={{ fontSize: "18.5px", lineHeight: 1.6, color: "#5c5870", margin: "0 0 30px", maxWidth: "470px" }}>Acompanhe jornadas, promova equilíbrio e bem-estar e construa uma cultura de confiança e resultados sustentáveis.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "36px" }}>
                {[
                  "Jornadas flexíveis e personalizadas",
                  "Conformidade com a legislação",
                  "Relatórios inteligentes e em tempo real",
                  "Mais produtividade com qualidade de vida",
                ].map((t) => (
                  <span key={t} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16.5px", fontWeight: 500, color: "#2f2b45" }}>
                    <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#ede8fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6d4df0" strokeWidth="2.4"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "16px", marginBottom: "26px" }}>
                <a href="#recursos" className="hero-cta" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "11px", background: "#fff", color: "#2c2840", fontSize: "16.5px", fontWeight: 700, padding: "19px 28px", borderRadius: "15px", border: "1.5px solid #e5e2ee" }}>
                  Conhecer o produto
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#efeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#6d4df0"><path d="M7 5l12 7-12 7z" /></svg>
                  </span>
                </a>
              </div>
              <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", color: "#6b6780", fontSize: "14.5px", fontWeight: 500 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#a29ebc" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  Implantação rápida e simples
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#a29ebc" strokeWidth="1.8"><path d="M4 13a8 8 0 0116 0v4a2 2 0 01-2 2h-1v-6h3M4 13v4a2 2 0 002 2h1v-6H4" /></svg>
                  Suporte humanizado
                </span>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-media" src="/landing-hero-bg.png" alt="Aplicativo ERINA.IA em uso" />
          </div>
        </section>

        {/* ============ CARE FEATURE STRIP ============ */}
        <section id="beneficios" className="care-strip" style={{ background: "#f6f4fe", borderRadius: "44px 44px 0 0", marginTop: "-50px", padding: "72px 0 84px", position: "relative", zIndex: 2 }}>
          <div className="section-pad" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 44px", position: "relative" }}>
            <h2 style={{ textAlign: "center", fontSize: "38px", fontWeight: 800, letterSpacing: "-.8px", margin: "0 0 12px", position: "relative" }}>Mais do que controlar, é sobre cuidar</h2>
            <p style={{ textAlign: "center", fontSize: "18px", color: "#6b6780", margin: "0 auto 52px", maxWidth: "640px" }}>Recursos pensados para promover equilíbrio, bem-estar e alta performance.</p>
            <div data-reveal-group="" className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "34px" }}>
              {[
                { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6d4df0" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>, title: "Flexibilidade com responsabilidade", text: "Jornadas adaptáveis à realidade do seu time e do seu negócio." },
                { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6d4df0" strokeWidth="1.8"><path d="M12 20.5C6 16 3.5 12.5 3.5 9.3A4.3 4.3 0 0112 6.6 4.3 4.3 0 0120.5 9.3C20.5 12.5 18 16 12 20.5Z" /></svg>, title: "Bem-estar em primeiro lugar", text: "Pausas inteligentes, alertas de excesso e incentivo ao equilíbrio diário." },
                { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6d4df0" strokeWidth="1.8"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></svg>, title: "Dados que geram insights", text: "Relatórios claros para decisões humanas e estratégicas." },
                { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6d4df0" strokeWidth="1.8"><path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z" /></svg>, title: "Conformidade sem burocracia", text: "Adequado à legislação trabalhista e sempre atualizado." },
              ].map((c) => (
                <div key={c.title}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "15px", background: "#ede8fe", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>{c.icon}</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "9px" }}>{c.title}</div>
                  <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#6b6780", margin: 0 }}>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ APP MOBILE ============ */}
        <section id="app" className="section-pad grid-app app-section" style={{ maxWidth: "1600px", margin: "90px auto", padding: "0 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "center" }}>
          <div data-reveal-group="">
            <div style={{ display: "inline-flex", alignItems: "center", gap: "9px", background: "#efeafe", color: "#6d4df0", fontSize: "14px", fontWeight: 600, padding: "9px 16px", borderRadius: "12px", marginBottom: "24px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6d4df0" strokeWidth="1.9"><rect x="7" y="2" width="10" height="20" rx="3" /><path d="M11 19h2" /></svg>
              Aplicativo mobile
            </div>
            <h2 style={{ fontSize: "44px", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.08, margin: "0 0 20px" }}>O cuidado também cabe no bolso da sua equipe</h2>
            <p style={{ fontSize: "18px", lineHeight: 1.6, color: "#5c5870", margin: "0 0 30px", maxWidth: "460px" }}>Registre ponto, acompanhe pausas e veja o status da jornada em tempo real — direto do celular, onde a pessoa estiver.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "34px" }}>
              {[
                "Bata ponto e registre pausas em segundos",
                "Timer Pomodoro para foco e descanso saudável",
                "Status CLT e conformidade sempre à vista",
                "Alertas e notificações no seu bolso",
              ].map((t) => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16.5px", fontWeight: 500, color: "#2f2b45" }}>
                  <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#ede8fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6d4df0" strokeWidth="2.4"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>
                  {t}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <a href="#topo" style={{ display: "flex", alignItems: "center", gap: "11px", background: "#17151f", color: "#fff", padding: "13px 22px", borderRadius: "14px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M16.4 12.9c0-2 1.6-3 1.7-3-.9-1.4-2.4-1.5-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.4 2 2.4 2 1 0 1.3-.6 2.5-.6s1.5.6 2.5.6 1.7-1 2.3-2c.7-1.1 1-2.2 1-2.2s-1.9-.7-1.9-2.9zM14.6 6.9c.5-.7.9-1.6.8-2.5-.8 0-1.7.5-2.3 1.2-.5.6-.9 1.5-.8 2.4.9.1 1.7-.4 2.3-1.1z" /></svg>
                <span style={{ lineHeight: 1.1, fontSize: "12px" }}>
                  <span style={{ display: "block", opacity: 0.75, fontSize: "10px" }}>Baixar na</span>
                  <span style={{ fontWeight: 700, fontSize: "15px" }}>App Store</span>
                </span>
              </a>
              <a href="#topo" style={{ display: "flex", alignItems: "center", gap: "11px", background: "#17151f", color: "#fff", padding: "13px 22px", borderRadius: "14px" }}>
                <svg width="20" height="22" viewBox="0 0 24 24"><path d="M3.6 2.3l10.3 9.7L3.6 21.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1z" fill="#4ade80" /><path d="M17.5 8.6l-3.6 3.4 3.6 3.4 3.1-1.8c.9-.5.9-1.7 0-2.2l-3.1-2.8z" fill="#fbbf24" /><path d="M3.6 2.3c.3-.2.7-.2 1.1 0l9.2 5.3-1.9 1.8L3.6 2.3z" fill="#f87171" /><path d="M13.9 12l-1.9 1.9 1.9 5.3-9.2 2.5c-.4.2-.8.2-1.1 0l10.3-9.7z" fill="#60a5fa" /></svg>
                <span style={{ lineHeight: 1.1, fontSize: "12px" }}>
                  <span style={{ display: "block", opacity: 0.75, fontSize: "10px" }}>Disponível no</span>
                  <span style={{ fontWeight: 700, fontSize: "15px" }}>Google Play</span>
                </span>
              </a>
            </div>
          </div>

          <div data-reveal="" style={{ display: "flex", justifyContent: "center" }}>
            {/* Mockup do app em moldura de celular */}
            <div style={{ width: "402px", maxWidth: "100%", background: "#0f0e18", borderRadius: "48px", padding: "12px", boxShadow: "0 30px 70px rgba(40,30,90,.28)" }}>
              <div style={{ background: "#fbfbfd", borderRadius: "38px", padding: "58px 22px 40px", boxSizing: "border-box", position: "relative", fontFamily: "-apple-system,system-ui,sans-serif" }}>
                {/* app top bar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "26px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2a2740" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f0eefb", borderRadius: "9999px", padding: "6px 8px 6px 12px" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#6d4df0"><path d="M13 2L4 14h6l-1 8 9-12h-6z" /></svg>
                    <div style={{ width: "34px", height: "19px", borderRadius: "9999px", background: "#fff", position: "relative", boxShadow: "inset 0 0 0 1px #e3def6" }}>
                      <div style={{ position: "absolute", left: "2px", top: "2px", width: "15px", height: "15px", borderRadius: "50%", background: "#c9c2e8" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2a2740" strokeWidth="1.9"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></svg>
                    <div style={{ position: "relative" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2a2740" strokeWidth="1.9"><path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M10.5 21a1.8 1.8 0 003 0" /></svg>
                      <span style={{ position: "absolute", top: "-6px", right: "-6px", width: "16px", height: "16px", background: "#f97316", color: "#fff", fontSize: "10px", fontWeight: 700, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>2</span>
                    </div>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#ece9fe", color: "#6d4df0", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>MS</div>
                  </div>
                </div>
                {/* greeting */}
                <div style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "-.5px", color: "#1f2233", marginBottom: "8px" }}>Olá, Mariana 👋</div>
                <div style={{ fontSize: "15px", color: "#8a8b9c", lineHeight: 1.4, marginBottom: "22px" }}>Desenvolvedora · Visão geral da sua jornada de trabalho</div>
                {/* timer card */}
                <div style={{ background: "#fff", borderRadius: "22px", boxShadow: "0 10px 30px rgba(40,30,90,.07)", padding: "22px", marginBottom: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", marginBottom: "16px" }}>
                    <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#f97316" }} />
                    <span style={{ fontWeight: 700, color: "#f97316" }}>Em pausa</span>
                    <span style={{ color: "#9a9bad" }}>· Desde 08:00</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: "12px", marginBottom: "18px" }}>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: "52px", fontWeight: 800, letterSpacing: "-2px", color: "#28304a", lineHeight: 1 }}>06</div><div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1px", color: "#9a9bad", marginTop: "4px" }}>HORAS</div></div>
                    <div style={{ fontSize: "44px", fontWeight: 800, color: "#c9cad6", lineHeight: 1.1 }}>:</div>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: "52px", fontWeight: 800, letterSpacing: "-2px", color: "#28304a", lineHeight: 1 }}>24</div><div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1px", color: "#9a9bad", marginTop: "4px" }}>MINUTOS</div></div>
                    <div style={{ fontSize: "44px", fontWeight: 800, color: "#c9cad6", lineHeight: 1.1 }}>:</div>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: "52px", fontWeight: 800, letterSpacing: "-2px", color: "#28304a", lineHeight: 1 }}>23</div><div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1px", color: "#9a9bad", marginTop: "4px" }}>SEGUNDOS</div></div>
                  </div>
                  <button style={{ width: "100%", background: "#ece9fe", color: "#6d4df0", border: "none", borderRadius: "14px", padding: "15px", fontSize: "16px", fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "11px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#6d4df0"><path d="M7 5l12 7-12 7z" /></svg>Encerrar pausa
                  </button>
                  <button style={{ width: "100%", background: "#ef4444", color: "#fff", border: "none", borderRadius: "14px", padding: "15px", fontSize: "16px", fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" fill="#fff" /></svg>Encerrar jornada
                  </button>
                </div>
                {/* status CLT card */}
                <div style={{ background: "#fff", borderRadius: "22px", boxShadow: "0 10px 30px rgba(40,30,90,.07)", padding: "22px 22px 26px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontSize: "18px", fontWeight: 800, color: "#28304a" }}>Status CLT</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c3c4d2" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 12px" }}>
                    <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8"><path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" strokeWidth="2.2" /></svg>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", fontSize: "20px", fontWeight: 800, color: "#16a34a", marginBottom: "8px" }}>Dentro das regras</div>
                  <div style={{ textAlign: "center", fontSize: "14px", color: "#8a8b9c", lineHeight: 1.5, marginBottom: "18px" }}>Tudo certo! Sua jornada está em conformidade com a legislação trabalhista.</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                    {["Intervalo realizado", "Jornada dentro do limite", "Descanso diário ok", "Sem horas extras"].map((t) => (
                      <span key={t} style={{ display: "flex", alignItems: "center", gap: "11px", fontSize: "16px", color: "#3a3654" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.5 2.5 4.5-5" /></svg>{t}
                      </span>
                    ))}
                  </div>
                </div>
                {/* floating pomodoro pill */}
                <div style={{ position: "absolute", right: "22px", bottom: "52px", display: "flex", alignItems: "center", gap: "10px", background: "#fff", borderRadius: "9999px", boxShadow: "0 8px 24px rgba(40,30,90,.16)", padding: "7px 7px 7px 14px" }}>
                  <span style={{ fontSize: "18px" }}>🍅</span>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: "#28304a" }}>20:00</span>
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#6d4df0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M7 5l12 7-12 7z" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ AI / ERINA ============ */}
        <section id="recursos" className="section-pad" style={{ maxWidth: "1600px", margin: "80px auto", padding: "0 44px" }}>
          <div data-reveal="" className="grid-ai" style={{ background: "linear-gradient(135deg,#f1eefe,#ece9fd)", borderRadius: "28px", padding: "56px", display: "grid", gridTemplateColumns: "1fr 0.82fr 1fr", gap: "30px", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-.6px", lineHeight: 1.12, margin: "0 0 18px" }}>Inteligência artificial ao seu lado</h2>
              <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#5c5870", margin: "0 0 22px" }}>A Erina, nossa assistente de IA, está sempre disponível para tirar dúvidas, explicar regras, analisar jornadas e ajudar sua equipe.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                {[
                  "Responde dúvidas sobre jornadas e pausas",
                  "Explica a legislação de forma simples",
                  "Analisa situações específicas",
                  "Disponível 24/7 para sua equipe",
                ].map((t) => (
                  <span key={t} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", color: "#3a3654" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2"><path d="M20 6L9 17l-5-5" /></svg>{t}
                  </span>
                ))}
              </div>
              <Link href="/login" style={{ display: "inline-block", background: "linear-gradient(135deg,#8e70f8,#6a48ef)", color: "#fff", fontSize: "16px", fontWeight: 700, padding: "15px 28px", borderRadius: "13px", boxShadow: "0 12px 26px rgba(109,77,240,.3)" }}>Conhecer a Erina</Link>
            </div>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg style={{ position: "absolute", top: "-6px", left: "6px" }} width="34" height="34" viewBox="0 0 24 24" fill="#6d4df0"><path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6z" /></svg>
              <div style={{ width: "224px", maxWidth: "100%", height: "256px", borderRadius: "20px", overflow: "hidden", boxShadow: "0 18px 40px rgba(60,50,120,.18)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/landing-erina.png" alt="Ilustração da Erina" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ marginTop: "-26px", background: "#fff", borderRadius: "14px", boxShadow: "0 12px 30px rgba(60,50,120,.14)", padding: "12px 16px", textAlign: "center", position: "relative", zIndex: 2 }}>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>Olá! Eu sou a <span style={{ color: "#6d4df0" }}>Erina</span>.</div>
                <div style={{ fontSize: "12px", color: "#8a8b9c" }}>Como posso te ajudar hoje?</div>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: "18px", boxShadow: "0 20px 50px rgba(60,50,120,.16)", padding: "18px 18px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0f0f5", paddingBottom: "12px", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#6d4df0"><path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6z" /><circle cx="18.5" cy="17.5" r="2" /></svg>
                  <div style={{ lineHeight: 1.1 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700 }}>Erina</div>
                    <div style={{ fontSize: "10px", color: "#9a8fe0" }}>Assistente de IA</div>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b7b8c6" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </div>
              <div style={{ background: "#f4f1fe", borderRadius: "12px", padding: "11px 13px", fontSize: "13px", lineHeight: 1.5, color: "#3a3654", marginBottom: "14px" }}>Olá! Eu sou a Erina. Como posso te ajudar hoje?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginBottom: "16px" }}>
                {[
                  "Estou dentro das regras hoje?",
                  "Qual o meu saldo de horas?",
                  "Posso fazer hora extra hoje?",
                  "Entender minhas pausas",
                ].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: "9px", border: "1px solid #ececf2", borderRadius: "10px", padding: "10px 12px", fontSize: "12.5px", color: "#4b4c60" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6d4df0" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 8v4l2 2" /></svg>{t}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", border: "1px solid #ececf2", borderRadius: "11px", padding: "10px 12px", marginBottom: "10px" }}>
                <span style={{ flex: 1, fontSize: "12.5px", color: "#a0a1b3" }}>Digite sua pergunta...</span>
                <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: "#6d4df0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4 12l16-8-6 16-2-6-8-2z" /></svg>
                </div>
              </div>
              <div style={{ textAlign: "center", fontSize: "10px", color: "#a8a9ba" }}>Erina pode cometer erros. Confira as informações.</div>
            </div>
          </div>
        </section>

        {/* ============ PRICING ============ */}
        <section id="precos" className="section-pad" style={{ maxWidth: "1600px", margin: "0 auto", padding: "14px 44px 80px" }}>
          <h2 style={{ textAlign: "center", fontSize: "38px", fontWeight: 800, letterSpacing: "-.8px", margin: "0 0 12px" }}>Para empresas de todos os tamanhos</h2>
          <p style={{ textAlign: "center", fontSize: "18px", color: "#6b6780", margin: "0 auto 48px" }}>Soluções flexíveis que crescem com seu negócio.</p>
          <div data-reveal-group="" className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px", alignItems: "stretch" }}>
            {[
              { nome: "Básico", desc: "Ideal para pequenas equipes", preco: <><span style={{ fontSize: "16px", fontWeight: 600, color: "#6b6780" }}>R$ </span><span style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-1px" }}>9</span><span style={{ fontSize: "22px", fontWeight: 700 }}>,90</span><div style={{ fontSize: "13px", color: "#9a9bad", marginTop: "2px" }}>por usuário/mês</div></>, itens: ["Controle de jornada", "Relatórios básicos", "Banco de horas", "Suporte por email"], cta: "Começar grátis", featured: false },
              { nome: "Profissional", desc: "Para empresas em crescimento", preco: <><span style={{ fontSize: "16px", fontWeight: 600, color: "#6b6780" }}>R$ </span><span style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-1px" }}>19</span><span style={{ fontSize: "22px", fontWeight: 700 }}>,90</span><div style={{ fontSize: "13px", color: "#9a9bad", marginTop: "2px" }}>por usuário/mês</div></>, itens: ["Tudo do plano Básico", "Relatórios avançados", "Alertas e notificações", "Suporte prioritário"], cta: "Começar grátis", featured: true },
              { nome: "Empresarial", desc: "Para empresas consolidadas", preco: <><span style={{ fontSize: "16px", fontWeight: 600, color: "#6b6780" }}>R$ </span><span style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-1px" }}>29</span><span style={{ fontSize: "22px", fontWeight: 700 }}>,90</span><div style={{ fontSize: "13px", color: "#9a9bad", marginTop: "2px" }}>por usuário/mês</div></>, itens: ["Tudo do plano Profissional", "Integrações via API", "Relatórios personalizados", "Suporte dedicado"], cta: "Falar com vendas", featured: false },
              { nome: "Personalizado", desc: "Solução sob medida", preco: <><span style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "-.6px" }}>Sob consulta</span><div style={{ fontSize: "13px", color: "#9a9bad", marginTop: "4px" }}>preço personalizado</div></>, itens: ["Tudo do plano Empresarial", "Desenvolvimentos customizados", "Treinamento dedicado", "SLA personalizado"], cta: "Falar com vendas", featured: false },
            ].map((p) => (
              <div key={p.nome} style={{ display: "flex", flexDirection: "column", background: "#fff", border: p.featured ? "2px solid #6d4df0" : "1px solid #ececf2", borderRadius: "18px", padding: "28px 24px", boxShadow: p.featured ? "0 20px 44px rgba(109,77,240,.14)" : "none", position: "relative" }}>
                {p.featured ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <div style={{ fontSize: "19px", fontWeight: 700 }}>{p.nome}</div>
                    <div style={{ background: "#6d4df0", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "5px 12px", borderRadius: "20px", whiteSpace: "nowrap" }}>Mais popular</div>
                  </div>
                ) : (
                  <div style={{ fontSize: "19px", fontWeight: 700 }}>{p.nome}</div>
                )}
                <div style={{ fontSize: "13.5px", color: "#8a8b9c", margin: "4px 0 22px" }}>{p.desc}</div>
                <div style={{ marginBottom: "22px" }}>{p.preco}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "11px", marginBottom: "26px" }}>
                  {p.itens.map((it) => (
                    <span key={it} style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "14px", color: "#4b4c60" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2"><path d="M20 6L9 17l-5-5" /></svg>{it}
                    </span>
                  ))}
                </div>
                <Link href="/login" style={p.featured
                  ? { marginTop: "auto", textAlign: "center", background: "linear-gradient(135deg,#8e70f8,#6a48ef)", color: "#fff", fontSize: "15px", fontWeight: 700, padding: "13px", borderRadius: "12px", boxShadow: "0 10px 22px rgba(109,77,240,.3)" }
                  : { marginTop: "auto", textAlign: "center", background: "#fff", color: "#2c2840", fontSize: "15px", fontWeight: 700, padding: "13px", borderRadius: "12px", border: "1.5px solid #e5e2ee" }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ============ TESTIMONIALS ============ */}
        <section id="depoimentos" className="section-pad" style={{ maxWidth: "1600px", margin: "0 auto", padding: "14px 44px 80px" }}>
          <h2 style={{ textAlign: "center", fontSize: "38px", fontWeight: 800, letterSpacing: "-.8px", margin: "0 0 12px" }}>O que nossos clientes dizem</h2>
          <p style={{ textAlign: "center", fontSize: "18px", color: "#6b6780", margin: "0 auto 48px" }}>Empresas que transformaram sua gestão de jornada conosco.</p>
          <div data-reveal-group="" className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px" }}>
            {[
              { texto: "“O Controle de Jornada revolucionou nossa gestão. Relatórios que antes levavam horas agora são gerados automaticamente.”", nome: "Carlos Silva", cargo: "Diretor de RH, TechCorp", ini: "CS" },
              { texto: "“Interface intuitiva, suporte excelente e conformidade garantida. Recomendo para todas as empresas.”", nome: "Ana Santos", cargo: "Gerente de DP, Inova Solutions", ini: "AS" },
              { texto: "“A Erina é incrível! Nossos colaboradores tiram dúvidas na hora e nossa equipe de RH ganha tempo para o que importa.”", nome: "Roberto Lima", cargo: "CEO, StartUp Digital", ini: "RL" },
            ].map((d) => (
              <div key={d.nome} style={{ border: "1px solid #ececf2", borderRadius: "18px", padding: "28px" }}>
                <div style={{ display: "flex", gap: "3px", marginBottom: "16px" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6z" /></svg>
                  ))}
                </div>
                <p style={{ fontSize: "15.5px", lineHeight: 1.65, color: "#3f3a54", margin: "0 0 24px" }}>{d.texto}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#ece9fe", color: "#6d4df0", fontSize: "15px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{d.ini}</div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 700 }}>{d.nome}</div>
                    <div style={{ fontSize: "13px", color: "#8a8b9c" }}>{d.cargo}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ CTA BANNER ============ */}
        <section className="section-pad" style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 44px 72px" }}>
          <div data-reveal="" className="cta-banner" style={{ background: "linear-gradient(120deg,#7c5cf5,#6a48ef)", borderRadius: "24px", padding: "40px 46px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "30px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <div style={{ width: "54px", height: "54px", borderRadius: "15px", background: "rgba(255,255,255,.16)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M12 20.5C6 16 3.5 12.5 3.5 9.3A4.3 4.3 0 0112 6.6 4.3 4.3 0 0120.5 9.3C20.5 12.5 18 16 12 20.5Z" /></svg>
              </div>
              <div>
                <h2 style={{ color: "#fff", fontSize: "27px", fontWeight: 800, letterSpacing: "-.4px", margin: "0 0 6px" }}>Pronto para cuidar da jornada da sua equipe?</h2>
                <p style={{ color: "rgba(255,255,255,.85)", fontSize: "15px", lineHeight: 1.5, margin: 0, maxWidth: "560px" }}>Comece agora mesmo e descubra como é fácil equilibrar conformidade, bem-estar e produtividade.</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <a href="#recursos" style={{ background: "#fff", color: "#6a48ef", fontSize: "15px", fontWeight: 700, padding: "15px 26px", borderRadius: "13px", border: "1px solid rgba(255,255,255,.35)" }}>Conhecer o produto</a>
            </div>
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer id="contato" style={{ borderTop: "1px solid #eeeef3", padding: "56px 0 30px" }}>
          <div className="section-pad footer-grid" style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 44px", display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr", gap: "32px" }}>
            <div>
              <div style={{ marginBottom: "16px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="erina-logo" src="/landing-logo.png" alt="ERINA.IA" style={{ height: "40px", width: "auto", display: "block" }} />
              </div>
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#6b6780", margin: "0 0 20px", maxWidth: "300px" }}>Gestão de jornada que cuida de pessoas. Equilíbrio, bem-estar e conformidade com a legislação trabalhista brasileira.</p>
              <div style={{ display: "flex", gap: "12px" }}>
                {[
                  <svg key="1" width="17" height="17" viewBox="0 0 24 24" fill="#6b6c80"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.4 8.65 22 11 22 14.2V21h-4v-6c0-1.43-.03-3.27-2-3.27-2 0-2.3 1.56-2.3 3.17V21h-4z" /></svg>,
                  <svg key="2" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6b6c80" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="#6b6c80" /></svg>,
                  <svg key="3" width="17" height="17" viewBox="0 0 24 24" fill="#6b6c80"><path d="M22 7.2a3 3 0 00-2.1-2.1C18 4.5 12 4.5 12 4.5s-6 0-7.9.6A3 3 0 002 7.2 31 31 0 002 12a31 31 0 00.1 4.8 3 3 0 002.1 2.1c1.9.6 7.8.6 7.8.6s6 0 7.9-.6a3 3 0 002.1-2.1A31 31 0 0022 12a31 31 0 00-.0-4.8zM10 15V9l5 3z" /></svg>,
                  <svg key="4" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6b6c80" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></svg>,
                ].map((icon, i) => (
                  <a key={i} href="#topo" style={{ width: "34px", height: "34px", borderRadius: "9px", background: "#f2f2f7", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</a>
                ))}
              </div>
            </div>
            {[
              { titulo: "Produto", itens: ["Recursos", "Preços", "Integrações", "Atualizações"] },
              { titulo: "Empresa", itens: ["Sobre nós", "Blog", "Carreiras", "Contato"] },
              { titulo: "Suporte", itens: ["Central de ajuda", "Documentação", "Status do sistema", "Suporte"] },
              { titulo: "Legal", itens: ["Termos de uso", "Política de privacidade", "LGPD", "Segurança"] },
            ].map((col) => (
              <div key={col.titulo}>
                <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>{col.titulo}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "11px", fontSize: "14px" }}>
                  {col.itens.map((it) => (
                    <a key={it} href="#topo" style={{ color: "#6b6780" }}>{it}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ maxWidth: "1600px", margin: "36px auto 0", padding: "22px 44px 0", borderTop: "1px solid #eeeef3", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px", color: "#8a8b9c", flexWrap: "wrap", gap: "12px" }}>
            <span>© 2024 ERINA.IA. Todos os direitos reservados.</span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>Feito com <svg width="15" height="15" viewBox="0 0 24 24" fill="#6d4df0"><path d="M12 20.5C6 16 3.5 12.5 3.5 9.3A4.3 4.3 0 0112 6.6 4.3 4.3 0 0120.5 9.3C20.5 12.5 18 16 12 20.5Z" /></svg> no Brasil</span>
          </div>
        </footer>
      </div>
    </>
  );
}
