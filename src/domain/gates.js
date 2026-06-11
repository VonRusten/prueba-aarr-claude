import { GATES, CATALOGO_OBLIGACIONES } from './constants'

// Motor de gates de la Capa de control (doc 03, §4).
// Cada gate se evalúa automáticamente sobre el expediente del sistema y,
// además, exige aprobación humana registrada para quedar superado.
export function evaluarGates(sistema) {
  return GATES.map((def) => {
    const checks = checksDeGate(def.id, sistema)
    const autoOk = checks.every((c) => c.ok)
    const aprobacion = sistema.gates?.[def.id]
    let estado
    if (!autoOk) estado = 'bloqueado'
    else if (aprobacion?.aprobado) estado = 'superado'
    else estado = 'pendiente'
    return { ...def, checks, autoOk, aprobacion, estado }
  })
}

export function gatesParaRelease(sistema) {
  // El despliegue exige superar G0–G9; G10 solo gobierna cambios post-despliegue.
  const gates = evaluarGates(sistema).filter((g) => g.id !== 'G10')
  return {
    gates,
    superados: gates.filter((g) => g.estado === 'superado'),
    bloqueados: gates.filter((g) => g.estado === 'bloqueado'),
    pendientes: gates.filter((g) => g.estado === 'pendiente'),
  }
}

function obligacionesEstado(sistema, gateId) {
  const aplicables = (sistema.clasificacion?.obligaciones || [])
    .map((id) => CATALOGO_OBLIGACIONES.find((o) => o.id === id))
    .filter((o) => o && o.gate === gateId)
  return aplicables.map((o) => {
    const inst = sistema.obligaciones?.[o.id]
    const estado = inst?.estado || 'Pendiente'
    return {
      label: `Obligación ${o.id} (${o.fuente}) resuelta: ${o.obligacion}`,
      ok: estado === 'Validado' || estado === 'No aplica',
      detalle: `Estado actual: ${estado}`,
    }
  })
}

function tieneEvidencia(sistema, tipo) {
  return (sistema.evidencias || []).some((e) => e.tipo === tipo)
}

