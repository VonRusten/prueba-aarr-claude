import { useMemo, useState } from 'react'
import { usePlatformStore } from '../../store/usePlatformStore'
import { generarExpedienteTecnico, descargarMarkdown } from '../../domain/docGenerator'

// Generador del expediente técnico vivo en Markdown (Art. 11 / Anexo IV).
export default function DocsTab({ sistema }) {
  const marcarDocGenerada = usePlatformStore((st) => st.marcarDocGenerada)
  const [contenido, setContenido] = useState(null)

  const gaps = useMemo(() => (contenido ? (contenido.match(/GAP DOCUMENTAL/g) || []).length : null), [contenido])

  function generar() {
    const md = generarExpedienteTecnico(sistema)
    setContenido(md)
    marcarDocGenerada(sistema.id)
  }

  function descargar() {
    const md = contenido || generarExpedienteTecnico(sistema)
    descargarMarkdown(`expediente_tecnico_${sistema.nombre.replace(/\s+/g, '_').toLowerCase()}_v${sistema.version}.md`, md)
  }

  return (
    <section className="tarjeta">
      <div className="item-cabecera">
        <div>
          <h3>Expediente técnico vivo</h3>
          <p className="muted small">
            {sistema.docGeneradaEn
              ? `Última generación: ${new Date(sistema.docGeneradaEn).toLocaleString('es-ES')}${sistema.docGeneradaEn < (sistema.contenidoActualizadoEn || sistema.updatedAt) ? ' · ⚠️ el expediente está desactualizado respecto del último cambio sustantivo (bloquea Gate 7)' : ''}`
              : 'Aún no se ha generado el expediente para este sistema.'}
          </p>
        </div>
        <span>
          <button className="btn btn-primary" onClick={generar}>Generar expediente</button>
          <button className="btn" onClick={descargar}>Descargar .md</button>
        </span>
      </div>
      {gaps !== null && (
        <div className={`alerta ${gaps > 0 ? 'alerta-ambar' : 'alerta-verde'}`}>
          {gaps > 0
            ? `El expediente contiene ${gaps} gap(s) documental(es). Toda ausencia de información figura explícitamente como gap; complétalos antes de la evaluación de conformidad.`
            : 'Expediente sin gaps documentales detectados.'}
        </div>
      )}
      {contenido && <pre className="markdown-preview">{contenido}</pre>}
      {!contenido && (
        <p className="muted">
          El expediente se genera automáticamente desde el registro del sistema: finalidad, clasificación, obligaciones,
          datasets, modelos, riesgos, gates, releases y auditoría. La documentación no se redacta al final: se compila
          desde las evidencias creadas durante el desarrollo.
        </p>
      )}
    </section>
  )
}
