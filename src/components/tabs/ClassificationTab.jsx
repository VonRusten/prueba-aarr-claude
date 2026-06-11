import { useState } from 'react'
import { usePlatformStore } from '../../store/usePlatformStore'
import {
  NIVELES_AUTONOMIA,
  NIVELES_RIESGO,
  PRACTICAS_PROHIBIDAS,
  ROLES_REGULATORIOS,
  SECTORES_ANEXO_III,
  TIPOS_MODELO,
  TRIGGERS_TRANSPARENCIA,
} from '../../domain/constants'

// Motor de clasificación regulatoria: muestra el resultado vigente y permite
// corregir los inputs del intake y reejecutar el árbol de decisión.
export default function ClassificationTab({ sistema }) {
  const actualizarIntake = usePlatformStore((st) => st.actualizarIntake)
  const reclasificar = usePlatformStore((st) => st.reclasificar)
  const i = sistema.intake || {}
  const [form, setForm] = useState({
    autonomia: i.autonomia || 'asistencia',
    rol: i.rol || 'proveedor',
    datosPersonales: !!i.datosPersonales,
    tiposModelo: i.tiposModelo || [],
    sectores: i.sectores || [],
    transparencia: { ...(i.transparencia || {}) },
    screening: { ...(i.screening || {}) },
  })
  const cls = sistema.clasificacion
  const nivel = NIVELES_RIESGO[cls?.nivel]

  const toggleLista = (campo, id) =>
    setForm((f) => ({ ...f, [campo]: f[campo].includes(id) ? f[campo].filter((x) => x !== id) : [...f[campo], id] }))
  const toggleMapa = (campo, id) =>
    setForm((f) => ({ ...f, [campo]: { ...f[campo], [id]: !f[campo][id] } }))

  function guardarYReclasificar() {
    actualizarIntake(sistema.id, { ...form, screeningCompleto: true })
    reclasificar(sistema.id)
  }

  return (
    <div className="grid-2">
      <section className="tarjeta">
        <h3>Resultado vigente del motor</h3>
        {cls ? (
          <>
            <p><span className={`pildora p-${nivel.color}`}>{nivel.label}</span></p>
            <p className="muted small">Motor v{cls.versionMotor} · {new Date(cls.fecha).toLocaleString('es-ES')} · {cls.obligaciones.length} obligaciones activadas</p>
            <h4>Motivación (árbol de decisión)</h4>
            <ul>{cls.motivos.map((m, idx) => <li key={idx}>{m}</li>)}</ul>
            {cls.requiereRevisionHumana && (
              <div className="alerta alerta-ambar">
                Este caso cumple las reglas de escalado humano de la capa de agentes: la clasificación no debe
                considerarse definitiva sin revisión experta (legal / privacidad / riesgo).
              </div>
            )}
          </>
        ) : (
          <p className="muted">Sin clasificación. Completa los inputs y ejecuta el motor.</p>
        )}
      </section>

      <section className="tarjeta">
        <h3>Inputs del árbol de decisión</h3>
        <label>Nivel de autonomía
          <select value={form.autonomia} onChange={(e) => setForm({ ...form, autonomia: e.target.value })}>
            {NIVELES_AUTONOMIA.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </label>
        <label>Rol regulatorio
          <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
            {ROLES_REGULATORIOS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </label>
        <label className="check">
          <input type="checkbox" checked={form.datosPersonales} onChange={() => setForm({ ...form, datosPersonales: !form.datosPersonales })} />
          Trata datos personales
        </label>

        <h4>Modelos previstos</h4>
        {TIPOS_MODELO.map((o) => (
          <label key={o.id} className="check">
            <input type="checkbox" checked={form.tiposModelo.includes(o.id)} onChange={() => toggleLista('tiposModelo', o.id)} />
            {o.label}
          </label>
        ))}

        <h4>Ámbitos Anexo III (alto riesgo)</h4>
        {SECTORES_ANEXO_III.map((o) => (
          <label key={o.id} className="check">
            <input type="checkbox" checked={form.sectores.includes(o.id)} onChange={() => toggleLista('sectores', o.id)} />
            {o.label}
          </label>
        ))}

        <h4>Transparencia (Art. 50)</h4>
        {TRIGGERS_TRANSPARENCIA.map((o) => (
          <label key={o.id} className="check">
            <input type="checkbox" checked={!!form.transparencia[o.id]} onChange={() => toggleMapa('transparencia', o.id)} />
            {o.label}
          </label>
        ))}

        <h4>Screening de prácticas prohibidas (Art. 5)</h4>
        {PRACTICAS_PROHIBIDAS.map((o) => (
          <label key={o.id} className="check check-rojo">
            <input type="checkbox" checked={!!form.screening[o.id]} onChange={() => toggleMapa('screening', o.id)} />
            {o.label}
          </label>
        ))}

        <button className="btn btn-primary mt" onClick={guardarYReclasificar}>Guardar inputs y reejecutar clasificación</button>
      </section>
    </div>
  )
}
