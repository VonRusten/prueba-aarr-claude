import { useState } from 'react'
import { usePlatformStore } from '../../store/usePlatformStore'
import { gatesParaRelease } from '../../domain/gates'
import { ESTADOS_RELEASE } from '../../domain/constants'

const CLASE_ESTADO = {
  draft: 'p-gris',
  in_validation: 'p-ambar',
  blocked: 'p-rojo',
  conditionally_approved: 'p-ambar',
  approved: 'p-verde',
  deployed: 'p-verde',
  rolled_back: 'p-rojo',
  retired: 'p-gris',
}

// Release governance (doc 03 §13): la aprobación valida los gates G0–G9 en el
// momento de la decisión y registra aprobador y condiciones.
export default function ReleasesTab({ sistema }) {
  const crearRelease = usePlatformStore((st) => st.crearRelease)
  const decidirRelease = usePlatformStore((st) => st.decidirRelease)
  const desplegarRelease = usePlatformStore((st) => st.desplegarRelease)
  const revertirRelease = usePlatformStore((st) => st.revertirRelease)
  const [version, setVersion] = useState('1.0.0')
  const [notas, setNotas] = useState('')
  const [aprobador, setAprobador] = useState('')
  const [condiciones, setCondiciones] = useState('')
  const [mensaje, setMensaje] = useState(null)

  const { superados, bloqueados, pendientes } = gatesParaRelease(sistema)

  return (
    <div className="grid-2">
      <section className="tarjeta">
        <h3>Estado de gates para release</h3>
        <p>
          <span className="pildora p-verde">{superados.length} superados</span>{' '}
          <span className="pildora p-ambar">{pendientes.length} pendientes</span>{' '}
          <span className="pildora p-rojo">{bloqueados.length} bloqueados</span>
        </p>
        {bloqueados.length > 0 && (
          <div className="alerta alerta-roja">
            Gates bloqueados: {bloqueados.map((g) => g.id).join(', ')}. La release quedará <strong>bloqueada</strong> hasta
            completar las evidencias (no se permite el despliegue no conforme).
          </div>
        )}
        {bloqueados.length === 0 && pendientes.length > 0 && (
          <div className="alerta alerta-ambar">
            Gates sin aprobación humana: {pendientes.map((g) => g.id).join(', ')}. Solo cabe una aprobación
            <strong> condicionada</strong> con condiciones explícitas y trazables.
          </div>
        )}
        {bloqueados.length === 0 && pendientes.length === 0 && (
          <div className="alerta alerta-verde">Todos los gates superados: la release puede aprobarse.</div>
        )}

        <h3 className="mt">Nueva release</h3>
        <label>Versión<input value={version} onChange={(e) => setVersion(e.target.value)} /></label>
        <label>Notas (funcionalidades, cambios)<textarea rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} /></label>
        <button className="btn btn-primary" disabled={!version.trim()} onClick={() => { crearRelease(sistema.id, version.trim(), notas); setNotas('') }}>
          Crear release en borrador
        </button>
      </section>

      <section className="tarjeta">
        <h3>Releases ({sistema.releases.length})</h3>
        {sistema.releases.length === 0 && <p className="muted">Sin releases. Crea una cuando el desarrollo esté listo para validación.</p>}
        {sistema.releases.slice().reverse().map((r) => (
          <article key={r.id} className="item">
            <div className="item-cabecera">
              <strong>v{r.version}</strong>
              <span className={`pildora ${CLASE_ESTADO[r.estado]}`}>{ESTADOS_RELEASE[r.estado]}</span>
            </div>
            {r.notas && <p className="small">{r.notas}</p>}
            <ul className="lista-historial small">
              {r.historial.map((h, i) => (
                <li key={i}>{new Date(h.fecha).toLocaleString('es-ES')} — {h.evento}</li>
              ))}
            </ul>
            {['draft', 'in_validation', 'blocked'].includes(r.estado) && (
              <div className="subform">
                <div className="grid-2">
                  <label>Aprobador<input value={aprobador} onChange={(e) => setAprobador(e.target.value)} placeholder="Release Approver" /></label>
                  <label>Condiciones (si aprobación condicionada)<input value={condiciones} onChange={(e) => setCondiciones(e.target.value)} /></label>
                </div>
                <button
                  className="btn btn-primary"
                  disabled={!aprobador.trim()}
                  onClick={() => {
                    const res = decidirRelease(sistema.id, r.id, aprobador.trim(), condiciones.trim())
                    setMensaje(res.evento)
                  }}
                >
                  Solicitar decisión de release
                </button>
              </div>
            )}
            {['approved', 'conditionally_approved'].includes(r.estado) && (
              <button className="btn btn-primary" onClick={() => desplegarRelease(sistema.id, r.id)}>
                Desplegar (despliegue controlado)
              </button>
            )}
            {r.estado === 'deployed' && (
              <button className="btn" onClick={() => revertirRelease(sistema.id, r.id, 'Rollback manual a versión segura')}>
                Rollback
              </button>
            )}
          </article>
        ))}
        {mensaje && <div className="alerta alerta-ambar">{mensaje}</div>}
      </section>
    </div>
  )
}
