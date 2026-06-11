import { useState } from 'react'
import { usePlatformStore } from '../../store/usePlatformStore'
import { ESTADOS_SISTEMA } from '../../domain/constants'

// Ficha del sistema de IA + AI System Intake Record + arquitectura
// (la arquitectura alimenta los checks de los gates G4 y G9).
export default function OverviewTab({ sistema }) {
  const actualizarFicha = usePlatformStore((st) => st.actualizarFicha)
  const actualizarIntake = usePlatformStore((st) => st.actualizarIntake)
  const actualizarArquitectura = usePlatformStore((st) => st.actualizarArquitectura)
  const [ficha, setFicha] = useState({ nombre: sistema.nombre, owner: sistema.owner, unidad: sistema.unidad, estado: sistema.estado })
  const [intake, setIntake] = useState({
    descripcion: sistema.intake?.descripcion || '',
    usuarios: sistema.intake?.usuarios || '',
    afectados: sistema.intake?.afectados || '',
    inputs: sistema.intake?.inputs || '',
    outputs: sistema.intake?.outputs || '',
  })
  const a = sistema.arquitectura || {}
  const [arq, setArq] = useState({
    descripcion: a.descripcion || '',
    componentes: a.componentes || '',
    flujosDatos: a.flujosDatos || '',
    logging: a.logging || '',
    supervisionHumana: a.supervisionHumana || '',
    fallback: a.fallback || '',
    monitorizacion: a.monitorizacion || '',
    instruccionesUso: a.instruccionesUso || '',
    ciberseguridad: a.ciberseguridad || '',
    planDespliegue: a.planDespliegue || '',
  })

  return (
    <div className="grid-2">
      <section className="tarjeta">
        <h3>Identificación</h3>
        <label>Nombre<input value={ficha.nombre} onChange={(e) => setFicha({ ...ficha, nombre: e.target.value })} /></label>
        <label>Owner<input value={ficha.owner} onChange={(e) => setFicha({ ...ficha, owner: e.target.value })} /></label>
        <label>Unidad responsable<input value={ficha.unidad} onChange={(e) => setFicha({ ...ficha, unidad: e.target.value })} /></label>
        <label>Estado del ciclo de vida
          <select value={ficha.estado} onChange={(e) => setFicha({ ...ficha, estado: e.target.value })}>
            {ESTADOS_SISTEMA.map((e) => <option key={e.id} value={e.id}>{e.label}</option>)}
          </select>
        </label>
        <button className="btn btn-primary" onClick={() => actualizarFicha(sistema.id, ficha)}>Guardar identificación</button>

        <h3 className="mt">Intake (caso de uso)</h3>
        <label>Descripción<textarea rows={3} value={intake.descripcion} onChange={(e) => setIntake({ ...intake, descripcion: e.target.value })} /></label>
        <label>Usuarios<input value={intake.usuarios} onChange={(e) => setIntake({ ...intake, usuarios: e.target.value })} /></label>
        <label>Personas afectadas<input value={intake.afectados} onChange={(e) => setIntake({ ...intake, afectados: e.target.value })} /></label>
        <label>Inputs<input value={intake.inputs} onChange={(e) => setIntake({ ...intake, inputs: e.target.value })} /></label>
        <label>Outputs<input value={intake.outputs} onChange={(e) => setIntake({ ...intake, outputs: e.target.value })} /></label>
        <button className="btn btn-primary" onClick={() => actualizarIntake(sistema.id, intake)}>Guardar intake</button>
      </section>

      <section className="tarjeta">
        <h3>Arquitectura y diseño (Gate 4 / Gate 9)</h3>
        <p className="muted small">
          Estos campos son evidencia de diseño: logging (Art. 12), supervisión humana (Art. 14), fallback,
          monitorización y plan de despliegue alimentan los checks automáticos de los gates.
        </p>
        <label>Arquitectura general<textarea rows={3} value={arq.descripcion} onChange={(e) => setArq({ ...arq, descripcion: e.target.value })} /></label>
        <label>Mapa de componentes<textarea rows={2} value={arq.componentes} onChange={(e) => setArq({ ...arq, componentes: e.target.value })} /></label>
        <label>Flujos de datos<textarea rows={2} value={arq.flujosDatos} onChange={(e) => setArq({ ...arq, flujosDatos: e.target.value })} /></label>
        <label>Diseño de logging<textarea rows={2} value={arq.logging} onChange={(e) => setArq({ ...arq, logging: e.target.value })} /></label>
        <label>Supervisión humana (override, escalado, stop)<textarea rows={2} value={arq.supervisionHumana} onChange={(e) => setArq({ ...arq, supervisionHumana: e.target.value })} /></label>
        <label>Fallback / rollback<textarea rows={2} value={arq.fallback} onChange={(e) => setArq({ ...arq, fallback: e.target.value })} /></label>
        <label>Diseño de monitorización post-despliegue<textarea rows={2} value={arq.monitorizacion} onChange={(e) => setArq({ ...arq, monitorizacion: e.target.value })} /></label>
        <label>Instrucciones de uso (Art. 13)<textarea rows={2} value={arq.instruccionesUso} onChange={(e) => setArq({ ...arq, instruccionesUso: e.target.value })} /></label>
        <label>Ciberseguridad / threat model (Art. 15)<textarea rows={2} value={arq.ciberseguridad} onChange={(e) => setArq({ ...arq, ciberseguridad: e.target.value })} /></label>
        <label>Plan de despliegue<textarea rows={2} value={arq.planDespliegue} onChange={(e) => setArq({ ...arq, planDespliegue: e.target.value })} /></label>
        <button className="btn btn-primary" onClick={() => actualizarArquitectura(sistema.id, arq)}>Guardar arquitectura</button>
      </section>
    </div>
  )
}
