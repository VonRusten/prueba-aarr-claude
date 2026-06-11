import { useState } from 'react'
import { usePlatformStore } from '../../store/usePlatformStore'

// Registro de finalidad prevista (Intended Purpose Statement), versionado
// para poder detectar modificaciones sustanciales (Gate 10).
export default function PurposeTab({ sistema }) {
  const actualizarFinalidad = usePlatformStore((st) => st.actualizarFinalidad)
  const f = sistema.finalidad || {}
  const [form, setForm] = useState({
    declaracion: f.declaracion || '',
    decisionesAsistidas: f.decisionesAsistidas || '',
    outputsEsperados: f.outputsEsperados || '',
    usosExcluidos: f.usosExcluidos || '',
  })

  const cambiaDeclaracion = form.declaracion !== (f.declaracion || '')

  return (
    <div className="grid-2">
      <section className="tarjeta">
        <h3>Intended Purpose Statement (v{f.version || 0})</h3>
        <p className="muted small">
          La finalidad prevista determina la clasificación, las obligaciones y los límites de uso. Cambiarla sobre un
          sistema desplegado activa la evaluación de modificación sustancial (Gate 10).
        </p>
        <label>Finalidad prevista
          <textarea rows={4} value={form.declaracion} onChange={(e) => setForm({ ...form, declaracion: e.target.value })} />
        </label>
        <label>Decisiones asistidas
          <textarea rows={2} value={form.decisionesAsistidas} onChange={(e) => setForm({ ...form, decisionesAsistidas: e.target.value })} />
        </label>
        <label>Outputs esperados
          <textarea rows={2} value={form.outputsEsperados} onChange={(e) => setForm({ ...form, outputsEsperados: e.target.value })} />
        </label>
        <label>Usos expresamente excluidos
          <textarea rows={2} value={form.usosExcluidos} onChange={(e) => setForm({ ...form, usosExcluidos: e.target.value })} />
        </label>
        {cambiaDeclaracion && (
          <div className="alerta alerta-ambar">
            Vas a modificar la declaración de finalidad: se creará la versión {(f.version || 0) + 1}. Si el sistema está
            desplegado, quedará marcado «cambio pendiente de evaluación» y bloqueará el Gate 10.
          </div>
        )}
        <button className="btn btn-primary" onClick={() => actualizarFinalidad(sistema.id, form)}>Guardar finalidad</button>
      </section>

      <section className="tarjeta">
        <h3>Historial de versiones de la finalidad</h3>
        {(f.historial || []).length === 0 && <p className="muted">Sin versiones registradas.</p>}
        <ul className="lista-historial">
          {(f.historial || []).slice().reverse().map((h) => (
            <li key={h.version}>
              <strong>v{h.version}</strong> · {new Date(h.fecha).toLocaleString('es-ES')}
              <p>{h.declaracion}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
