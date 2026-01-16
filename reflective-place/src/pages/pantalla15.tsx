import { useEffect, useMemo, useState } from "react";

type UserType = "coach" | "terapeuta" | "individual";
type ReportType = "resumen" | "detallado" | "breve";

function Pantalla15() {
  const [userType, setUserType] = useState<UserType>("individual");
  const [reportType, setReportType] = useState<ReportType | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_type");
    if (storedUser === "coach" || storedUser === "terapeuta" || storedUser === "individual") {
      setUserType(storedUser);
    }

    const storedReport = localStorage.getItem("reportType");
    if (storedReport === "resumen" || storedReport === "detallado" || storedReport === "breve") {
      setReportType(storedReport);
    }
  }, []);

  useEffect(() => {
    if (reportType) localStorage.setItem("reportType", reportType);
  }, [reportType]);

  const options = useMemo(() => {
    if (userType === "coach") {
      return [
        { key: "resumen" as const, label: "Resumen ejecutivo" },
        { key: "detallado" as const, label: "Detallado con notas" },
      ];
    }
    if (userType === "terapeuta") {
      return [
        { key: "detallado" as const, label: "Detallado clinico" },
        { key: "resumen" as const, label: "Resumen terapeutico" },
      ];
    }
    return [
      { key: "breve" as const, label: "Breve y claro" },
      { key: "resumen" as const, label: "Resumen personal" },
    ];
  }, [userType]);

  return (
    <section className="min-h-screen w-full bg-[#F7F4EF]">
      <main className="mx-auto w-full max-w-[560px] px-5 pt-12 pb-12">
        <h1 className="text-center font-semibold leading-tight text-5xl text-[#1E2430]">
          Elige el tipo de salida segun tu rol.
        </h1>

        <div className="mt-10 space-y-4">
          {options.map((op) => {
            const active = reportType === op.key;
            return (
              <button
                key={op.key}
                type="button"
                onClick={() => setReportType(op.key)}
                className={[
                  "w-full rounded-2xl border bg-white px-6 py-5 text-left transition",
                  active
                    ? "border-[#2F3F7A] shadow-[0_18px_40px_rgba(16,24,40,0.12)]"
                    : "border-[#D6DEE6]",
                ].join(" ")}
              >
                <p className="text-[#15181B] font-semibold text-2xl">
                  {op.label}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          <a
            href="?pantalla=16"
            onClick={() => sessionStorage.setItem("navTarget", "16")}
            className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
          >
            Continuar
          </a>
        </div>
      </main>
    </section>
  );
}

export default Pantalla15;
