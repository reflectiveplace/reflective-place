import { useState } from 'react'

function Pantalla2() {
  const [texto, setTexto] = useState('')
  const puedeContinuar = texto.trim().length > 0

  return (
    <section>
      <main className="min-h-screen bg-[#F7F4EF] flex flex-col items-center px-7 pt-20 pb-12">
        <h1 className="text-[#1E2430] font-medium text-center leading-tight text-5xl">
          ¿Qué deseas
          <br />
          explorar hoy?
        </h1>
        <div className="mt-12 w-full">
          <textarea
            className="w-full min-h-[210px] rounded-2xl border-2 border-[#C7CED6] bg-transparent px-6 py-6
                       text-2xl text-[#2A2F39] placeholder:text-[#7B8694]
                       focus:outline-none focus:ring-0"
            placeholder={"Escribe aquí tu decisión,\nsuposición o situación..."}
            value={texto}
            onChange={(event) => setTexto(event.target.value)}
          />
        </div>
        <p className="mt-10 text-[#2A2F39] text-2xl text-center">
          Gracias por darte este espacio.
        </p>
          <a
            href={puedeContinuar ? "?pantalla=3" : undefined}
            onClick={() => sessionStorage.setItem('navTarget', '3')}
            className={[
              "mt-auto w-full inline-flex items-center justify-center rounded-2xl px-7 py-5",
              "text-white font-medium text-2xl transition",
              "bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63]",
              "shadow-[0_18px_40px_rgba(16,24,40,0.22)]",
              puedeContinuar ? "active:scale-[0.99]" : "opacity-50 pointer-events-none",
            ].join(" ")}
          >
            Continuar
          </a>
      </main>
    </section>
  );
}

export default Pantalla2;
