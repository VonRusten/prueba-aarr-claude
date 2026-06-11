import { descargarMarkdown } from '../../domain/docGenerator'

// Compliance log: registro inmutable de decisiones, aprobaciones y cambios
// del expediente (doc 03 §9), exportable como Audit Pack.
export default function AuditTab({ sistema }) {
  const log = (sistema.auditLog || []).slice().reverse()

  function exportar() {
    const md = [
      `# Audit Pack — ${sistema.nombre} (v${sistema.version})`,
      '',
      `Exportado: ${new Date().toLocaleString('es-ES')}`,
      '',
      '| Fecha | Acción | Detalle |',
      '|---|---|---|',
      ...sistema.auditLog.map((l) => `| ${new Date(l.fecha).toLocaleString('es-ES')} | ${l.accion} | ${l.detalle} |`),
    ].join('\n')
    descargarMarkdown(`audit_pack_${sistema.nombre.replace(/\s+/g, '_').toLowerCase()}.md`, md)
  }

  return (
    <section className="tarjeta">
      <div className="item-cabecera">
        <h3>Registro de auditoría ({log.length} eventos)</h3>
        <button className="btn" onClick={exportar}>Exportar Audit Pack (.md)</button>
      </div>
      <table className="tabla">
        <thead>
          <tr><th>Fecha</th><th>Acción</th><th>Detalle</th></tr>
        </thead>
        <tbody>
          {log.map((l, i) => (
            <tr key={i}>
              <td><small>{new Date(l.fecha).toLocaleString('es-ES')}</small></td>
              <td><strong>{l.accion}</strong></td>
              <td>{l.detalle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
