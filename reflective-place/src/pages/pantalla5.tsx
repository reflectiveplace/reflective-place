import { useEffect, useMemo, useState } from "react";

type ValueType = "ENDO" | "EXI" | "EXT";

type DominantValue = {
  name: string;
  description?: string;
  intensity?: number;
};

function Pantalla5() {
  const [dominantValue, setDominantValue] = useState<DominantValue | null>(null);
  const [valueType, setValueType] = useState<ValueType | null>(null);

  useEffect(() => {
    const state = (window.history.state && window.history.state.usr) || null;

    const lsDominant = localStorage.getItem("dominantValue");
    const lsValueType = localStorage.getItem("valueType");

    let dominant: DominantValue | null = null;

    if (state?.dominantValue) dominant = state.dominantValue;

    if (!dominant && lsDominant) {
      try {
        dominant = JSON.parse(lsDominant);
      } catch {
        dominant = null;
      }
    }

    if (!dominant) dominant = { name: "Autenticidad" };

    setDominantValue(dominant);

    if (lsValueType === "ENDO" || lsValueType === "EXI" || lsValueType === "EXT") {
      setValueType(lsValueType);
    }

    localStorage.setItem("dominantValue", JSON.stringify(dominant));
  }, []);

  useEffect(() => {
    if (valueType) localStorage.setItem("valueType", valueType);
  }, [valueType]);

  const options = useMemo(
    () => [
      {
        key: "ENDO" as const,
        title: "INTRÍNSECO (ENDO)",
        desc: "Nace de tu interior,\nde tu verdad íntima.",
      },
      {
        key: "EXI" as const,
        title: "EXTRÍNSECO INTANGIBLE (EXI)",
        desc: "Nace de expectativas o\nreconocimiento.",
      },
      {
        key: "EXT" as const,
        title: "EXTRÍNSECO TANGIBLE (EXT)",
        desc: "Nace de resultados o factores externos",
      },
    ],
    []
  );

  return (
    <section className="min-h-screen w-full bg-[#F7F4EF]">
      <main className="mx-auto w-full max-w-[520px] px-5 pt-10 pb-12">
        <h1 className="text-[#15181B] font-semibold leading-tight text-5xl">
          ¿Desde dónde nace
          <br />
          este valor?
        </h1>

        <p className="mt-6 text-[#5B6168] text-2xl leading-relaxed">
          Veamos desde dónde nace la energía de este valor.
        </p>

        {dominantValue?.name ? (
          <p className="mt-6 text-[#15181B]/70 text-xl">
            Valor dominante:{" "}
            <span className="font-semibold text-[#15181B]">{dominantValue.name}</span>
          </p>
        ) : null}

        <div className="mt-8 space-y-5">
          {options.map((op) => {
            const selected = valueType === op.key;

            return (
              <label
                key={op.key}
                className={[
                  "block cursor-pointer rounded-2xl border bg-white px-6 py-5 transition",
                  selected
                    ? "border-[#2F6FB2] shadow-[0_10px_22px_rgba(16,24,40,0.08)]"
                    : "border-[#D6DEE6]",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="valueType"
                  value={op.key}
                  checked={selected}
                  onChange={() => setValueType(op.key)}
                  className="sr-only"
                />

                <p className="text-[#15181B] font-semibold tracking-wide text-xl">
                  {op.title}
                </p>

                <div className="mt-3 flex items-start gap-3">
                  <div className="mt-2">
                    <div
                      className={[
                        "h-2.5 w-2.5 rounded-full",
                        selected ? "bg-[#2F6FB2]" : "bg-transparent",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                  </div>

                  <p className="text-[#5B6168] text-2xl leading-relaxed whitespace-pre-line">
                    {op.desc}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        <p className="mt-8 text-[#5B6168] text-2xl leading-relaxed">
          Este tipo refleja desde dónde se mueve tu motivación.
        </p>

        <div className="mt-10">
          <a
            href={valueType ? `?pantalla=6&valueType=${valueType}` : undefined}
            onClick={() => sessionStorage.setItem('navTarget', '6')}
            className={[
              "inline-flex w-full items-center justify-center rounded-2xl px-7 py-5",
              "text-white font-medium text-2xl transition",
              "bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63]",
              "shadow-[0_18px_40px_rgba(16,24,40,0.22)]",
              valueType ? "active:scale-[0.99]" : "opacity-50 pointer-events-none",
            ].join(" ")}
          >
            Continuar
          </a>
        </div>
      </main>
    </section>
  );
}

export default Pantalla5;
