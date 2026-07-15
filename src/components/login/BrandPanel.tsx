/**
 * Coluna esquerda do login — APENAS a imagem oficial da marca ERINA.IA
 * (logo + headline + valores + foto), fornecida pela Rita. Sem HTML por cima.
 * Escondida no mobile (o formulário mostra o logo no topo).
 */
export function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-[#F3F1FB] lg:block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/login-brand.webp"
        alt="ERINA.IA — Gestão por cuidado e não por controle."
        className="h-full w-full object-contain object-center"
      />
    </aside>
  );
}
