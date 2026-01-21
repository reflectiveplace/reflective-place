import { useState } from "react";

interface SummaryData {
  rol?: string;
  texto?: string;
  tipo?: string;
  valuesDetected?: Array<{ name: string; description: string; intensity: number }>;
  dominantValue?: { name: string };
  valueType?: string;
  microhabit?: string;
  evidence?: string;
  actionMode?: string;
  resonance?: string;
}

function Pantalla13() {
  const [summaryData] = useState<SummaryData>(() => {
    const data: SummaryData = {};

    // Rol
    const rol = localStorage.getItem("rol");
    if (rol) data.rol = rol;

    // Texto inicial
    const texto = localStorage.getItem("texto");
    if (texto) data.texto = texto;

    // Tipo de clasificación
    const urlParams = new URLSearchParams(window.location.search);
    const tipo = urlParams.get("tipo");
    if (tipo) data.tipo = tipo;

    // Valores detectados
    const valuesDetected = localStorage.getItem("valuesDetected");
    if (valuesDetected) {
      try {
        data.valuesDetected = JSON.parse(valuesDetected);
      } catch {
        // Ignorar errores de parsing
      }
    }

    // Valor dominante
    const dominantValue = localStorage.getItem("dominantValue");
    if (dominantValue) {
      try {
        data.dominantValue = JSON.parse(dominantValue);
      } catch {
        // Ignorar errores de parsing
      }
    }

    // Tipo de valor
    const valueType = localStorage.getItem("valueType");
    if (valueType) data.valueType = valueType;

    // Microhábito
    const microhabit = localStorage.getItem("microhabit");
    if (microhabit) data.microhabit = microhabit;

    // Evidencia
    const evidence = localStorage.getItem("evidence");
    if (evidence) data.evidence = evidence;

    // Modo de acción
    const actionMode = localStorage.getItem("actionMode");
    if (actionMode) data.actionMode = actionMode;

    // Resonancia
    const resonance = localStorage.getItem("resonance");
    if (resonance) data.resonance = resonance;

    return data;
  });

  const tipoLabels: Record<string, string> = {
    decision: "Decisión",
    "suposición": "Suposición",
    "presuposición": "Presuposición",
  };

  const valueTypeLabels: Record<string, string> = {
    ENDO: "Intrínseco (ENDO)",
    EXI: "Extrínseco Intangible (EXI)",
    EXT: "Extrínseco Tangible (EXT)",
  };

  const actionModeLabels: Record<string, string> = {
    FORT: "Fortalecer",
    REF: "Reformular",
    CUEST: "Cuestionar",
  };

  return (
    <section className="min-h-screen w-full bg-[#F7F4EF]">
      <main className="mx-auto w-full max-w-[560px] px-5 pt-12 pb-12">
        <h1 className="text-center font-semibold leading-tight text-5xl text-[#1E2430]">
          Resumen final del recorrido.
        </h1>

        <div className="mt-10 space-y-6">
          {/* Rol */}
          {summaryData.rol && (
            <div className="rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <h2 className="text-[#2F3F7A] font-semibold text-2xl mb-3">Rol</h2>
              <p className="text-[#2A2F39] text-xl">{summaryData.rol}</p>
            </div>
          )}
          {/* Exploración inicial */}
          {summaryData.texto && (
            <div className="rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <h2 className="text-[#2F3F7A] font-semibold text-2xl mb-3">Exploración Inicial</h2>
              <p className="text-[#2A2F39] text-xl leading-relaxed whitespace-pre-wrap">{summaryData.texto}</p>
              {summaryData.tipo && (
                <p className="mt-3 text-[#5B6168] text-lg">
                  <span className="font-semibold">Clasificación:</span> {tipoLabels[summaryData.tipo] || summaryData.tipo}
                </p>
              )}
            </div>
          )}

          {/* Valores detectados */}
          {summaryData.valuesDetected && summaryData.valuesDetected.length > 0 && (
            <div className="rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <h2 className="text-[#2F3F7A] font-semibold text-2xl mb-4">Valores Detectados</h2>
              <div className="space-y-4">
                {summaryData.valuesDetected.map((value, idx) => (
                  <div key={idx} className="border-l-4 border-[#2F3F7A] pl-4">
                    <h3 className="text-[#15181B] font-semibold text-xl">{value.name}</h3>
                    <p className="text-[#2A2F39] text-lg mt-1">{value.description}</p>
                    <p className="text-[#214A6A] font-semibold text-lg mt-2">Intensidad: {value.intensity}/100</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Valor dominante */}
          {summaryData.dominantValue && (
            <div className="rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <h2 className="text-[#2F3F7A] font-semibold text-2xl mb-3">Valor Dominante</h2>
              <h3 className="text-[#15181B] font-semibold text-xl">{summaryData.dominantValue.name}</h3>
              {summaryData.valueType && (
                <p className="mt-2 text-[#5B6168] text-lg">
                  <span className="font-semibold">Tipo:</span> {valueTypeLabels[summaryData.valueType] || summaryData.valueType}
                </p>
              )}
            </div>
          )}

          {/* Microhábito */}
          {summaryData.microhabit && (
            <div className="rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <h2 className="text-[#2F3F7A] font-semibold text-2xl mb-3">Microhábito</h2>
              <p className="text-[#2A2F39] text-xl leading-relaxed whitespace-pre-wrap">{summaryData.microhabit}</p>
            </div>
          )}

          {/* Evidencia */}
          {summaryData.evidence && (
            <div className="rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <h2 className="text-[#2F3F7A] font-semibold text-2xl mb-3">Evidencia Observable</h2>
              <p className="text-[#2A2F39] text-xl leading-relaxed whitespace-pre-wrap">{summaryData.evidence}</p>
            </div>
          )}

          {/* Acción propuesta */}
          {summaryData.actionMode && (
            <div className="rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <h2 className="text-[#2F3F7A] font-semibold text-2xl mb-3">Acción Propuesta</h2>
              <p className="text-[#2A2F39] text-xl">
                <span className="font-semibold">Modo:</span> {actionModeLabels[summaryData.actionMode] || summaryData.actionMode}
              </p>
            </div>
          )}

          {/* Resonancia */}
          {summaryData.resonance && (
            <div className="rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <h2 className="text-[#2F3F7A] font-semibold text-2xl mb-3">Resonancia</h2>
              <p className="text-[#2A2F39] text-xl">{summaryData.resonance}</p>
            </div>
          )}
        </div>

        <div className="mt-10">
          <a
            href="?pantalla=14"
            onClick={() => sessionStorage.setItem("navTarget", "14")}
            className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
          >
            Continuar
          </a>
        </div>
      </main>
    </section>
  );
}

export default Pantalla13;
