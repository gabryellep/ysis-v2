"use client";

type DeleteSessionActionProps = {
  onDelete: () => void;
  label?: string;
};

export function DeleteSessionAction({ onDelete, label = "Apagar sessao" }: DeleteSessionActionProps) {
  function confirmDelete() {
    const confirmed = window.confirm("Apagar o texto, a revisao e a finalidade escolhida? Esta acao limpa a sessao atual.");
    if (confirmed) onDelete();
  }

  return (
    <button
      type="button"
      onClick={confirmDelete}
      className="rounded-xl bg-[rgba(231,176,184,0.18)] px-4 py-2.5 text-sm text-wine transition hover:bg-[rgba(231,176,184,0.28)]"
    >
      {label}
    </button>
  );
}
