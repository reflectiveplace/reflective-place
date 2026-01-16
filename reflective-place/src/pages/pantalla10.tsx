import { useEffect, useState } from "react";

function Pantalla10() {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(180);

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft !== 0) return;
    setIsRunning(false);
    sessionStorage.setItem("navTarget", "11");
    window.location.href = "?pantalla=11";
  }, [secondsLeft]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const startExercise = () => {
    setSecondsLeft(180);
    setIsRunning(true);
  };

  const finishEarly = () => {
    setIsRunning(false);
    sessionStorage.setItem("navTarget", "11");
    window.location.href = "?pantalla=11";
  };

  return (
    <section className="min-h-screen w-full bg-[#F7F4EF]">
      <main className="mx-auto w-full max-w-[560px] px-5 pt-12 pb-12">
        <h1 className="text-center font-semibold leading-tight text-5xl text-[#1E2430]">
          Instrucciones paso a paso del recurso.
        </h1>

        <div className="mt-10 space-y-4">
          <div className="rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5">
            <p className="text-[#5B6168] text-2xl leading-relaxed">
              1. Busca un lugar comodo y si puedes cierra los ojos.
            </p>
          </div>
          <div className="rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5">
            <p className="text-[#5B6168] text-2xl leading-relaxed">
              2. Inhala lentamente por la nariz contando hasta cuatro.
            </p>
          </div>
          <div className="rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5">
            <p className="text-[#5B6168] text-2xl leading-relaxed">
              3. Exhala por la boca contando hasta seis.
            </p>
          </div>
          <div className="rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5">
            <p className="text-[#5B6168] text-2xl leading-relaxed">
              4. Repite este ciclo varias veces con calma.
            </p>
          </div>
        </div>

        {isRunning ? (
          <div className="mt-10">
            <div className="rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5 text-center">
              <p className="text-[#1E2430] font-semibold text-4xl">
                {minutes}:{seconds}
              </p>
              <p className="mt-2 text-[#5B6168] text-xl">
                Cuenta regresiva de 3 min
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={finishEarly}
                className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
              >
                Continuar
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <button
              type="button"
              onClick={startExercise}
              className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
            >
              Iniciar ejercicio
            </button>
          </div>
        )}
      </main>
    </section>
  );
}

export default Pantalla10;
