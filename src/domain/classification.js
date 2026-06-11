import {
  CATALOGO_OBLIGACIONES,
  PRACTICAS_PROHIBIDAS,
  SECTORES_ANEXO_III,
  TRIGGERS_TRANSPARENCIA,
  VERSION_MOTOR_CLASIFICACION,
} from './constants'

// Motor de clasificación regulatoria (Módulo 2 de la propuesta).
// Árbol de decisión determinista y versionado sobre el AI System Intake Record.
export function clasificarSistema(intake) {
  const motivos = []
  const flags = {
    gpai: false,
    datos_personales: !!intake.datosPersonales,
    transparencia: [],
    sectoresAltoRiesgo: [],
    practicasProhibidas: [],
  }

  // 1. ¿Es un sistema de IA?
  const sinModelo = (intake.tiposModelo || []).length === 0 || intake.tiposModelo.includes('ninguno')
  const esSistemaIA = !(intake.autonomia === 'reglas' && sinModelo)
  if (!esSistemaIA) {
    motivos.push('Opera con reglas fijas programadas y sin modelos de IA: no encaja en la definición de sistema de IA del Art. 3.1.')
    return resultado('fuera_ambito', false, intake, flags, motivos)
  }
  motivos.push('El sistema infiere outputs (predicciones, recomendaciones, decisiones o contenidos) con un grado de autonomía: constituye sistema de IA (Art. 3.1).')

  // 2. Prácticas prohibidas (bloqueo duro).
  flags.practicasProhibidas = PRACTICAS_PROHIBIDAS.filter((p) => intake.screening?.[p.id] === true).map((p) => p.id)
  if (flags.practicasProhibidas.length > 0) {
    flags.practicasProhibidas.forEach((id) => {
      const p = PRACTICAS_PROHIBIDAS.find((x) => x.id === id)
      motivos.push(`Encaja en práctica prohibida del Art. 5: ${p.label}.`)
    })
    motivos.push('BLOQUEO DURO: el proyecto no puede avanzar a fase de diseño salvo que se acredite una excepción aplicable tras revisión humana experta.')
    return resultado('prohibido', true, intake, flags, motivos)
  }
  motivos.push('Superado el screening de prácticas prohibidas del Art. 5.')

  // 3. GPAI.
  flags.gpai = (intake.tiposModelo || []).some((t) => ['gpai', 'fine_tuned'].includes(t))
  if (flags.gpai) {
    motivos.push('Integra un modelo de propósito general (GPAI/LLM): se activan obligaciones de documentación de la cadena de valor.')
  }

  // 4. Transparencia (Art. 50) — flags independientes del nivel.
  flags.transparencia = TRIGGERS_TRANSPARENCIA.filter((t) => intake.transparencia?.[t.id] === true).map((t) => t.id)
  flags.transparencia.forEach((id) => {
    const t = TRIGGERS_TRANSPARENCIA.find((x) => x.id === id)
    motivos.push(`Activa obligación de transparencia del Art. 50: ${t.label}.`)
  })

  // 5. Alto riesgo por Anexo III.
  flags.sectoresAltoRiesgo = (intake.sectores || []).filter((s) => SECTORES_ANEXO_III.some((x) => x.id === s))
  let nivel
  if (flags.sectoresAltoRiesgo.length > 0) {
    nivel = 'alto'
    flags.sectoresAltoRiesgo.forEach((id) => {
      const s = SECTORES_ANEXO_III.find((x) => x.id === id)
      motivos.push(`Alto riesgo por Anexo III: ${s.label}.`)
    })
    if (intake.autonomia === 'decision' || intake.autonomia === 'agente') {
      motivos.push('El nivel de autonomía (decisión automatizada o agente) refuerza la clasificación de alto riesgo.')
    }
  } else if (flags.transparencia.length > 0) {
    nivel = 'transparencia'
    motivos.push('No encaja en Anexo III, pero está sujeto a obligaciones específicas de transparencia.')
  } else {
    nivel = 'minimo'
    motivos.push('No encaja en prácticas prohibidas, Anexo III ni obligaciones específicas de transparencia: riesgo limitado o mínimo con documentación proporcional.')
  }

  if (flags.datos_personales) {
    motivos.push('Trata datos personales: se activan controles de privacidad (evaluación RGPD vinculada a datasets).')
  }

  return resultado(nivel, true, intake, flags, motivos)
}

