import { useState } from "react";

type Clasificacion = "decision" | "suposicion" | "presuposicion";

function Pantalla3() {
  const [seleccion, setSeleccion] = useState<Clasificacion | null>(null);

  const opciones: Array<{
    key: Clasificacion;
    titulo: string;
    descripcion: string;
  }> = [
    {
      key: "decision",
      titulo: "Decisión",
      descripcion: "Algo que deseas decidir o elegir",
    },
    {
      key: "suposicion",
      titulo: "Suposición",
      descripcion: "Algo que crees que podría ser así",
    },
    {
      key: "presuposicion",
      titulo: "Presuposición",
      descripcion: "Algo que das por hecho",
    },
  ];

  return (
    <section className="min-h-screen w-full bg-[#F7F4EF] flex items-center justify-center px-6 py-10">
      <main className="w-full max-w-[560px] md:max-w-[980px]">
        <div className="text-center">
          <h1 className="text-[#1E2430] font-medium leading-tight text-5xl md:text-7xl">
            Clasifica tu texto
          </h1>

          <p className="mt-6 text-[#2A2F39] text-2xl md:text-3xl leading-relaxed md:leading-loose">
            Para acompañarte mejor, aclaremos desde dónde nace lo que escribiste.
          </p>
        </div>
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
          {opciones.map((op) => {
            const activa = seleccion === op.key;

            return (
              <label
                key={op.key}
                className={[
                  "group cursor-pointer rounded-3xl border transition",
                  "bg-white/65 backdrop-blur-sm",
                  "px-6 py-6 md:px-7 md:py-7",
                  activa
                    ? "border-[#2F3F7A] shadow-[0_18px_45px_rgba(16,24,40,0.18)]"
                    : "border-[#1E2430]/20 hover:border-[#1E2430]/35 hover:bg-white/75",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="clasificacion"
                  value={op.key}
                  checked={activa}
                  onChange={() => setSeleccion(op.key)}
                  className="sr-only"
                />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[#1E2430] font-medium text-3xl md:text-4xl">
                      {op.titulo}
                    </p>
                    <p className="mt-3 text-[#2A2F39] text-xl md:text-2xl leading-relaxed">
                      {op.descripcion}
                    </p>
                  </div>
                  <div
                    className={[
                      "mt-1 h-7 w-7 md:h-8 md:w-8 rounded-full border flex items-center justify-center",
                      activa ? "border-[#2F3F7A]" : "border-[#1E2430]/25",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    <div
                      className={[
                        "h-4 w-4 md:h-5 md:w-5 rounded-full transition",
                        activa ? "bg-[#2F3F7A]" : "bg-transparent",
                      ].join(" ")}
                    />
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        <div className="mt-12 md:mt-16 flex justify-center">
          <a
            href={seleccion ? `?pantalla=4&tipo=${seleccion}` : undefined}
            onClick={() => sessionStorage.setItem('navTarget', '4')}
            className={[
              "inline-flex w-full items-center justify-center rounded-2xl px-7 py-5",
              "text-white font-medium text-2xl transition",
              "bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63]",
              "shadow-[0_18px_40px_rgba(16,24,40,0.22)]",
              seleccion ? "active:scale-[0.99]" : "opacity-50 pointer-events-none",
              "md:w-auto",
            ].join(" ")}
          >
            Continuar
          </a>
        </div>
      </main>
    </section>
  );
}

export default Pantalla3;
