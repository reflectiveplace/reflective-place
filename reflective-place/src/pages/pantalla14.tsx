function Pantalla14() {
  return (
    <section className="min-h-screen w-full bg-[#F7F4EF]">
      <main className="mx-auto w-full max-w-[560px] px-5 pt-12 pb-12">
        <h1 className="text-center font-semibold leading-tight text-6xl text-[#1E2430]">
          Gracias por darte este espacio.
        </h1>

        <div className="mt-110">
          <a
            href="?pantalla=15"
            onClick={() => sessionStorage.setItem("navTarget", "15")}
            className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
          >
            Continuar
          </a>
        </div>
      </main>
    </section>
  );
}

export default Pantalla14;
