function Pantalla16() {
  const handleExport = (format: "pdf" | "html") => {
    const blob = new Blob([`Reporte exportado (${format.toUpperCase()})`], {
      type: "text/plain;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `reporte.${format === "pdf" ? "txt" : "txt"}`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="min-h-screen w-full bg-[#F7F4EF]">
      <main className="mx-auto w-full max-w-[560px] px-5 pt-12 pb-12">
        <h1 className="text-center font-semibold leading-tight text-5xl text-[#1E2430]">
          Exportar el reporte.
        </h1>

        <div className="mt-10 space-y-4">
          <button
            type="button"
            onClick={() => handleExport("pdf")}
            className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
          >
            Exportar PDF
          </button>
          <button
            type="button"
            onClick={() => handleExport("html")}
            className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
          >
            Exportar HTML
          </button>
        </div>

        <div className="mt-4">
          <a
            href="?pantalla=1"
            onClick={() => sessionStorage.setItem("navTarget", "1")}
            className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
          >
            Finalizar
          </a>
        </div>
      </main>
    </section>
  )
}

export default Pantalla16
