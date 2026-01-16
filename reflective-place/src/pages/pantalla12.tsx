import { useEffect, useState } from "react";

function Pantalla12() {
  const [evidence, setEvidence] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("evidence");
    if (stored) setEvidence(stored);
  }, []);

  const handleContinue = () => {
    localStorage.setItem("evidence", evidence.trim());
    sessionStorage.setItem("navTarget", "13");
    window.location.href = "?pantalla=13";
  };

  return (
    <section className="min-h-screen w-full bg-[#F7F4EF]">
      <main className="mx-auto w-full max-w-[560px] px-5 pt-12 pb-12">
        <h1 className="text-center font-semibold leading-tight text-5xl text-[#1E2430]">
          ¿Cómo sabrás que esto ocurrió?
        </h1>

        <div className="mt-10">
          <textarea
            className="w-full min-h-[180px] rounded-2xl border border-[#D6DEE6] bg-white px-6 py-6 text-2xl text-[#15181B] placeholder:text-[#5B6168] focus:outline-none"
            placeholder="Describe una evidencia observable..."
            value={evidence}
            onChange={(event) => setEvidence(event.target.value)}
          />
        </div>

        <div className="mt-70">
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
          >
            Continuar
          </button>
        </div>
      </main>
    </section>
  );
}

export default Pantalla12;
