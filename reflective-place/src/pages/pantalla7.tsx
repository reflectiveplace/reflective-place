import { useEffect, useMemo, useState } from "react";

type ValueType = "ENDO" | "EXI" | "EXT";
type BeliefChoice = "EMPODERADORA" | "LIMITANTE";

type DominantValue = {
  name: string;
};

type BeliefsMap = Record<string, BeliefChoice>;

function Pantalla7() {
  const [dominantValue, setDominantValue] = useState<DominantValue | null>(null);
  const [valueType, setValueType] = useState<ValueType | null>(null);
  const [beliefs, setBeliefs] = useState<BeliefsMap>({});
  const [currentValueKey, setCurrentValueKey] = useState<string>("Valor #1");

  useEffect(() => {

    const lsDominant = localStorage.getItem("dominantValue");
    if (lsDominant) {
      try {
        setDominantValue(JSON.parse(lsDominant));
      } catch {
        setDominantValue({ name: "Integridad" });
      }
    } else {
      setDominantValue({ name: "Integridad" });
    }

    const lsType = localStorage.getItem("valueType");
    if (lsType === "ENDO" || lsType === "EXI" || lsType === "EXT") {
      setValueType(lsType);
    } else {
      setValueType("ENDO");
    }

    const lsBeliefs = localStorage.getItem("beliefs");
    if (lsBeliefs) {
      try {
        const parsed = JSON.parse(lsBeliefs);
        if (parsed && typeof parsed === "object") setBeliefs(parsed);
      } catch {
        setBeliefs({});
      }
    }

    const lsIdx = localStorage.getItem("beliefIndex");
    if (lsIdx && !Number.isNaN(Number(lsIdx))) {
      const idx = Math.max(1, Math.min(7, Number(lsIdx)));
      setCurrentValueKey(`Valor #${idx}`);
    } else {
      setCurrentValueKey("Valor #1");
    }
  }, []);

  const beliefLabel = useMemo(() => {
    const choice = beliefs[currentValueKey];
    if (choice === "EMPODERADORA") return "Empoderadora";
    if (choice === "LIMITANTE") return "Limitante";
    return "Empoderadora";
  }, [beliefs, currentValueKey]);

  const phrase = useMemo(() => {

    const key = `beliefPhrase:${currentValueKey}:${beliefLabel.toUpperCase()}`;
    const saved = localStorage.getItem(key);
    return saved || "Valoro la honestidad y la transparencia.";
  }, [currentValueKey, beliefLabel]);

  const goNext = () => {
    const lsIdx = localStorage.getItem("beliefIndex");
    const current = lsIdx && !Number.isNaN(Number(lsIdx)) ? Number(lsIdx) : 1;
    const next = Math.min(7, current + 1);
    localStorage.setItem("beliefIndex", String(next));

    sessionStorage.setItem('navTarget', '7b');
    window.location.href = "?pantalla=7b";
  };

  return (
    <section className="min-h-screen w-full bg-[#F7F4EF]">
      <main className="mx-auto w-full max-w-[560px] px-5 pt-10 pb-12">
        <h1 className="text-center text-[#15181B] font-semibold leading-tight text-5xl">
          Síntesis del valor
          <br />
          trabajado
        </h1>
        <div className="mt-10 rounded-2xl bg-white border border-[#EEF2F6] shadow-[0_10px_26px_rgba(16,24,40,0.06)] px-6 py-6">
          <div className="space-y-4">
            <p className="text-[#15181B] text-2xl">
              <span className="font-semibold">Valor:</span>{" "}
              <span className="font-semibold">{dominantValue?.name ?? "Integridad"}</span>
            </p>

            <p className="text-[#15181B] text-2xl">
              <span className="font-semibold">Tipo:</span>{" "}
              <span className="font-semibold">{valueType ?? "ENDO"}</span>
            </p>

            <p className="text-[#15181B] text-2xl">
              <span className="font-semibold">Creencia elegida:</span>
              <br />
              <span className="font-semibold">{beliefLabel}</span>
            </p>

            <p className="text-[#15181B] text-2xl">
              <span className="font-semibold">Frase:</span>
              <br />
              <span className="text-[#15181B]">“{phrase}”</span>
            </p>
          </div>
          <div className="my-6 h-px w-full bg-[#E6EBF0]" />
          <p className="text-[#15181B] text-2xl leading-relaxed">
            Todo lo que reconoces,
            <br />
            comienza a transformarse.
          </p>
        </div>
        <div className="mt-10">
          <button
            onClick={goNext}
            className="
              w-full inline-flex items-center justify-center
              rounded-2xl px-7 py-5
              text-white font-medium text-2xl
              bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63]
              shadow-[0_18px_40px_rgba(16,24,40,0.22)]
              active:scale-[0.99] transition
            "
          >
            Siguiente valor
          </button>
        </div>
      </main>
    </section>
  );
}

export default Pantalla7;
