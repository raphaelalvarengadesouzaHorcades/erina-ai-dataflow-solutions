import { QuadroKanban } from "@/components/tarefas/QuadroKanban";

export default function TarefasPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-ink">Tarefas</h1>
        <p className="mt-1 text-muted">Organize seu dia no seu ritmo</p>
      </header>

      <QuadroKanban />
    </div>
  );
}
