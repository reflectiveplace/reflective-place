import { useEffect, useMemo, useState } from "react";

type ValueType = "ENDO" | "EXI" | "EXT";
type BeliefChoice = "EMPODERADORA" | "LIMITANTE";

type Row = {
  valor: string;
  tipo: ValueType | string;
  creencia: string;
  dot: "blue" | "red";
};

const VALUE_FAMILIES = [
  "Instrumentales",
  "Cognoscitivos",
  "Universales",
  "Sociales",
  "Autodirigidos",
  "Orientadores/Directivos",
  "Personales/Relacionales",
] as const;

function Pantalla7b() {
  const [dominantValue, setDominantValue] = useState<string>("Integridad");
  const [resonance, setResonance] = useState<string>("Convicción");
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const dv = localStorage.getItem("dominantValue");
    if (dv) {
      try {
        const parsed = JSON.parse(dv);
        if (parsed?.name) setDominantValue(parsed.name);
      } catch {
      }
    }

    const rs = localStorage.getItem("resonance");
    if (rs) setResonance(rs);

    const fallback: Row[] = [
      {
        valor: "Responsabilidad",
        tipo: "ENDO",
        dot: "red",
        creencia: "Tengo que hacerlo perfecto",
      },
      {
        valor: "Creatividad",
        tipo: "ENDO",
        dot: "blue",
        creencia: "Expreso mi imaginación",
      },
      {
        valor: "Seguridad",
        tipo: "ENDO",
        dot: "red",
        creencia: "El mundo es un lugar peligroso",
      },
      {
        valor: "Integridad",
        tipo: "ENDO",
        dot: "blue",
        creencia: "Valoro la honestidad y la transparencia",
      },
      {
        valor: "Conexión",
        tipo: "ENDO",
        dot: "blue",
        creencia: "Las relaciones son importantes en mi vida",
      },
      {
        valor: "Aprendizaje",
        tipo: "ENDO",
        dot: "red",
        creencia: "No soy bueno entendiendo las cosas",
      },
      {
        valor: "Autoestima",
        tipo: "ENDO",
        dot: "red",
        creencia: "Los demás valen más que yo",
      },
    ];

    const lsBeliefs = localStorage.getItem("beliefs");
    const lsType = localStorage.getItem("valueType");
    let mapped: Row[] | null = null;

    try {
      if (lsBeliefs) {
        const beliefs: Record<string, BeliefChoice> = JSON.parse(lsBeliefs);
        // Buscar las familias de valores que tienen creencias asociadas
        const familiesWithBeliefs = VALUE_FAMILIES.filter(family => beliefs[family] !== undefined);
        if (familiesWithBeliefs.length) {
          mapped = familiesWithBeliefs.map((family) => {
            const choice = beliefs[family];
            return {
              valor: family,
              tipo: (lsType === "ENDO" || lsType === "EXI" || lsType === "EXT") ? lsType : "ENDO",
              dot: choice === "EMPODERADORA" ? "blue" : "red",
              creencia: choice === "EMPODERADORA" ? "Creencia empoderadora" : "Creencia limitante",
            };
          });
        }
      }
    } catch {
      mapped = null;
    }

    setRows(mapped ?? fallback);
  }, []);

  const summaryText = useMemo(() => {
    return `Lo que aparece es un valor de ${dominantValue} sostenido desde ${resonance}.`;
  }, [dominantValue, resonance]);

  return (
    <section className="min-h-screen w-full bg-[#F7F4EF]">
      <main className="mx-auto w-full max-w-[560px] px-5 pt-10 pb-12">
        <h1 className="text-center text-[#15181B] font-semibold leading-tight text-5xl">
          Resumen de tu Mapa
          <br />
          de Valores
        </h1>
        <p className="mt-6 text-center text-[#5B6168] text-2xl leading-relaxed">
          Así se movieron tus valores en esta decisión.
        </p>
        <div className="mt-8 border-t border-[#E6EBF0]">
          <div className="grid grid-cols-[1.2fr_0.6fr_1.4fr] gap-3 py-4 border-b border-[#E6EBF0] text-[#2B2F33] font-medium">
            <div className="text-center text-xl">Valor</div>
            <div className="text-center text-xl">Tipo</div>
            <div className="text-center text-xl">Creencia</div>
          </div>
          <div className="divide-y divide-[#E6EBF0]">
            {rows.slice(0, 7).map((r, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[1.2fr_0.6fr_1.4fr] gap-3 py-4 items-center"
              >
                <div className="text-[#15181B] text-xl">{r.valor}</div>

                <div className="text-[#15181B] text-xl text-center">{r.tipo}</div>

                <div className="flex items-start gap-3">
                  <span
                    className={[
                      "mt-2 h-3 w-3 rounded-full",
                      r.dot === "blue" ? "bg-[#2E79F0]" : "bg-[#E24B3B]",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  <span className="text-[#15181B] text-xl leading-snug">
                    {r.creencia}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-8 text-center text-[#2B2F33] text-2xl leading-relaxed">
          {summaryText}
        </p>
        <div className="mt-10">
          <a
            href="?pantalla=8"
            onClick={() => sessionStorage.setItem('navTarget', '8')}
            className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
          >
            Continuar
          </a>
        </div>
      </main>
    </section>
  );
}

export default Pantalla7b;
