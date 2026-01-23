function Pantalla6() {
  const rows = [
    { valor: "Instrumentales", empoderadora: "Tengo herramientas para avanzar", limitante: "No tengo lo necesario" },
    { valor: "Cognoscitivos", empoderadora: "Puedo comprender y aprender", limitante: "No entiendo bien las cosas" },
    { valor: "Universales", empoderadora: "Esto trasciende y conecta", limitante: "Esto no aplica aquí" },
    { valor: "Sociales", empoderadora: "Pertenezco y me conecto", limitante: "Estoy solo en esto" },
    { valor: "Autodirigidos", empoderadora: "Me guío desde dentro", limitante: "Dependo de otros" },
    { valor: "Orientadores/Directivos", empoderadora: "Sé hacia dónde voy", limitante: "No sé qué hacer" },
    { valor: "Personales/Relacionales", empoderadora: "Me conozco y me relaciono", limitante: "No sé quién soy" },
  ];

  return (
    <section className="min-h-screen w-full bg-[#F7F4EF]">
      <main className="mx-auto w-full max-w-[560px] px-5 pt-10 pb-12">
        <h1 className="text-[#15181B] font-semibold leading-tight text-5xl text-center">
          Tu Mapa Interno
          <br />
          de Valores y Creencias
        </h1>
        <p className="mt-6 text-[#5B6168] text-2xl leading-relaxed text-center">
          Antes de explorar cada valor,
          <br />
          observa el paisaje completo.
        </p>
        <div className="mt-8 rounded-xl border border-[#D6DEE6] overflow-hidden bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F4F7FA]">
                <th className="w-[28%] border-r border-[#D6DEE6] px-3 py-3 text-left text-sm font-semibold tracking-wide text-[#2B2F33]">
                  VALOR
                </th>
                <th className="w-[36%] border-r border-[#D6DEE6] px-3 py-3 text-left text-sm font-semibold tracking-wide text-[#2B2F33]">
                  CREENCIA
                  <br />
                  EMPODERADORA
                </th>
                <th className="w-[36%] px-3 py-3 text-left text-sm font-semibold tracking-wide text-[#2B2F33]">
                  CREENCIA
                  <br />
                  LIMITANTE
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx} className="bg-white">
                  <td className="border-t border-r border-[#D6DEE6] px-3 py-4 text-xl font-semibold text-[#15181B]">
                    {r.valor}
                  </td>
                  <td className="border-t border-r border-[#D6DEE6] px-3 py-4 text-xl text-[#2B2F33]">
                    {r.empoderadora}
                  </td>
                  <td className="border-t border-[#D6DEE6] px-3 py-4 text-xl text-[#2B2F33]">
                    {r.limitante}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8 text-center italic text-[#2B2F33] text-2xl leading-relaxed">
          Mira la arboleda completa…
          <br />
          ahí comienza tu claridad.
        </p>
        <div className="mt-10">
          <a
            href="?pantalla=6b"
            onClick={() => sessionStorage.setItem('navTarget', '6b')}
            className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
          >
            Explorar cada valor
          </a>
        </div>
      </main>
    </section>
  );
}

export default Pantalla6;
