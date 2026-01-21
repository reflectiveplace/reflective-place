import { useEffect, useMemo, useState } from "react";

type DetectedValue = {
  name: string;
  description: string;
  intensity: number; 
};

function clamp01to100(n: number) {
  if (Number.isNaN(n)) return 1;
  return Math.max(1, Math.min(100, Math.round(n)));
}

function IntensityBlocks({ value }: { value: number }) {
  const intensity = clamp01to100(value);
  const totalBlocks = 10;
  const filled = Math.round((intensity / 100) * totalBlocks);

  return (
    <div className="mt-3 flex items-center gap-1.5">
      {Array.from({ length: totalBlocks }).map((_, i) => {
        const isOn = i < filled;
        return (
          <div
            key={i}
            className={[
              "h-4 w-7 rounded-[3px]",
              isOn ? "bg-[#214A6A]" : "bg-[#E8EEF2]",
            ].join(" ")}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

function Pantalla4() {
  const [valuesDetected, setValuesDetected] = useState<DetectedValue[]>([]);

  useEffect(() => {
    const state = (window.history.state && window.history.state.usr) || null;
    const ls = localStorage.getItem("valuesDetected");

    let parsed: DetectedValue[] | null = null;

    if (state?.valuesDetected && Array.isArray(state.valuesDetected)) {
      parsed = state.valuesDetected;
    } else if (ls) {
      try {
        const temp = JSON.parse(ls);
        if (Array.isArray(temp)) parsed = temp;
      } catch {
        parsed = null;
      }
    }

    const fallback: DetectedValue[] = [
      { name: "Autenticidad", description: "Quieres ser fiel a ti mismo", intensity: 72 },
      { name: "Logro", description: "Aspiras al éxito", intensity: 45 },
      { name: "Aceptación", description: "Deseas sentirte incluido", intensity: 61 },
    ];

    const finalValues = (parsed && parsed.length ? parsed : fallback)
      .slice(0, 3)
      .map((v) => ({
        name: String(v.name ?? "").trim() || "Valor",
        description: String(v.description ?? "").trim() || "Descripción breve",
        intensity: clamp01to100(Number(v.intensity)),
      }));

    setValuesDetected(finalValues);

    localStorage.setItem("valuesDetected", JSON.stringify(finalValues));
  }, []);

  const cards = useMemo(() => valuesDetected.slice(0, 3), [valuesDetected]);

  return (
    <section className="min-h-screen w-full bg-[#F7F4EF]">
      <main className="mx-auto w-full max-w-[520px] px-5 pt-10 pb-12">
        <h1 className="text-[#2B2F33] font-semibold leading-tight text-5xl">
          Valores presentes
          <br />
          en tu decisión
        </h1>

        <p className="mt-6 text-[#4A4F55] text-2xl leading-relaxed">
          Estos valores reflejan lo que te importa en esta situación.
        </p>
        <div className="mt-8 space-y-5">
          {cards.map((v, idx) => (
            <article
              key={`${v.name}-${idx}`}
              className="rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]"
            >
              <p className="text-[#15181B] font-semibold text-3xl">
                {v.name}
              </p>

              <p className="mt-2 text-[#2B2F33] text-2xl leading-snug">
                {v.description}
              </p>

              <p className="mt-4 text-[#2B2F33] text-2xl">
                Intensidad: {clamp01to100(v.intensity)}/100
              </p>

              <IntensityBlocks value={v.intensity} />
            </article>
          ))}
        </div>
        <p className="mt-8 text-[#4A4F55] text-2xl leading-relaxed">
          Lo que aparece aquí es una señal de lo que te importa.
        </p>
        <div className="mt-10">
          <a
            href="?pantalla=5"
            onClick={() => sessionStorage.setItem('navTarget', '5')}
            className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
          >
            Continuar
          </a>
        </div>
      </main>
    </section>
  );
}

export default Pantalla4;
