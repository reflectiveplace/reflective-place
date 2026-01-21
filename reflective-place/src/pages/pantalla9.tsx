import { useEffect, useMemo, useState } from "react";

type Resource = {
  id: string;
  title: string;
  description: string;
};

function Pantalla9() {
  const [resourceId, setResourceId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("resourceId");
    if (stored) setResourceId(stored);
  }, []);

  useEffect(() => {
    if (resourceId) localStorage.setItem("resourceId", resourceId);
  }, [resourceId]);


  const resources = useMemo<Resource[]>(
    () => [
      {
        id: "breathing-3min",
        title: "Respiración 3 min",
        description: "Una pausa breve para calmar y reenfocar tu atención. Si es necesario puedes tomar más tiempo de respiración",
      },
    ],
    []
  );

  const active = resources.find((r) => r.id === resourceId) ?? resources[0];
  return (
    <section className="min-h-screen w-full bg-[#F7F4EF]">
      <main className="mx-auto w-full max-w-[560px] px-5 pt-12 pb-12">
        <h1 className="text-center font-semibold leading-tight text-5xl text-[#1E2430]">
          Este recurso puede acompañarte ahora.
        </h1>

        <div className="mt-10">
          <button
            type="button"
            onClick={() => setResourceId(active.id)}
            className="w-full rounded-2xl border border-[#D6DEE6] bg-white px-6 py-6 text-left transition"
          >
            <p className="text-[#15181B] font-semibold text-2xl">
              {active.title}
            </p>
            <p className="mt-2 text-[#5B6168] text-xl leading-relaxed">
              {active.description}
            </p>
          </button>
        </div>
        <div className="mt-10">
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem("navTarget", "10");
              window.location.href = "?pantalla=10";
            }}
            className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
          >
            Activar recurso
          </button>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem("navTarget", "11");
              window.location.href = "?pantalla=11";
            }}
            className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
          >
            Finalizar
          </button>
        </div>
      </main>
    </section>
  );
}

export default Pantalla9;
