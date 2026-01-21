function Pantalla1() {
  return (
    <section className="w-full bg-[#F7F4EF]">
      <div className="min-h-screen flex items-center justify-center px-6 py-10">
        <main className="w-full max-w-[520px] text-center">
          <h1 className="text-[#1E2430] font-medium leading-tight text-5xl">
            Bienvenido a
            <br />
            Reflective Place.
          </h1>

          <div className="mt-10 space-y-10">
            <p className="text-[#1E2430] text-2xl leading-relaxed">
              Este es tu espacio para ver con calma lo que sucede dentro de ti.
            </p>

            <p className="text-[#2A2F39] text-2xl leading-relaxed">
              Tendrás la oportunidad de reflexionar sobre tus pensamientos,
              emociones y valores. Adelante a tu propio ritmo, con amabilidad y
              curiosidad.
            </p>

            <p className="text-[#2A2F39] text-2xl leading-relaxed">
              Tómate un momento para llegar aquí.
            </p>
          </div>

          <a
            href="?pantalla=2"
            onClick={() => sessionStorage.setItem('navTarget', '2')}
            className="mt-14 w-full inline-flex items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
          >
            Continuar
          </a>
        </main>
      </div>
    </section>
  );
}

export default Pantalla1;
