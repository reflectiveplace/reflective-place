import { useEffect, useMemo, useState } from "react";

type Choice = "EMPODERADORA" | "LIMITANTE";

type ValueRow = {
  valor: string; 
  empoderadora: string;
  limitante: string;
  microEmpoderadora?: string;
  microLimitante?: string;
};

function Pantalla6b() {
  const valuesMap: ValueRow[] = useMemo(
    () => [
      {
        valor: "Instrumentales",
        empoderadora: "Tengo herramientas para avanzar",
        limitante: "No tengo lo necesario",
        microEmpoderadora: "Me siento capaz y preparado",
        microLimitante: "Me siento desprovisto e incapaz",
      },
      {
        valor: "Cognoscitivos",
        empoderadora: "Puedo comprender y aprender",
        limitante: "No entiendo bien las cosas",
        microEmpoderadora: "Me siento claro y despierto",
        microLimitante: "Me siento confuso y perdido",
      },
      {
        valor: "Universales",
        empoderadora: "Esto trasciende y conecta",
        limitante: "Esto no aplica aquí",
        microEmpoderadora: "Me siento parte de algo mayor",
        microLimitante: "Me siento desconectado y aislado",
      },
      {
        valor: "Sociales",
        empoderadora: "Pertenezco y me conecto",
        limitante: "Estoy solo en esto",
        microEmpoderadora: "Me siento acompañado y visto",
        microLimitante: "Me siento excluido e invisible",
      },
      {
        valor: "Autodirigidos",
        empoderadora: "Me guío desde dentro",
        limitante: "Dependo de otros",
        microEmpoderadora: "Me siento autónomo y libre",
        microLimitante: "Me siento dependiente y atado",
      },
      {
        valor: "Orientadores/Directivos",
        empoderadora: "Sé hacia dónde voy",
        limitante: "No sé qué hacer",
        microEmpoderadora: "Me siento con dirección y propósito",
        microLimitante: "Me siento perdido y sin rumbo",
      },
      {
        valor: "Personales/Relacionales",
        empoderadora: "Me conozco y me relaciono",
        limitante: "No sé quién soy",
        microEmpoderadora: "Me siento íntegro y conectado",
        microLimitante: "Me siento fragmentado y desconectado",
      },
    ],
    []
  );

  const [idx, setIdx] = useState(0);

  const [beliefs, setBeliefs] = useState<Record<string, Choice>>({});

  useEffect(() => {
    const ls = localStorage.getItem("beliefs");
    if (!ls) return;
    try {
      const parsed = JSON.parse(ls);
      if (parsed && typeof parsed === "object") setBeliefs(parsed);
    } catch {
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("beliefs", JSON.stringify(beliefs));
  }, [beliefs]);

  const current = valuesMap[idx];
  const currentKey = current.valor;

  const selected = beliefs[currentKey] ?? null;

  const isLast = idx === valuesMap.length - 1;

  const goNext = () => {
    if (!selected) return;

    if (!isLast) {
      setIdx((v) => v + 1);
      return;
    }

    sessionStorage.setItem('navTarget', '7');
    window.location.href = "?pantalla=7";
  };

  const goBack = () => {
    if (idx > 0) setIdx((v) => v - 1);
    else window.history.back();
  };

  const choose = (c: Choice) => {
    setBeliefs((prev) => ({ ...prev, [currentKey]: c }));
  };

  return (
    <section className="min-h-screen w-full bg-[#F7F4EF]">
      <main className="mx-auto w-full max-w-[560px] px-5 pt-8 pb-12">
        <button
          onClick={goBack}
          className="inline-flex items-center justify-center rounded-full p-2 active:scale-[0.98] transition"
          aria-label="Volver"
        >
          <span className="text-3xl text-[#15181B]">←</span>
        </button>
        <h1 className="mt-4 text-[#15181B] font-semibold leading-tight text-5xl text-center">
          Explorando: {current.valor}
        </h1>
        <p className="mt-4 text-[#5B6168] text-2xl leading-relaxed text-center">
          Cuando este valor está presente, puede sostenerse desde distintas
          creencias.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-5">
          <label
            className={[
              "cursor-pointer rounded-2xl border bg-white px-4 py-5 text-center transition",
              selected === "EMPODERADORA"
                ? "border-[#2F6FB2] shadow-[0_12px_26px_rgba(16,24,40,0.10)]"
                : "border-[#D6DEE6]",
            ].join(" ")}
          >
            <input
              type="radio"
              name="belief"
              className="sr-only"
              checked={selected === "EMPODERADORA"}
              onChange={() => choose("EMPODERADORA")}
            />
            <div className="flex items-start justify-center gap-3">
              <div
                className={[
                  "mt-1 h-4 w-4 rounded-full border-2 flex items-center justify-center",
                  selected === "EMPODERADORA"
                    ? "border-[#1E6FD9] bg-white"
                    : "border-[#1E6FD9]",
                ].join(" ")}
                aria-hidden="true"
              >
                {selected === "EMPODERADORA" && (
                  <div className="h-2 w-2 rounded-full bg-[#1E6FD9]" />
                )}
              </div>
              <p className="text-[#1E6FD9] font-semibold text-2xl leading-snug">
                Creencia
                <br />
                que te
                <br />
                impulsa
              </p>
            </div>
            <p className="mt-8 text-[#15181B] text-2xl">{current.empoderadora}</p>

            <p className="mt-6 text-[#5B6168] text-l leading-relaxed">
              {current.microEmpoderadora ?? "Microjustificación emocional"}
            </p>
          </label>
          <label
            className={[
              "cursor-pointer rounded-2xl border bg-white px-4 py-5 text-center transition",
              selected === "LIMITANTE"
                ? "border-[#2F6FB2] shadow-[0_12px_26px_rgba(16,24,40,0.10)]"
                : "border-[#D6DEE6]",
            ].join(" ")}
          >
            <input
              type="radio"
              name="belief"
              className="sr-only"
              checked={selected === "LIMITANTE"}
              onChange={() => choose("LIMITANTE")}
            />
            <div className="flex items-start justify-center gap-3">
              <div
                className={[
                  "mt-1 h-4 w-4 rounded-full border-2 flex items-center justify-center",
                  selected === "LIMITANTE"
                    ? "border-[#D6453A] bg-white"
                    : "border-[#D6453A]",
                ].join(" ")}
                aria-hidden="true"
              >
                {selected === "LIMITANTE" && (
                  <div className="h-2 w-2 rounded-full bg-[#D6453A]" />
                )}
              </div>
              <p className="text-[#D6453A] font-semibold text-2xl leading-snug">
                Creencia
                <br />
                que te
                <br />
                detiene
              </p>
            </div>
            <p className="mt-8 text-[#15181B] text-2xl">{current.limitante}</p>

            <p className="mt-6 text-[#5B6168] text-l leading-relaxed">
              {current.microLimitante ?? "Microjustificación emocional"}
            </p>
          </label>
        </div>
        <p className="mt-10 text-center text-[#2B2F33] text-2xl leading-relaxed">
          Reconoce la creencia que
          <br />
          hoy guía tu paso.
        </p>
        <div className="mt-10">
          <button
            onClick={goNext}
            disabled={!selected}
            className={[
              "w-full inline-flex items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition",
              "bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63]",
              "shadow-[0_18px_40px_rgba(16,24,40,0.22)]",
              selected ? "active:scale-[0.99]" : "opacity-50 cursor-not-allowed",
            ].join(" ")}
          >
            {isLast ? "Terminar" : "Siguiente valor"}
          </button>
        </div>
      </main>
    </section>
  );
}

export default Pantalla6b;
