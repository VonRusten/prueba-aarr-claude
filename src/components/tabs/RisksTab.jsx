import { useState } from 'react'
import { usePlatformStore } from '../../store/usePlatformStore'
import { CATEGORIAS_RIESGO, PROBABILIDADES, SEVERIDADES } from '../../domain/constants'

const riesgoVacio = {
  categoria: CATEGORIAS_RIESGO[0],
  descripcion: '',
  causa: '',
  consecuencia: '',
  afectados: '',
  severidad: 'Media',
  probabilidad: 'Media',
  controles: '',
  riesgoResidual: '',
  decision: '',
  responsable: '',
  estado: 'Abierto',
}

// Registro de riesgos (doc 03 §7): todo riesgo relevante debe tener control,
// propietario y decisión sobre riesgo residual. Los críticos abiertos bloquean G6.
export default function RisksTab({ sistema }) {
  const guardarRiesgo = usePlatformStore((st) => st.guardarRiesgo)
  const eliminarRiesgo = usePlatformStore((st) => st.eliminarRiesgo)
  const [form, setForm] = useState(null)

  return (
    <section className="tarjeta">
      <div className="item-cabecera">
        <h3>Registro de riesgos ({sistema.riesgos.length})</h3>
        {!form && <button className="btn" onClick={() => setForm({ ...riesgoVacio })}>＋ Nuevo riesgo</button>}
      </div>
      <p className="muted small">
        Riesgos críticos sin tratar bloquean el Gate 6; riesgos altos/críticos sin decisión de aceptación bloquean el Gate 8.
      </p>

      {sistema.riesgos.length > 0 && (
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th><th>Categoría</th><th>Descripción</th><th>Sev.</th><th>Prob.</th><th>Controles</th><th>Residual</th><th>Decisión</th><th>Estado</th><th></th>
            </tr>
          </thead>
          <tbody>
            {sistema.riesgos.map((r) => (
              <tr key={r.id} className={r.severidad === 'Crítica' && !['Mitigado', 'Cerrado'].includes(r.estado) ? 'fila-critica' : ''}>
                <td><small>{r.id}</small></td>
                <td>{r.categoria}</td>
                <td>{r.descripcion}</td>
                <td>{r.severidad}</td>
                <td>{r.probabilidad}</td>
                <td>{r.controles || '⚠️'}</td>
                <td>{r.riesgoResidual || '—'}</td>
                <td>{r.decision || '⚠️'}</td>
                <td>{r.estado}</td>
                <td>
                  <button className="btn btn-mini" onClick={() => setForm(r)}>Editar</button>
                  <button className="btn btn-mini" onClick={() => eliminarRiesgo(sistema.id, r.id)}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {form && (
        <div className="subform">
          <div className="grid-2">
            <label>Categoría
              <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                {CATEGORIAS_RIESGO.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>Estado
              <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                {['Abierto', 'Mitigado', 'Aceptado', 'Cerrado'].map((x) => <option key={x}>{x}</option>)}
              </select>
            </label>
          </div>
          <label>Descripción del riesgo<textarea rows={2} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></label>
          <div className="grid-2">
            <label>Causa<input value={form.causa} onChange={(e) => setForm({ ...form, causa: e.target.value })} /></label>
            <label>Consecuencia<input value={form.consecuencia} onChange={(e) => setForm({ ...form, consecuencia: e.target.value })} /></label>
            <label>Personas afectadas<input value={form.afectados} onChange={(e) => setForm({ ...form, afectados: e.target.value })} /></label>
            <label>Responsable (owner)<input value={form.responsable} onChange={(e) => setForm({ ...form, responsable: e.target.value })} /></label>
            <label>Severidad
              <select value={form.severidad} onChange={(e) => setForm({ ...form, severidad: e.target.value })}>
                {SEVERIDADES.map((x) => <option key={x}>{x}</option>)}
              </select>
            </label>
            <label>Probabilidad
              <select value={form.probabilidad} onChange={(e) => setForm({ ...form, probabilidad: e.target.value })}>
                {PROBABILIDADES.map((x) => <option key={x}>{x}</option>)}
              </select>
            </label>
          </div>
          <label>Controles (preventivos, detectivos, correctivos)<textarea rows={2} value={form.controles} onChange={(e) => setForm({ ...form, controles: e.target.value })} /></label>
          <div className="grid-2">
            <label>Riesgo residual
              <select value={form.riesgoResidual} onChange={(e) => setForm({ ...form, riesgoResidual: e.target.value })}>
                <option value="">— sin valorar —</option>
                {SEVERIDADES.map((x) => <option key={x}>{x}</option>)}
              </select>
            </label>
            <label>Decisión
              <select value={form.decision} onChange={(e) => setForm({ ...form, decision: e.target.value })}>
                <option value="">— sin decidir —</option>
                {['Aceptar', 'Mitigar', 'Transferir', 'Evitar'].map((x) => <option key={x}>{x}</option>)}
              </select>
            </label>
          </div>
          <div className="acciones">
            <button className="btn btn-primary" disabled={!form.descripcion} onClick={() => { guardarRiesgo(sistema.id, form); setForm(null) }}>
              Guardar riesgo
            </button>
            <button className="btn" onClick={() => setForm(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </section>
  )
}
