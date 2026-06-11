import { useState } from 'react'
import { usePlatformStore } from '../../store/usePlatformStore'
import { TIPOS_MODELO } from '../../domain/constants'

// Registro de datos (dataset cards) y modelos (model cards).
// Reglas de la capa de agentes: no se permite usar fuentes sin ficha ni
// integrar modelos sin model card — estos registros alimentan el Gate 3.
export default function DataModelsTab({ sistema }) {
  return (
    <div className="grid-2">
      <Datasets sistema={sistema} />
      <Modelos sistema={sistema} />
    </div>
  )
}

const datasetVacio = { nombre: '', origen: '', tipologia: '', datosPersonales: false, categoriasEspeciales: false, evaluacionPrivacidad: '', calidad: '', linaje: '', responsable: '' }

function Datasets({ sistema }) {
  const guardarDataset = usePlatformStore((st) => st.guardarDataset)
  const eliminarDataset = usePlatformStore((st) => st.eliminarDataset)
  const [form, setForm] = useState(null)

  return (
    <section className="tarjeta">
      <h3>Dataset cards ({sistema.datasets.length})</h3>
      <p className="muted small">Toda fuente usada por el sistema debe tener ficha con origen documentado y linaje mínimo (Art. 10).</p>
      {sistema.datasets.map((d) => (
        <article key={d.id} className="item">
          <div className="item-cabecera">
            <strong>{d.nombre}</strong>
            <span>
              <button className="btn btn-mini" onClick={() => setForm(d)}>Editar</button>
              <button className="btn btn-mini" onClick={() => eliminarDataset(sistema.id, d.id)}>Eliminar</button>
            </span>
          </div>
          <small className="muted">
            Origen: {d.origen || '⚠️ sin documentar'} · {d.datosPersonales ? 'Datos personales' : 'Sin datos personales'}
            {d.datosPersonales && !d.evaluacionPrivacidad && ' · ⚠️ evaluación de privacidad pendiente (bloquea Gate 3)'}
          </small>
        </article>
      ))}
      {form ? (
        <FormDataset form={form} setForm={setForm} onGuardar={() => { guardarDataset(sistema.id, form); setForm(null) }} />
      ) : (
        <button className="btn" onClick={() => setForm({ ...datasetVacio })}>＋ Nueva dataset card</button>
      )}
    </section>
  )
}

function FormDataset({ form, setForm, onGuardar }) {
  return (
    <div className="subform">
      <label>Nombre del dataset / fuente<input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></label>
      <label>Origen documentado<input value={form.origen} onChange={(e) => setForm({ ...form, origen: e.target.value })} placeholder="p. ej. CRM interno, dataset público X, scraping autorizado..." /></label>
      <label>Tipología<input value={form.tipologia} onChange={(e) => setForm({ ...form, tipologia: e.target.value })} placeholder="estructurado, documentos, imágenes..." /></label>
      <label className="check"><input type="checkbox" checked={form.datosPersonales} onChange={() => setForm({ ...form, datosPersonales: !form.datosPersonales })} />Contiene datos personales</label>
      <label className="check"><input type="checkbox" checked={form.categoriasEspeciales} onChange={() => setForm({ ...form, categoriasEspeciales: !form.categoriasEspeciales })} />Contiene categorías especiales</label>
      {form.datosPersonales && (
        <label>Evaluación de privacidad (base jurídica, minimización...)
          <textarea rows={2} value={form.evaluacionPrivacidad} onChange={(e) => setForm({ ...form, evaluacionPrivacidad: e.target.value })} />
        </label>
      )}
      <label>Calidad y sesgos<textarea rows={2} value={form.calidad} onChange={(e) => setForm({ ...form, calidad: e.target.value })} /></label>
      <label>Linaje / transformaciones<textarea rows={2} value={form.linaje} onChange={(e) => setForm({ ...form, linaje: e.target.value })} /></label>
      <label>Responsable<input value={form.responsable} onChange={(e) => setForm({ ...form, responsable: e.target.value })} /></label>
      <div className="acciones">
        <button className="btn btn-primary" disabled={!form.nombre || !form.origen} onClick={onGuardar}>Guardar dataset card</button>
        <button className="btn" onClick={() => setForm(null)}>Cancelar</button>
      </div>
      {(!form.nombre || !form.origen) && <small className="texto-ambar">Nombre y origen documentado son obligatorios (bloqueo de datasets sin origen).</small>}
    </div>
  )
}

