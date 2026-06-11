import { useState } from 'react'
import { usePlatformStore } from '../store/usePlatformStore'
import { ESTADOS_SISTEMA, NIVELES_RIESGO, ROLES_REGULATORIOS } from '../domain/constants'
import OverviewTab from './tabs/OverviewTab'
import PurposeTab from './tabs/PurposeTab'
import ClassificationTab from './tabs/ClassificationTab'
import DataModelsTab from './tabs/DataModelsTab'
import RisksTab from './tabs/RisksTab'
import MatrixTab from './tabs/MatrixTab'
import GatesTab from './tabs/GatesTab'
import DocsTab from './tabs/DocsTab'
import ReleasesTab from './tabs/ReleasesTab'
import AuditTab from './tabs/AuditTab'

const TABS = [
  { id: 'ficha', label: 'Ficha' },
  { id: 'finalidad', label: 'Finalidad prevista' },
  { id: 'clasificacion', label: 'Clasificación' },
  { id: 'datos', label: 'Datos y modelos' },
  { id: 'riesgos', label: 'Riesgos' },
  { id: 'matriz', label: 'Matriz R-C-E' },
  { id: 'gates', label: 'Gates' },
  { id: 'doc', label: 'Documentación' },
  { id: 'releases', label: 'Releases' },
  { id: 'auditoria', label: 'Auditoría' },
]

export default function SystemDetail({ id, onCerrar }) {
  const sistema = usePlatformStore((st) => st.sistemas.find((s) => s.id === id))
  const [tab, setTab] = useState('ficha')

  if (!sistema) {
    return (
      <div className="pagina">
        <p>Sistema no encontrado.</p>
        <button className="btn" onClick={onCerrar}>Volver</button>
      </div>
    )
  }

  const nivel = NIVELES_RIESGO[sistema.clasificacion?.nivel]
  const rol = ROLES_REGULATORIOS.find((r) => r.id === (sistema.clasificacion?.rol || sistema.intake?.rol))

  return (
    <div className="pagina">
      <header className="pagina-cabecera">
        <div>
          <h1>{sistema.nombre}</h1>
          <p className="muted">
            v{sistema.version} · {ESTADOS_SISTEMA.find((e) => e.id === sistema.estado)?.label} · {sistema.owner} ({sistema.unidad})
            {rol ? ` · ${rol.label}` : ''}
          </p>
          {nivel && <span className={`pildora p-${nivel.color}`}>{nivel.label}</span>}
        </div>
        <button className="btn" onClick={onCerrar}>← Panel</button>
      </header>

      {sistema.clasificacion?.nivel === 'prohibido' && (
        <div className="alerta alerta-negra">
          ⛔ <strong>Proyecto bloqueado (Art. 5):</strong> el motor de clasificación ha detectado una práctica prohibida.
          No puede avanzar a fase de diseño salvo revisión humana que acredite una excepción aplicable. Revisa el intake
          en la pestaña «Clasificación» si las respuestas fueron incorrectas.
        </div>
      )}

      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'tab activo' : 'tab'} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      <div className="tab-contenido">
        {tab === 'ficha' && <OverviewTab sistema={sistema} />}
        {tab === 'finalidad' && <PurposeTab sistema={sistema} />}
        {tab === 'clasificacion' && <ClassificationTab sistema={sistema} />}
        {tab === 'datos' && <DataModelsTab sistema={sistema} />}
        {tab === 'riesgos' && <RisksTab sistema={sistema} />}
        {tab === 'matriz' && <MatrixTab sistema={sistema} />}
        {tab === 'gates' && <GatesTab sistema={sistema} />}
        {tab === 'doc' && <DocsTab sistema={sistema} />}
        {tab === 'releases' && <ReleasesTab sistema={sistema} />}
        {tab === 'auditoria' && <AuditTab sistema={sistema} />}
      </div>
    </div>
  )
}
