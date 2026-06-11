import { useState } from 'react'
import { usePlatformStore } from '../../store/usePlatformStore'
import { evaluarGates } from '../../domain/gates'

const ETIQUETA_ESTADO = {
  superado: { label: 'SUPERADO', clase: 'p-verde' },
  pendiente: { label: 'PENDIENTE DE APROBACIÓN', clase: 'p-ambar' },
  bloqueado: { label: 'BLOQUEADO', clase: 'p-rojo' },
}

// Panel de gates (doc 01 §8.7 y doc 03 §4): checks automáticos sobre el
// expediente + aprobación humana registrada por gate.
export default function GatesTab({ sistema }) {
  const aprobarGate = usePlatformStore((st) => st.aprobarGate)
  const revocarGate = usePlatformStore((st) => st.revocarGate)
  const [abierto, setAbierto] = useState(null)
  const [aprobador, setAprobador] = useState('')
  const [notas, setNotas] = useState('')

  const gates = evaluarGates(sistema)

  return (
    <section>
      <p className="muted small">
        Un gate queda <strong>superado</strong> cuando todos sus checks automáticos se cumplen y existe aprobación humana
        registrada. Los checks se reevalúan en vivo: si el expediente cambia y deja de cumplir, el gate vuelve a bloquearse.
      </p>
      {gates.map((g) => {
        const et = ETIQUETA_ESTADO[g.estado]
        return (
          <article key={g.id} className="tarjeta gate">
            <div className="item-cabecera" onClick={() => setAbierto(abierto === g.id ? null : g.id)} style={{ cursor: 'pointer' }}>
              <div>
                <strong>{g.nombre}</strong>
                <p className="muted small">{g.objetivo}</p>
              </div>
              <span className={`pildora ${et.clase}`}>{et.label}</span>
            </div>
            {abierto === g.id && (
              <div>
                <ul className="checks">
                  {g.checks.map((c, i) => (
                    <li key={i} className={c.ok ? 'check-ok' : 'check-ko'}>
                      {c.ok ? '✔' : '✘'} {c.label}
                      {!c.ok && c.detalle && <small> — {c.detalle}</small>}
                    </li>
                  ))}
                  {g.checks.length === 0 && <li className="check-ok">✔ Sin checks automáticos aplicables.</li>}
                </ul>
                {g.estado === 'superado' && (
                  <div className="acciones">
                    <small className="muted">
                      Aprobado por <strong>{g.aprobacion.aprobador}</strong> el {new Date(g.aprobacion.fecha).toLocaleString('es-ES')}.
                      {g.aprobacion.notas && ` Notas: ${g.aprobacion.notas}`}
                    </small>
                    <button className="btn btn-mini" onClick={() => revocarGate(sistema.id, g.id, 'Revocación manual')}>Revocar aprobación</button>
                  </div>
                )}
                {g.estado === 'pendiente' && (
                  <div className="subform">
                    <p className="small">Checks automáticos superados. Registra la aprobación humana (regla de segregación: el aprobador no debería ser quien creó las evidencias en riesgos altos).</p>
                    <div className="grid-2">
                      <label>Aprobador<input value={aprobador} onChange={(e) => setAprobador(e.target.value)} placeholder="nombre y rol" /></label>
                      <label>Notas<input value={notas} onChange={(e) => setNotas(e.target.value)} /></label>
                    </div>
                    <button
                      className="btn btn-primary"
                      disabled={!aprobador.trim()}
                      onClick={() => { aprobarGate(sistema.id, g.id, aprobador.trim(), notas.trim()); setAprobador(''); setNotas('') }}
                    >
                      Aprobar {g.id}
                    </button>
                  </div>
                )}
                {g.estado === 'bloqueado' && (
                  <p className="texto-rojo small">
                    El gate está bloqueado por checks incumplidos. Completa las evidencias indicadas; no es posible aprobarlo manualmente
                    (los gates no son eludibles).
                  </p>
                )}
              </div>
            )}
          </article>
        )
      })}
    </section>
  )
}