function checksDeGate(gateId, s) {
  const intake = s.intake || {}
  const fin = s.finalidad || {}
  const cls = s.clasificacion
  const arq = s.arquitectura || {}
  const checks = []
  const c = (label, ok, detalle = '') => checks.push({ label, ok: !!ok, detalle })

  switch (gateId) {
    case 'G0':
      c('Existe descripción de la idea (Idea Brief)', intake.descripcion)
      c('Existe solicitante / owner', s.owner)
      c('Existe finalidad preliminar', intake.finalidadPreliminar || fin.declaracion)
      c('Existe unidad responsable', s.unidad)
      c(
        'La idea no encaja en práctica prohibida sin análisis',
        !cls || cls.nivel !== 'prohibido',
        cls?.nivel === 'prohibido' ? 'El motor de clasificación ha detectado práctica prohibida del Art. 5.' : ''
      )
      break
    case 'G1':
      c('Intake completado', intake.completo)
      c('Finalidad prevista registrada (Intended Purpose Statement)', fin.declaracion)
      c('Usuarios identificados', intake.usuarios)
      c('Personas afectadas identificadas', intake.afectados)
      c('Outputs esperados conocidos', intake.outputs)
      c('Usos excluidos delimitados', fin.usosExcluidos || intake.usosExcluidos)
      break
    case 'G2':
      c('Determinado si existe sistema de IA', cls != null)
      c('Screening de prácticas prohibidas ejecutado', intake.screeningCompleto)
      c('Clasificación de riesgo emitida', cls?.nivel && cls.nivel !== 'prohibido', cls?.nivel === 'prohibido' ? 'Sistema bloqueado por práctica prohibida.' : '')
      c('Rol regulatorio identificado', cls?.rol || intake.rol)
      c('Obligaciones aplicables activadas', (cls?.obligaciones || []).length > 0 || cls?.nivel === 'fuera_ambito')
      checks.push(...obligacionesEstado(s, 'G2'))
      break
    case 'G3': {
      const datasets = s.datasets || []
      const modelos = s.modelos || []
      c('Existe al menos un dataset o fuente documentada', datasets.length > 0)
      c('Todos los datasets tienen origen documentado', datasets.length > 0 && datasets.every((d) => d.origen))
      c(
        'Datos personales evaluados',
        datasets.filter((d) => d.datosPersonales).every((d) => d.evaluacionPrivacidad),
        'Todo dataset con datos personales requiere evaluación de privacidad.'
      )
      const sinModelo = (intake.tiposModelo || []).includes('ninguno')
      c('Todo modelo integrado tiene ficha de modelo', sinModelo || modelos.length > 0)
      c('Las fichas de modelo documentan proveedor, licencia y limitaciones', modelos.every((m) => m.proveedor && m.licencia && m.limitaciones))
      checks.push(...obligacionesEstado(s, 'G3'))
      break
    }
    case 'G4':
      c('Arquitectura documentada', arq.descripcion)
      c('Flujos de datos descritos', arq.flujosDatos)
      c('Logging previsto desde diseño', arq.logging)
      c(
        'Supervisión humana diseñada',
        cls?.nivel !== 'alto' || arq.supervisionHumana,
        'Obligatoria en sistemas de alto riesgo (Art. 14).'
      )
      c('Estrategia de fallback / rollback', arq.fallback)
      c('Diseño de monitorización', arq.monitorizacion)
      checks.push(...obligacionesEstado(s, 'G4'))
      break
    case 'G5':
      c('Existen evidencias de desarrollo vinculadas (commits / PRs)', tieneEvidencia(s, 'Commit / Pull request'))
      c(
        'Los riesgos identificados tienen controles definidos',
        (s.riesgos || []).every((r) => r.controles),
        'Ningún riesgo puede quedar sin control asociado.'
      )
      checks.push(...obligacionesEstado(s, 'G5'))
      break
    case 'G6':
      c('Existen evidencias de pruebas ejecutadas', tieneEvidencia(s, 'Test ejecutado'))
      c(
        'No hay riesgos críticos sin tratar',
        !(s.riesgos || []).some((r) => r.severidad === 'Crítica' && !['Mitigado', 'Aceptado', 'Cerrado'].includes(r.estado)),
        'Bloquea release si existen riesgos críticos abiertos (Agente de Riesgos).'
      )
      checks.push(...obligacionesEstado(s, 'G6'))
      break
    case 'G7': {
      c(
        'Expediente técnico generado para la versión actual',
        s.docGeneradaEn && s.docGeneradaEn >= (s.contenidoActualizadoEn || s.updatedAt),
        'Regenera el expediente tras el último cambio sustantivo del sistema.'
      )
      const aplicables = s.clasificacion?.obligaciones || []
      const pendientes = aplicables.filter((id) => (s.obligaciones?.[id]?.estado || 'Pendiente') === 'Pendiente')
      c(
        'Matriz requisito-control-evidencia sin obligaciones en estado Pendiente',
        aplicables.length > 0 && pendientes.length === 0,
        pendientes.length ? `${pendientes.length} obligación(es) pendiente(s).` : ''
      )
      checks.push(...obligacionesEstado(s, 'G7'))
      break
    }
    case 'G8': {
      const residualSinDecidir = (s.riesgos || []).filter(
        (r) => ['Alta', 'Crítica'].includes(r.severidad) && !r.decision
      )
      c(
        'Riesgos residuales altos/críticos con decisión registrada',
        residualSinDecidir.length === 0,
        residualSinDecidir.length ? `${residualSinDecidir.length} riesgo(s) sin decisión de aceptación/mitigación.` : ''
      )
      const aplicables = s.clasificacion?.obligaciones || []
      c(
        'Todas las obligaciones aplicables validadas o justificadas',
        aplicables.length > 0 &&
          aplicables.every((id) => ['Validado', 'No aplica'].includes(s.obligaciones?.[id]?.estado || 'Pendiente'))
      )
      checks.push(...obligacionesEstado(s, 'G8'))
      break
    }
    case 'G9':
      c('Plan de despliegue descrito', arq.planDespliegue)
      c('Plan de rollback descrito', arq.fallback)
      c('Monitorización diseñada y activable', arq.monitorizacion)
      c('Owner operativo designado', s.owner)
      checks.push(...obligacionesEstado(s, 'G9'))
      break
    case 'G10':
      c(
        'No hay cambios sin evaluar tras el despliegue',
        !(s.releases || []).some((r) => r.estado === 'deployed') || !s.cambioPendienteEvaluacion,
        'Todo cambio sobre un sistema desplegado exige evaluación de modificación sustancial.'
      )
      break
    default:
      break
  }
  return checks
}
