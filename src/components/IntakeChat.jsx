import { useEffect, useRef, useState } from 'react'
import { usePlatformStore } from '../store/usePlatformStore'
import { PASOS_INTAKE } from '../domain/intakeScript'
import { analizarDescripcion, clasificarSistema } from '../domain/classification'
import { NIVELES_RIESGO, SECTORES_ANEXO_III, TRIGGERS_TRANSPARENCIA } from '../domain/constants'

// Intake conversacional: el Agente de Intake pregunta paso a paso y construye
// el AI System Intake Record. Al terminar ejecuta el motor de clasificación y
// muestra el resultado antes de crear el sistema.
export default function IntakeChat({ onTerminado, onCancelar }) {
  const crearSistemaDesdeIntake = usePlatformStore((st) => st.crearSistemaDesdeIntake)
  const [paso, setPaso] = useState(0)
  const [mensajes, setMensajes] = useState([
    {
      de: 'agente',
      texto:
        'Soy el Agente de Intake de la plataforma. No voy a generar código: mi función es transformar tu idea en una ficha estructurada de sistema de IA, ejecutar el screening de prácticas prohibidas y activar las obligaciones del Reglamento de IA que apliquen. Empecemos.',
    },
    { de: 'agente', texto: PASOS_INTAKE[0].pregunta, porQue: PASOS_INTAKE[0].porQue },
  ])
  const [respuestas, setRespuestas] = useState({})
  const [texto, setTexto] = useState('')
  const [seleccion, setSeleccion] = useState([])
  const [sugerencias, setSugerencias] = useState(null)
  const [resultado, setResultado] = useState(null)
  const finRef = useRef(null)

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, resultado])

  const pasoActual = PASOS_INTAKE[paso]

  function avanzar(valor, etiquetaUsuario) {
    const nuevasRespuestas = { ...respuestas, [pasoActual.key]: valor }
    const nuevos = [...mensajes, { de: 'usuario', texto: etiquetaUsuario }]

    if (pasoActual.analizar) {
      const sug = analizarDescripcion(valor)
      setSugerencias(sug)
      const partes = []
      if (sug.sectores.length) {
        partes.push(
          `He detectado posibles ámbitos del Anexo III en tu descripción: ${sug.sectores
            .map((id) => SECTORES_ANEXO_III.find((s) => s.id === id)?.label)
            .join('; ')}. Te los preseleccionaré cuando lleguemos a esa pregunta; confírmalos o corrígelos.`
        )
      }
      if (sug.transparencia.length) {
        partes.push(
          `También veo posibles obligaciones de transparencia: ${sug.transparencia
            .map((id) => TRIGGERS_TRANSPARENCIA.find((t) => t.id === id)?.label)
            .join('; ')}.`
        )
      }
      sug.avisos.forEach((a) => partes.push(`⚠️ ${a}`))
      if (partes.length) nuevos.push({ de: 'agente', texto: partes.join('\n\n'), analisis: true })
    }

    const siguiente = paso + 1
    if (siguiente < PASOS_INTAKE.length) {
      nuevos.push({ de: 'agente', texto: PASOS_INTAKE[siguiente].pregunta, porQue: PASOS_INTAKE[siguiente].porQue })
      setMensajes(nuevos)
      setPaso(siguiente)
      const prox = PASOS_INTAKE[siguiente]
      if (prox.tipo === 'multichoice' && prox.key === 'sectores' && sugerencias?.sectores?.length) {
        setSeleccion(sugerencias.sectores)
      } else if (prox.tipo === 'flags' && prox.key === 'transparencia' && sugerencias?.transparencia?.length) {
        setSeleccion(sugerencias.transparencia)
      } else {
        setSeleccion([])
      }
      setTexto('')
      setRespuestas(nuevasRespuestas)
    } else {
      setMensajes(nuevos)
      setRespuestas(nuevasRespuestas)
      finalizar(nuevasRespuestas)
    }
  }

  function finalizar(r) {
    const intake = {
      descripcion: r.descripcion,
      finalidadPreliminar: r.finalidadPreliminar,
      usuarios: r.usuarios,
      afectados: r.afectados,
      inputs: r.inputs,
      outputs: r.outputs,
      autonomia: r.autonomia,
      tiposModelo: r.tiposModelo || [],
      sectores: (r.sectores || []).filter((s) => s !== 'ninguno'),
      transparencia: Object.fromEntries((r.transparencia || []).map((id) => [id, true])),
      datosPersonales: r.datosPersonales === true,
      screening: Object.fromEntries((r.screening || []).map((id) => [id, true])),
      usosExcluidos: r.usosExcluidos,
      rol: r.rol,
    }
    const cls = clasificarSistema(intake)
    setResultado({ intake, cls, nombre: r.nombre, owner: r.owner, unidad: r.unidad })
  }

  function confirmarCreacion() {
    const id = crearSistemaDesdeIntake({
      nombre: resultado.nombre,
      owner: resultado.owner,
      unidad: resultado.unidad,
      intake: resultado.intake,
    })
    onTerminado(id)
  }

  return (
    <div className="pagina chat-pagina">
      <header className="pagina-cabecera">
        <div>
          <h1>Intake conversacional</h1>
          <p className="muted">Modo idea · el agente estructura tu intención antes de permitir el desarrollo.</p>
        </div>
        <button className="btn" onClick={onCancelar}>Cancelar</button>
      </header>

      <div className="chat">
        {mensajes.map((m, i) => (
          <div key={i} className={`burbuja ${m.de === 'agente' ? 'b-agente' : 'b-usuario'} ${m.analisis ? 'b-analisis' : ''}`}>
            {m.texto.split('\n').map((l, j) => (
              <p key={j}>{l}</p>
            ))}
            {m.porQue && <small className="por-que">¿Por qué se pregunta? {m.porQue}</small>}
          </div>
        ))}

        {resultado && <ResultadoClasificacion resultado={resultado} onConfirmar={confirmarCreacion} />}
        <div ref={finRef} />
      </div>

      {!resultado && (
        <div className="chat-entrada">
          <div className="paso-indicador">Paso {paso + 1} de {PASOS_INTAKE.length}</div>
          {(pasoActual.tipo === 'text' || pasoActual.tipo === 'textarea') && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (texto.trim()) avanzar(texto.trim(), texto.trim())
              }}
            >
              {pasoActual.tipo === 'textarea' ? (
                <textarea rows={3} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe tu respuesta..." autoFocus />
              ) : (
                <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe tu respuesta..." autoFocus />
              )}
              <button className="btn btn-primary" type="submit" disabled={!texto.trim()}>Enviar</button>
            </form>
          )}
          {pasoActual.tipo === 'choice' && (
            <div className="opciones">
              {pasoActual.opciones.map((o) => (
                <button key={o.id} className="btn opcion" onClick={() => avanzar(o.id, o.label)}>{o.label}</button>
              ))}
            </div>
          )}
          {pasoActual.tipo === 'boolean' && (
            <div className="opciones">
              <button className="btn opcion" onClick={() => avanzar(true, 'Sí')}>Sí</button>
              <button className="btn opcion" onClick={() => avanzar(false, 'No')}>No</button>
            </div>
          )}
          {(pasoActual.tipo === 'multichoice' || pasoActual.tipo === 'flags') && (
            <div>
              <div className="opciones opciones-multi">
                {pasoActual.opciones.map((o) => {
                  const activo = seleccion.includes(o.id)
                  return (
                    <button
                      key={o.id}
                      className={`btn opcion ${activo ? 'opcion-activa' : ''}`}
                      onClick={() =>
                        setSeleccion(activo ? seleccion.filter((x) => x !== o.id) : [...seleccion.filter((x) => x !== 'ninguno'), o.id])
                      }
                    >
                      {activo ? '✓ ' : ''}{o.label}
                    </button>
                  )
                })}
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const sel = pasoActual.tipo === 'flags' ? seleccion : seleccion.length ? seleccion : ['ninguno']
                  const etiqueta = sel.length
                    ? sel.map((id) => pasoActual.opciones.find((o) => o.id === id)?.label || id).join(' · ')
                    : 'Ninguna'
                  avanzar(sel, etiqueta)
                }}
              >
                {seleccion.length ? 'Confirmar selección' : pasoActual.tipo === 'flags' ? 'No aplica ninguna' : 'Ninguno'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ResultadoClasificacion({ resultado, onConfirmar }) {
  const { cls } = resultado
  const nivel = NIVELES_RIESGO[cls.nivel]
  return (
    <div className={`burbuja b-agente resultado-cls borde-${nivel.color}`}>
      <h3>Clasificación regulatoria preliminar</h3>
      <p>
        <span className={`pildora p-${nivel.color}`}>{nivel.label}</span>
      </p>
      <ul>
        {cls.motivos.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
      <p>
        <strong>{cls.obligaciones.length} obligaciones activadas</strong> en la matriz requisito-control-evidencia.
        {cls.requiereRevisionHumana && ' ⚠️ Este caso requiere revisión humana experta (regla de escalado de la capa de agentes).'}
      </p>
      {cls.nivel === 'prohibido' ? (
        <p className="texto-rojo">
          <strong>Bloqueo duro:</strong> el sistema quedará registrado pero no podrá avanzar a fase de diseño salvo
          que una revisión humana acredite una excepción aplicable.
        </p>
      ) : null}
      <button className="btn btn-primary" onClick={onConfirmar}>
        Registrar sistema con esta clasificación
      </button>
    </div>
  )
}
