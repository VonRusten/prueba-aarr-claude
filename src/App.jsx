import { useState } from 'react'
import { usePlatformStore } from './store/usePlatformStore'
import Dashboard from './components/Dashboard'
import IntakeChat from './components/IntakeChat'
import SystemDetail from './components/SystemDetail'
import { NIVELES_RIESGO } from './domain/constants'

export default function App() {
  const sistemas = usePlatformStore((st) => st.sistemas)
  const [vista, setVista] = useState({ tipo: 'dashboard' })

  const abrirSistema = (id) => setVista({ tipo: 'sistema', id })

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand" onClick={() => setVista({ tipo: 'dashboard' })}>
          <span className="brand-icon">⚖️</span>
          <div>
            <strong>AI Act-native</strong>
            <small>Vibe coding regulado</small>
          </div>
        </div>
        <button className="btn btn-primary btn-block" onClick={() => setVista({ tipo: 'intake' })}>
          ＋ Nuevo sistema de IA
        </button>
        <nav>
          <button className={vista.tipo === 'dashboard' ? 'nav-item activo' : 'nav-item'} onClick={() => setVista({ tipo: 'dashboard' })}>
            Panel de cumplimiento
          </button>
        </nav>
        <div className="sidebar-section">Sistemas registrados</div>
        <div className="sidebar-list">
          {sistemas.length === 0 && <p className="muted small pad">Aún no hay sistemas. Empieza con el intake conversacional.</p>}
          {sistemas.map((s) => (
            <button
              key={s.id}
              className={vista.tipo === 'sistema' && vista.id === s.id ? 'nav-item activo' : 'nav-item'}
              onClick={() => abrirSistema(s.id)}
            >
              <span className={`dot dot-${NIVELES_RIESGO[s.clasificacion?.nivel]?.color || 'gris'}`} />
              <span className="nav-label">{s.nombre || '(sin nombre)'}</span>
            </button>
          ))}
        </div>
        <footer className="sidebar-footer">
          <small>Reglamento (UE) 2024/1689 · La creatividad ocurre en la experiencia; la confianza se garantiza en la capa de control.</small>
        </footer>
      </aside>
      <main className="contenido">
        {vista.tipo === 'dashboard' && <Dashboard onAbrir={abrirSistema} onNuevo={() => setVista({ tipo: 'intake' })} />}
        {vista.tipo === 'intake' && <IntakeChat onTerminado={abrirSistema} onCancelar={() => setVista({ tipo: 'dashboard' })} />}
        {vista.tipo === 'sistema' && <SystemDetail id={vista.id} onCerrar={() => setVista({ tipo: 'dashboard' })} />}
      </main>
    </div>
  )
}