function resultado(nivel, esSistemaIA, intake, flags, motivos) {
  return {
    nivel,
    esSistemaIA,
    rol: intake.rol || null,
    flags,
    motivos,
    obligaciones: obligacionesAplicables(nivel, flags),
    versionMotor: VERSION_MOTOR_CLASIFICACION,
    fecha: new Date().toISOString(),
    requiereRevisionHumana:
      nivel === 'prohibido' || nivel === 'alto' || flags.datos_personales || (intake.afectaVulnerables ?? false),
  }
}

// Activa las obligaciones del catálogo aplicables a la clasificación (compliance as code).
export function obligacionesAplicables(nivel, flags) {
  if (nivel === 'fuera_ambito') return []
  return CATALOGO_OBLIGACIONES.filter((o) =>
    o.aplicabilidad.some((a) => {
      if (a === 'todos') return true
      if (a === nivel) return true
      if (nivel === 'alto' && (a === 'transparencia' || a === 'minimo')) return false
      if (a.startsWith('flag:')) {
        const f = a.slice(5)
        if (f === 'gpai') return flags.gpai
        if (f === 'datos_personales') return flags.datos_personales
        return flags.transparencia.includes(f)
      }
      return false
    })
  ).map((o) => o.id)
}

// Análisis ligero de la descripción en lenguaje natural para sugerir banderas
// regulatorias durante el intake conversacional (capa de experiencia, §6).
export function analizarDescripcion(texto) {
  const t = (texto || '').toLowerCase()
  const sugerencias = { sectores: [], transparencia: [], avisos: [] }
  const mapaSectores = [
    [/biometr|facial|huella|reconocimiento de voz/, 'biometria'],
    [/educaci|alumno|examen|estudiante|formaci/, 'educacion'],
    [/empleo|candidat|curricul|cv|rrhh|recursos humanos|trabajador|selecci.n de personal|despido|n.mina/, 'empleo'],
    [/cr.dito|scoring|seguro|prestaci|solvencia|impago|hipoteca|pr.stamo/, 'servicios_esenciales'],
    [/polic|delito|penal|criminal|investigaci.n policial/, 'law_enforcement'],
    [/migraci|asilo|frontera|visado/, 'migracion'],
    [/judicial|juez|sentencia|tribunal|electoral/, 'justicia'],
    [/energ.a|agua|tr.fico|infraestructura cr.tica|red el.ctrica/, 'infraestructura'],
  ]
  mapaSectores.forEach(([re, id]) => { if (re.test(t)) sugerencias.sectores.push(id) })

  if (/chat|conversaci|asistente|bot|atenci.n al cliente/.test(t)) sugerencias.transparencia.push('t_interaccion')
  if (/genera|redacta|resume|crea contenido|imagen|texto|respuesta autom/.test(t)) sugerencias.transparencia.push('t_contenido')
  if (/emoci|sentimiento|estado de .nimo/.test(t)) sugerencias.transparencia.push('t_emociones')

  if (/menor|niñ|adolescente|vulnerable|discapaci/.test(t)) {
    sugerencias.avisos.push('La descripción menciona colectivos potencialmente vulnerables: se reforzará la revisión humana.')
  }
  if (/subliminal|manipul|puntuaci.n social|social scoring/.test(t)) {
    sugerencias.avisos.push('La descripción contiene indicios de posible práctica prohibida: el screening del Art. 5 será determinante.')
  }
  return sugerencias
}