const modeloVacio = { nombre: '', version: '', proveedor: '', tipo: 'gpai', licencia: '', usoPrevisto: '', limitaciones: '', documentacion: '', dependenciaCritica: false }

function Modelos({ sistema }) {
  const guardarModelo = usePlatformStore((st) => st.guardarModelo)
  const eliminarModelo = usePlatformStore((st) => st.eliminarModelo)
  const [form, setForm] = useState(null)

  return (
    <section className="tarjeta">
      <h3>Model cards ({sistema.modelos.length})</h3>
      <p className="muted small">No se permite integrar un modelo sin ficha: proveedor, licencia, limitaciones y documentación recibida (cadena de valor GPAI).</p>
      {sistema.modelos.map((m) => (
        <article key={m.id} className="item">
          <div className="item-cabecera">
            <strong>{m.nombre} {m.version && `(${m.version})`}</strong>
            <span>
              <button className="btn btn-mini" onClick={() => setForm(m)}>Editar</button>
              <button className="btn btn-mini" onClick={() => eliminarModelo(sistema.id, m.id)}>Eliminar</button>
            </span>
          </div>
          <small className="muted">
            {TIPOS_MODELO.find((t) => t.id === m.tipo)?.label || m.tipo} · {m.proveedor || '⚠️ sin proveedor'} · Licencia: {m.licencia || '⚠️ sin licencia'}
            {!m.limitaciones && ' · ⚠️ limitaciones sin documentar (bloquea Gate 3)'}
            {m.dependenciaCritica && ' · Dependencia crítica'}
          </small>
        </article>
      ))}
      {form ? (
        <div className="subform">
          <label>Nombre del modelo<input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></label>
          <label>Versión<input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} /></label>
          <label>Proveedor<input value={form.proveedor} onChange={(e) => setForm({ ...form, proveedor: e.target.value })} /></label>
          <label>Tipo
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              {TIPOS_MODELO.filter((t) => t.id !== 'ninguno').map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </label>
          <label>Licencia<input value={form.licencia} onChange={(e) => setForm({ ...form, licencia: e.target.value })} placeholder="comercial, Apache-2.0, restricciones de uso..." /></label>
          <label>Uso previsto en este sistema<textarea rows={2} value={form.usoPrevisto} onChange={(e) => setForm({ ...form, usoPrevisto: e.target.value })} /></label>
          <label>Limitaciones conocidas<textarea rows={2} value={form.limitaciones} onChange={(e) => setForm({ ...form, limitaciones: e.target.value })} /></label>
          <label>Documentación recibida del proveedor<textarea rows={2} value={form.documentacion} onChange={(e) => setForm({ ...form, documentacion: e.target.value })} placeholder="model card, API docs, security docs..." /></label>
          <label className="check"><input type="checkbox" checked={form.dependenciaCritica} onChange={() => setForm({ ...form, dependenciaCritica: !form.dependenciaCritica })} />Dependencia crítica</label>
          <div className="acciones">
            <button
              className="btn btn-primary"
              disabled={!form.nombre || !form.proveedor || !form.licencia || !form.limitaciones}
              onClick={() => { guardarModelo(sistema.id, form); setForm(null) }}
            >
              Guardar model card
            </button>
            <button className="btn" onClick={() => setForm(null)}>Cancelar</button>
          </div>
          {(!form.nombre || !form.proveedor || !form.licencia || !form.limitaciones) && (
            <small className="texto-ambar">Nombre, proveedor, licencia y limitaciones son obligatorios para superar el Gate 3.</small>
          )}
        </div>
      ) : (
        <button className="btn" onClick={() => setForm({ ...modeloVacio })}>＋ Nueva model card</button>
      )}
    </section>
  )
}
