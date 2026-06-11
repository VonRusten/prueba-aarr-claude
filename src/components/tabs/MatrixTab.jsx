import { useState } from 'react'
import { usePlatformStore } from '../../store/usePlatformStore'
import { CATALOGO_OBLIGACIONES, ESTADOS_OBLIGACION, TIPOS_EVIDENCIA } from '../../domain/constants'

// Matriz requisito-control-evidencia (doc 03 §5): cada obligación activada por
// la clasificación se gestiona con estado, responsable y evidencias vinculadas.
export default function MatrixTab({ sistema }) {
  const actualizarObligacion = usePlatformStore((st) => st.actualizarObligacion)
  const agregarEvidencia = usePlatformStore((st) => st.agregarEvidencia)
  const eliminarEvidencia = usePlatformStore((st) => st.eliminarEvidencia)
  const [evidenciaPara, setEvidenciaPara] = useState(null)
  const [ev, setEv] = useState({ tipo: TIPOS_EVIDENCIA[0], titulo: '', descripcion: '', enlace: '' })

  const aplicables = (sistema.clasificacion?.obligaciones || [])
    .map((id) => CATALOGO_OBLIGACIONES.find((o) => o.id === id))
    .filter(Boolean)

  if (aplicables.length === 0) {
    return (
      <section className="tarjeta">
        <h3>Matriz requisito-control-evidencia</h3>
        <p className="muted">No hay obligaciones activadas. Ejecuta la clasificación regulatoria en la pestaña «Clasificación».</p>
      </section>
    )
  }

  const validadas = aplicables.filter((o) => ['Validado', 'No aplica'].includes(sistema.obligaciones?.[o.id]?.estado)).length

  return (
    <section className="tarjeta">
      <h3>Matriz requisito-control-evidencia</h3>
      <p className="muted small">
        {validadas} de {aplicables.length} obligaciones validadas o justificadas. Las obligaciones en «Pendiente» bloquean el Gate 7;
        todas deben quedar validadas o justificadas para el Gate 8.
      </p>
      {aplicables.map((o) => {
        const inst = sistema.obligaciones?.[o.id] || { estado: 'Pendiente' }
        const evidencias = sistema.evidencias.filter((e) => e.vinculo?.tipo === 'obligacion' && e.vinculo.refId === o.id)
        return (
          <article key={o.id} className="item obligacion">
            <div className="item-cabecera">
              <div>
                <strong>{o.id}</strong> <span className="pildora p-gris">{o.fuente}</span> <span className="pildora p-gris">Gate {o.gate.slice(1)}</span>
                <p>{o.obligacion}</p>
              </div>
              <select
                value={inst.estado}
                className={`estado-select estado-${inst.estado.replace(' ', '-')}`}
                onChange={(e) => actualizarObligacion(sistema.id, o.id, { estado: e.target.value })}
              >
                {ESTADOS_OBLIGACION.map((x) => <option key={x}>{x}</option>)}
              </select>
            </div>
            <div className="rce">
              <div><small className="muted">Requisito interno</small><p>{o.requisitoInterno}</p></div>
              <div><small className="muted">Control</small><p>{o.control}</p></div>
              <div><small className="muted">Evidencia esperada</small><p>{o.evidencia}</p></div>
            </div>
            <div className="grid-2">
              <label className="inline">Responsable
                <input
                  value={inst.responsable || ''}
                  onChange={(e) => actualizarObligacion(sistema.id, o.id, { responsable: e.target.value })}
                  placeholder="owner del control"
                />
              </label>
              {inst.estado === 'No aplica' && (
                <label className="inline">Justificación de no aplicabilidad
                  <input
                    value={inst.justificacionNA || ''}
                    onChange={(e) => actualizarObligacion(sistema.id, o.id, { justificacionNA: e.target.value })}
                    placeholder="obligatoria cuando se marca No aplica"
                  />
                </label>
              )}
            </div>
            <div className="evidencias">
              <small className="muted">Evidencias vinculadas ({evidencias.length}):</small>
              {evidencias.map((e) => (
                <span key={e.id} className="chip">
                  {e.tipo}: {e.titulo}
                  {e.enlace && <a href={e.enlace} target="_blank" rel="noreferrer"> ↗</a>}
                  <button onClick={() => eliminarEvidencia(sistema.id, e.id)}>×</button>
                </span>
              ))}
              <button className="btn btn-mini" onClick={() => { setEvidenciaPara(o.id); setEv({ tipo: TIPOS_EVIDENCIA[0], titulo: '', descripcion: '', enlace: '' }) }}>
                ＋ Vincular evidencia
              </button>
            </div>
            {evidenciaPara === o.id && (
              <div className="subform">
                <div className="grid-2">
                  <label>Tipo
                    <select value={ev.tipo} onChange={(e) => setEv({ ...ev, tipo: e.target.value })}>
                      {TIPOS_EVIDENCIA.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </label>
                  <label>Título<input value={ev.titulo} onChange={(e) => setEv({ ...ev, titulo: e.target.value })} /></label>
                </div>
                <label>Descripción<input value={ev.descripcion} onChange={(e) => setEv({ ...ev, descripcion: e.target.value })} /></label>
                <label>Enlace (commit, PR, documento, informe...)<input value={ev.enlace} onChange={(e) => setEv({ ...ev, enlace: e.target.value })} /></label>
                <div className="acciones">
                  <button
                    className="btn btn-primary"
                    disabled={!ev.titulo}
                    onClick={() => {
                      agregarEvidencia(sistema.id, { ...ev, vinculo: { tipo: 'obligacion', refId: o.id } })
                      setEvidenciaPara(null)
                    }}
                  >
                    Guardar evidencia
                  </button>
                  <button className="btn" onClick={() => setEvidenciaPara(null)}>Cancelar</button>
                </div>
              </div>
            )}
          </article>
        )
      })}
    </section>
  )
}
