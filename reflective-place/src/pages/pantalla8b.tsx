import { useEffect, useMemo, useState } from "react";

type ActionMode = "FORT" | "REF" | "CUEST";

function Pantalla8b() {
  const [actionMode, setActionMode] = useState<ActionMode | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("actionMode");
    if (stored === "FORT" || stored === "REF" || stored === "CUEST") {
      setActionMode(stored);
    }
  }, []);

  useEffect(() => {
    if (actionMode) localStorage.setItem("actionMode", actionMode);
  }, [actionMode]);

  const options = useMemo(
    () => [
      { key: "FORT" as const, title: "FORT", desc: "Fortalecer" },
      { key: "REF" as const, title: "REF", desc: "Reformular" },
      { key: "CUEST" as const, title: "CUEST", desc: "Cuestionar" },
    ],
    []
  );

  return (
    <section className="min-h-screen w-full bg-[#F7F4EF]">
      <main className="mx-auto w-full max-w-[560px] px-5 pt-12 pb-12">
        <h1 className="text-center font-semibold leading-tight text-5xl text-[#1E2430]">
          ¿Qué te gustaría hacer con este insight?
        </h1>

        <div className="mt-10 space-y-4">
          {options.map((op) => {
            const active = actionMode === op.key;
            return (
              <button
                key={op.key}
                type="button"
                onClick={() => setActionMode(op.key)}
                className={[
                  "w-full rounded-2xl border bg-white px-6 py-5 text-left transition",
                  active
                    ? "border-[#2F3F7A] shadow-[0_18px_40px_rgba(16,24,40,0.12)]"
                    : "border-[#D6DEE6]",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#15181B] font-semibold text-2xl">
                      {op.title}
                    </p>
                    <p className="mt-2 text-[#5B6168] text-xl">
                      {op.desc}
                    </p>
                  </div>
                  <span
                    className={[
                      "h-5 w-5 rounded-full border",
                      active ? "border-[#2F3F7A] bg-[#2F3F7A]" : "border-[#D6DEE6]",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-20">
          <a
            href={actionMode ? "?pantalla=9" : undefined}
            onClick={() => sessionStorage.setItem('navTarget', '9')}
            className={[
              "inline-flex w-full items-center justify-center rounded-2xl px-7 py-5",
              "text-white font-medium text-2xl transition",
              "bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63]",
              "shadow-[0_18px_40px_rgba(16,24,40,0.22)]",
              actionMode ? "active:scale-[0.99]" : "opacity-50 pointer-events-none",
            ].join(" ")}
          >
            Continuar
          </a>
        </div>
      </main>
    </section>
  );
}

export default Pantalla8b;
