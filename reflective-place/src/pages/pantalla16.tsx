import { useMemo, useState, useEffect } from "react";
import jsPDF from "jspdf";
import { aiService, type ReportData } from "../services/aiService";

function Pantalla16() {
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const reportData = useMemo<ReportData>(() => {
    const data: ReportData = {};

    // Rol (pantalla 2b)
    const rol = localStorage.getItem("rol");
    if (rol) data.rol = rol;

    // Texto inicial (pantalla 2)
    const texto = localStorage.getItem("texto");
    if (texto) data.texto = texto;

    // Tipo de clasificación (pantalla 3)
    const urlParams = new URLSearchParams(window.location.search);
    const tipo = urlParams.get("tipo");
    if (tipo) data.tipo = tipo;

    // Valores detectados (pantalla 4)
    const valuesDetected = localStorage.getItem("valuesDetected");
    if (valuesDetected) {
      try {
        data.valuesDetected = JSON.parse(valuesDetected);
      } catch {
        // Ignorar errores de parsing
      }
    }

    // Valor dominante (pantalla 5)
    const dominantValue = localStorage.getItem("dominantValue");
    if (dominantValue) {
      try {
        data.dominantValue = JSON.parse(dominantValue);
      } catch {
        // Ignorar errores de parsing
      }
    }

    // Tipo de valor (pantalla 5)
    const valueType = localStorage.getItem("valueType");
    if (valueType) data.valueType = valueType;

    // Creencias (pantalla 6b, 7)
    const beliefs = localStorage.getItem("beliefs");
    if (beliefs) {
      try {
        data.beliefs = JSON.parse(beliefs);
      } catch {
        // Ignorar errores de parsing
      }
    }

    // Microhábito (pantalla 11)
    const microhabit = localStorage.getItem("microhabit");
    if (microhabit) data.microhabit = microhabit;

    // Evidencia (pantalla 12)
    const evidence = localStorage.getItem("evidence");
    if (evidence) data.evidence = evidence;

    // Tipo de reporte (pantalla 15)
    const reportType = localStorage.getItem("reportType");
    if (reportType) data.reportType = reportType;

    // Tipo de usuario (pantalla 15)
    const userType = localStorage.getItem("user_type");
    if (userType) data.userType = userType;

    // Modo de acción (pantalla 8b)
    const actionMode = localStorage.getItem("actionMode");
    if (actionMode) data.actionMode = actionMode;

    // Recurso (pantalla 9)
    const resourceId = localStorage.getItem("resourceId");
    if (resourceId) data.resourceId = resourceId;

    // Resonancia (pantalla 7b)
    const resonance = localStorage.getItem("resonance");
    if (resonance) data.resonance = resonance;

    return data;
  }, []);

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const result = await aiService.generateSummary(reportData);
      if (result.error) {
        console.error('Error generando resumen:', result.error);
        setAiSummary('Error al generar el resumen. Por favor, intenta de nuevo.');
      } else {
        setAiSummary(result.content);
        // Guardar el resumen en localStorage para incluirlo en el reporte
        localStorage.setItem('aiSummary', result.content);
      }
    } catch (error) {
      console.error('Error generando resumen:', error);
      setAiSummary('Error al generar el resumen. Por favor, intenta de nuevo.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Generar resumen automáticamente al cargar la pantalla con los datos actuales
  useEffect(() => {
    let isMounted = true;

    const generateOnLoad = async () => {
      if (isGeneratingSummary) return;
      
      setIsGeneratingSummary(true);
      try {
        const result = await aiService.generateSummary(reportData);
        if (!isMounted) return;
        
        if (result.error) {
          console.error('Error generando resumen:', result.error);
          setAiSummary('Error al generar el resumen. Por favor, intenta de nuevo.');
        } else {
          setAiSummary(result.content);
          localStorage.setItem('aiSummary', result.content);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error generando resumen:', error);
        setAiSummary('Error al generar el resumen. Por favor, intenta de nuevo.');
      } finally {
        if (isMounted) {
          setIsGeneratingSummary(false);
        }
      }
    };

    generateOnLoad();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar el componente

  const generateHTMLContent = (): string => {
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

    let html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte - Reflective Place</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #1E2430;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #F7F4EF;
    }
    h1 {
      color: #1E2430;
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    h2 {
      color: #2F3F7A;
      font-size: 1.8em;
      margin-top: 30px;
      margin-bottom: 15px;
      border-bottom: 2px solid #2F3F7A;
      padding-bottom: 10px;
    }
    h3 {
      color: #2A2F39;
      font-size: 1.3em;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .section {
      background: white;
      padding: 25px;
      margin-bottom: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .value-card {
      background: #F7F4EF;
      padding: 15px;
      margin: 10px 0;
      border-radius: 8px;
      border-left: 4px solid #2F3F7A;
    }
    .intensity {
      font-weight: bold;
      color: #214A6A;
    }
    .label {
      font-weight: bold;
      color: #2F3F7A;
    }
    .text-content {
      background: #F7F4EF;
      padding: 15px;
      border-radius: 8px;
      margin: 10px 0;
      white-space: pre-wrap;
    }
    .belief-item {
      padding: 10px;
      margin: 5px 0;
      border-radius: 6px;
    }
    .belief-empoderadora {
      background: #E3F2FD;
      border-left: 4px solid #2196F3;
    }
    .belief-limitante {
      background: #FFEBEE;
      border-left: 4px solid #F44336;
    }
    .metadata {
      font-size: 0.9em;
      color: #5B6168;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #D6DEE6;
    }
  </style>
</head>
<body>
  <h1>Reporte de Reflexión</h1>
  <p class="metadata">Generado el ${new Date().toLocaleString("es-ES")}</p>`;

    if (reportData.texto) {
      const textoEscapado = reportData.texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      html += `
  <div class="section">
    <h2>Exploración Inicial</h2>
    <div class="text-content">${textoEscapado}</div>`;

      if (reportData.tipo) {
        html += `
    <p><span class="label">Clasificación:</span> ${tipoLabels[reportData.tipo] || reportData.tipo}</p>`;
      }
      html += `</div>`;
    }

    if (reportData.valuesDetected && reportData.valuesDetected.length > 0) {
      html += `
  <div class="section">
    <h2>Valores Detectados</h2>`;
      reportData.valuesDetected.forEach((value) => {
        const nameEscapado = value.name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        const descEscapado = value.description.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        html += `
    <div class="value-card">
      <h3>${nameEscapado}</h3>
      <p>${descEscapado}</p>
      <p class="intensity">Intensidad: ${value.intensity}/100</p>
    </div>`;
      });
      html += `</div>`;
    }

    if (reportData.dominantValue) {
      const nameEscapado = reportData.dominantValue.name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      html += `
  <div class="section">
    <h2>Valor Dominante</h2>
    <h3>${nameEscapado}</h3>`;
      if (reportData.valueType) {
        html += `
    <p><span class="label">Tipo:</span> ${valueTypeLabels[reportData.valueType] || reportData.valueType}</p>`;
      }
      html += `</div>`;
    }

    if (reportData.beliefs && Object.keys(reportData.beliefs).length > 0) {
      html += `
  <div class="section">
    <h2>Creencias Identificadas</h2>`;
      Object.entries(reportData.beliefs).forEach(([valor, creencia]) => {
        const isEmpoderadora = creencia === "EMPODERADORA";
        const valorEscapado = valor.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        html += `
    <div class="belief-item ${isEmpoderadora ? "belief-empoderadora" : "belief-limitante"}">
      <strong>${valorEscapado}:</strong> ${isEmpoderadora ? "Creencia Empoderadora" : "Creencia Limitante"}
    </div>`;
      });
      html += `</div>`;
    }

    if (reportData.microhabit) {
      html += `
  <div class="section">
    <h2>Microhábito</h2>
    <div class="text-content">${reportData.microhabit}</div>
  </div>`;
    }

    if (reportData.evidence) {
      html += `
  <div class="section">
    <h2>Evidencia Observable</h2>
    <div class="text-content">${reportData.evidence}</div>
  </div>`;
    }

    if (reportData.actionMode) {
      html += `
  <div class="section">
    <h2>Acción Propuesta</h2>
    <p><span class="label">Modo:</span> ${actionModeLabels[reportData.actionMode] || reportData.actionMode}</p>
  </div>`;
    }

    if (reportData.resonance) {
      const resonanceEscapado = reportData.resonance.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      html += `
  <div class="section">
    <h2>Resonancia</h2>
    <p>${resonanceEscapado}</p>
  </div>`;
    }

    // Resumen generado por IA
    const savedSummary = localStorage.getItem('aiSummary');
    if (savedSummary) {
      const summaryEscapado = savedSummary.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      html += `
  <div class="section">
    <h2>Resumen Reflexivo</h2>
    <div class="text-content">${summaryEscapado}</div>
  </div>`;
    }

    html += `
</body>
</html>`;

    return html;
  };

  const handleExportHTML = () => {
    const htmlContent = generateHTMLContent();
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reporte-reflexion-${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

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

    const addNewPageIfNeeded = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // Título
    doc.setFontSize(20);
    doc.setTextColor(30, 36, 48);
    doc.text("Reporte de Reflexión", margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setTextColor(91, 97, 104);
    doc.text(`Generado el ${new Date().toLocaleString("es-ES")}`, margin, yPosition);
    yPosition += 20;

    // Rol
    if (reportData.rol) {
      addNewPageIfNeeded(20);
      doc.setFontSize(16);
      doc.setTextColor(47, 63, 122);
      doc.text("Rol", margin, yPosition);
      yPosition += 15;

      doc.setFontSize(11);
      doc.setTextColor(30, 36, 48);
      doc.text(reportData.rol, margin, yPosition);
      yPosition += 15;
    }

    // Exploración inicial
    if (reportData.texto) {
      addNewPageIfNeeded(30);
      doc.setFontSize(16);
      doc.setTextColor(47, 63, 122);
      doc.text("Exploración Inicial", margin, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setTextColor(30, 36, 48);
      const textoLines = doc.splitTextToSize(reportData.texto, pageWidth - 2 * margin);
      textoLines.forEach((line: string) => {
        addNewPageIfNeeded(10);
        doc.text(line, margin, yPosition);
        yPosition += 7;
      });

      if (reportData.tipo) {
        yPosition += 5;
        addNewPageIfNeeded(10);
        doc.setFontSize(10);
        doc.setTextColor(47, 63, 122);
        doc.text(`Clasificación: ${tipoLabels[reportData.tipo] || reportData.tipo}`, margin, yPosition);
        yPosition += 10;
      }
      yPosition += 10;
    }

    // Valores detectados
    if (reportData.valuesDetected && reportData.valuesDetected.length > 0) {
      addNewPageIfNeeded(30);
      doc.setFontSize(16);
      doc.setTextColor(47, 63, 122);
      doc.text("Valores Detectados", margin, yPosition);
      yPosition += 15;

      reportData.valuesDetected.forEach((value) => {
        addNewPageIfNeeded(25);
        doc.setFontSize(12);
        doc.setTextColor(30, 36, 48);
        doc.setFont("helvetica", "bold");
        doc.text(value.name, margin, yPosition);
        yPosition += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const descLines = doc.splitTextToSize(value.description, pageWidth - 2 * margin);
        descLines.forEach((line: string) => {
          addNewPageIfNeeded(7);
          doc.text(line, margin, yPosition);
          yPosition += 6;
        });

        doc.setFontSize(10);
        doc.setTextColor(33, 74, 106);
        doc.setFont("helvetica", "bold");
        doc.text(`Intensidad: ${value.intensity}/100`, margin, yPosition);
        yPosition += 12;
      });
    }

    // Valor dominante
    if (reportData.dominantValue) {
      addNewPageIfNeeded(30);
      doc.setFontSize(16);
      doc.setTextColor(47, 63, 122);
      doc.text("Valor Dominante", margin, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      doc.setTextColor(30, 36, 48);
      doc.setFont("helvetica", "bold");
      doc.text(reportData.dominantValue.name, margin, yPosition);
      yPosition += 10;

      if (reportData.valueType) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(47, 63, 122);
        doc.text(`Tipo: ${valueTypeLabels[reportData.valueType] || reportData.valueType}`, margin, yPosition);
        yPosition += 10;
      }
      yPosition += 10;
    }

    // Creencias
    if (reportData.beliefs && Object.keys(reportData.beliefs).length > 0) {
      addNewPageIfNeeded(30);
      doc.setFontSize(16);
      doc.setTextColor(47, 63, 122);
      doc.text("Creencias Identificadas", margin, yPosition);
      yPosition += 15;

      Object.entries(reportData.beliefs).forEach(([valor, creencia]) => {
        addNewPageIfNeeded(15);
        doc.setFontSize(10);
        doc.setTextColor(30, 36, 48);
        const isEmpoderadora = creencia === "EMPODERADORA";
        if (isEmpoderadora) {
          doc.setTextColor(33, 150, 243);
        } else {
          doc.setTextColor(244, 67, 54);
        }
        doc.text(`${valor}: ${isEmpoderadora ? "Creencia Empoderadora" : "Creencia Limitante"}`, margin, yPosition);
        yPosition += 8;
      });
      yPosition += 5;
    }

    // Microhábito
    if (reportData.microhabit) {
      addNewPageIfNeeded(30);
      doc.setFontSize(16);
      doc.setTextColor(47, 63, 122);
      doc.text("Microhábito", margin, yPosition);
      yPosition += 15;

      doc.setFontSize(11);
      doc.setTextColor(30, 36, 48);
      const habitLines = doc.splitTextToSize(reportData.microhabit, pageWidth - 2 * margin);
      habitLines.forEach((line: string) => {
        addNewPageIfNeeded(7);
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });
      yPosition += 10;
    }

    // Evidencia
    if (reportData.evidence) {
      addNewPageIfNeeded(30);
      doc.setFontSize(16);
      doc.setTextColor(47, 63, 122);
      doc.text("Evidencia Observable", margin, yPosition);
      yPosition += 15;

      doc.setFontSize(11);
      doc.setTextColor(30, 36, 48);
      const evidenceLines = doc.splitTextToSize(reportData.evidence, pageWidth - 2 * margin);
      evidenceLines.forEach((line: string) => {
        addNewPageIfNeeded(7);
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });
      yPosition += 10;
    }

    // Acción
    if (reportData.actionMode) {
      addNewPageIfNeeded(20);
      doc.setFontSize(16);
      doc.setTextColor(47, 63, 122);
      doc.text("Acción Propuesta", margin, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      doc.setTextColor(47, 63, 122);
      doc.text(`Modo: ${actionModeLabels[reportData.actionMode] || reportData.actionMode}`, margin, yPosition);
      yPosition += 10;
    }

    // Resonancia
    if (reportData.resonance) {
      addNewPageIfNeeded(20);
      doc.setFontSize(16);
      doc.setTextColor(47, 63, 122);
      doc.text("Resonancia", margin, yPosition);
      yPosition += 15;

      doc.setFontSize(11);
      doc.setTextColor(30, 36, 48);
      const resonanceLines = doc.splitTextToSize(reportData.resonance, pageWidth - 2 * margin);
      resonanceLines.forEach((line: string) => {
        addNewPageIfNeeded(7);
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });
      yPosition += 10;
    }

    // Resumen generado por IA
    const savedSummary = localStorage.getItem('aiSummary');
    if (savedSummary) {
      addNewPageIfNeeded(30);
      doc.setFontSize(16);
      doc.setTextColor(47, 63, 122);
      doc.text("Resumen Reflexivo", margin, yPosition);
      yPosition += 15;

      doc.setFontSize(11);
      doc.setTextColor(30, 36, 48);
      const summaryLines = doc.splitTextToSize(savedSummary, pageWidth - 2 * margin);
      summaryLines.forEach((line: string) => {
        addNewPageIfNeeded(7);
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });
    }

    doc.save(`reporte-reflexion-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <section className="min-h-screen w-full bg-[#F7F4EF]">
      <main className="mx-auto w-full max-w-[560px] px-5 pt-12 pb-12">
        <h1 className="text-center font-semibold leading-tight text-5xl text-[#1E2430]">
          Exportar el reporte.
        </h1>

        {/* Resumen generado por IA */}
        {aiSummary && (
          <div className="mt-10 rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <h2 className="text-[#2F3F7A] font-semibold text-3xl mb-4">Resumen Reflexivo</h2>
            <p className="text-[#1E2430] text-xl leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
          </div>
        )}

        {/* Mostrar estado de carga o botón para regenerar */}
        {isGeneratingSummary && !aiSummary && (
          <div className="mt-10 rounded-2xl border border-[#D6DEE6] bg-white px-6 py-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-8 border-4 border-[#2F3F7A] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#1E2430] text-xl">Generando resumen...</p>
            </div>
          </div>
        )}

        {/* Botón para regenerar resumen si ya existe uno */}
        {aiSummary && !isGeneratingSummary && (
          <div className="mt-10">
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#4A90E2] to-[#357ABD] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99] hover:from-[#5BA0F2] hover:to-[#458ACD] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔄 Regenerar Resumen
            </button>
          </div>
        )}

        <div className="mt-10 space-y-4">
          <button
            type="button"
            onClick={handleExportPDF}
            className="inline-flex w-full items-center justify-center rounded-2xl px-7 py-5 text-white font-medium text-2xl transition bg-gradient-to-b from-[#2F3F7A] to-[#1E2C63] shadow-[0_18px_40px_rgba(16,24,40,0.22)] active:scale-[0.99]"
          >
            Exportar PDF
          </button>
          <button
            type="button"
            onClick={handleExportHTML}
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
