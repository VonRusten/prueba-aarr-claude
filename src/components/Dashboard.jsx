import { usePlatformStore } from '../store/usePlatformStore'
import { evaluarGates } from '../domain/gates'
import { ESTADOS_SISTEMA, NIVELES_RIESGO } from '../domain/constants'

// Panel de cumplimiento (doc 03 §17): sistemas por estado y clasificación,
// gates bloqueados, riesgos críticos y releases pendientes.
export default function Dashboard({ onAbrir, onNuevo }) {
  const sistemas = usePlatformStore((st) => st.sistemas)

  const resumen = sistemas.map((s) => {
    const gates = evaluarGates(s)
    return {
      s,
      gatesBloqueados: gates.filter((g) => g.estado === 'bloqueado').length,
      gatesSuperados: gates.filter((g) => g.estado === 'superado').length,
      riesgosCriticos: (s.riesgos || []).filter((r) => r.severidad === 'Crítica' && !['Cerrado', 'Mitigado'].includes(r.estado)).length,
      obligacionesPendientes: (s.clasificacion?.obligaciones || []).filter(
        (id) => (s.obligaciones?.[id]?.estado || 'Pendiente') === 'Pendiente'
      ).length,
      releasesPendientes: (s.releases || []).filter((r) => ['draft', 'in_validation', 'blocked'].includes(r.estado)).length,
    }
  })

  const totales = {
    sistemas: sistemas.length,
    altoRiesgo: sistemas.filter((x) => x.clasificacion?.nivel === 'alto').length,
    bloqueados: sistemas.filter((x) => x.clasificacion?.nivel === 'prohibido').length,
    gatesBloqueados: resumen.reduce((a, r) => a + r.gatesBloqueados, 0),
    riesgosCriticos: resumen.reduce((a, r) => a + r.riesgosCriticos, 0),
    obligacionesPendientes: resumen.reduce((a, r) => a + r.obligacionesPendientes, 0),
  }

  return (
    <div className="pagina">
      <header className="pagina-cabecera">
        <div>
          <h1>Panel de cumplimiento</h1>
          <p className="muted">Estado regulatorio de todos los sistemas de IA registrados en la plataforma.</p>
        </div>
        <button className="btn btn-primary" onClick={onNuevo}>＋ Nuevo sistema de IA</button>
      </header>

      <div className="kpis">
        <Kpi titulo="Sistemas registrados" valor={totales.sistemas} />
        <Kpi titulo="Alto riesgo" valor={totales.altoRiesgo} tono="rojo" />
        <Kpi titulo="Bloqueados (Art. 5)" valor={totales.bloqueados} tono="negro" />
        <Kpi titulo="Gates bloqueados" valor={totales.gatesBloqueados} tono="ambar" />
        <Kpi titulo="Riesgos críticos abiertos" valor={totales.riesgosCriticos} tono="rojo" />
        <Kpi titulo="Obligaciones pendientes" valor={totales.obligacionesPendientes} tono="ambar" />
      </div>

      {sistemas.length === 0 ? (
        <div className="vacio">
          <h2>Bienvenido a la plataforma AI Act-native</h2>
          <p>
            Aquí no se genera código a ciegas: cada sistema de IA nace con finalidad prevista, clasificación regulatoria,
            obligaciones, riesgos, controles, evidencias y gates de aprobación.
          </p>
          <p>
            <strong>Empieza describiendo tu idea en el intake conversacional.</strong> La plataforma la estructurará,
            ejecutará el screening de prácticas prohibidas y activará las obligaciones aplicables.
          </p>
          <button className="btn btn-primary" onClick={onNuevo}>Iniciar intake conversacional</button>
        </div>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Sistema</th>
              <th>Estado</th>
              <th>Clasificación</th>
              <th>Gates</th>
              <th>Riesgos críticos</th>
              <th>Obligaciones pendientes</th>
              <th>Releases en curso</th>
            </tr>
          </thead>
          <tbody>
            {resumen.map(({ s, gatesBloqueados, gatesSuperados, riesgosCriticos, obligacionesPendientes, releasesPendientes }) => (
              <tr key={s.id} className="fila-click" onClick={() => onAbrir(s.id)}>
                <td><strong>{s.nombre}</strong><br /><small className="muted">{s.owner} · v{s.version}</small></td>
                <td>{ESTADOS_SISTEMA.find((e) => e.id === s.estado)?.label}</td>
                <td>
                  <span className={`pildora p-${NIVELES_RIESGO[s.clasificacion?.nivel]?.color || 'gris'}`}>
                    {NIVELES_RIESGO[s.clasificacion?.nivel]?.label || 'Sin clasificar'}
                  </span>
                </td>
                <td>{gatesSuperados} superados · <span className={gatesBloqueados ? 'texto-rojo' : ''}>{gatesBloqueados} bloqueados</span></td>
                <td className={riesgosCriticos ? 'texto-rojo' : ''}>{riesgosCriticos}</td>
                <td className={obligacionesPendientes ? 'texto-ambar' : ''}>{obligacionesPendientes}</td>
                <td>{releasesPendientes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function Kpi({ titulo, valor, tono }) {
  return (
    <div className={`kpi ${tono ? `kpi-${tono}` : ''}`}>
      <span className="kpi-valor">{valor}</span>
      <span className="kpi-titulo">{titulo}</span>
    </div>
  )
}
