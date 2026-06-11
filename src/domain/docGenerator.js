import {
  CATALOGO_OBLIGACIONES,
  ESTADOS_RELEASE,
  NIVELES_RIESGO,
  PRACTICAS_PROHIBIDAS,
  ROLES_REGULATORIOS,
  SECTORES_ANEXO_III,
  TRIGGERS_TRANSPARENCIA,
  NIVELES_AUTONOMIA,
  TIPOS_MODELO,
} from './constants'
import { evaluarGates } from './gates'

const GAP = (texto) => `> ⚠️ **GAP DOCUMENTAL:** ${texto}\n`
const v = (valor, gap) => (valor ? valor : GAP(gap))
const fecha = (iso) => (iso ? new Date(iso).toLocaleString('es-ES') : '—')

// Generador del Technical Documentation File (expediente técnico vivo,
// alineado con el Anexo IV y las 20 secciones del doc 03 §6.2).
export function generarExpedienteTecnico(s) {
  const cls = s.clasificacion
  const arq = s.arquitectura || {}
  const rol = ROLES_REGULATORIOS.find((r) => r.id === (cls?.rol || s.intake?.rol))
  const gates = evaluarGates(s)
  const lineas = []
  const push = (x) => lineas.push(x)

  push(`# Expediente técnico — ${s.nombre}`)
  push('')
  push(`**Versión del sistema:** ${s.version}  `)
  push(`**Fecha de generación:** ${new Date().toLocaleString('es-ES')}  `)
  push(`**Generado por:** Plataforma AI Act-native (documentación viva)  `)
  push(`**Referencia normativa:** Reglamento (UE) 2024/1689, Art. 11 y Anexo IV`)
  push('')
  push('---')

  push('\n## 1. Descripción general del sistema\n')
  push(`- **Nombre:** ${s.nombre}`)
  push(`- **Owner:** ${v(s.owner, 'falta owner del sistema.')}`)
  push(`- **Unidad responsable:** ${v(s.unidad, 'falta unidad responsable.')}`)
  push(`- **Estado del ciclo de vida:** ${s.estado}`)
  push(`- **Descripción:** ${v(s.intake?.descripcion, 'falta descripción del sistema.')}`)

  push('\n## 2. Finalidad prevista\n')
  if (s.finalidad?.declaracion) {
    push(`${s.finalidad.declaracion}\n`)
    push(`- **Decisiones asistidas:** ${s.finalidad.decisionesAsistidas || '—'}`)
    push(`- **Outputs esperados:** ${s.finalidad.outputsEsperados || s.intake?.outputs || '—'}`)
    push(`- **Usos excluidos:** ${s.finalidad.usosExcluidos || '—'}`)
    push(`- **Versión de la finalidad:** ${s.finalidad.version || 1} (versionada para detectar modificaciones sustanciales)`)
  } else {
    push(GAP('no existe Intended Purpose Statement. Bloqueante en Gate 1.'))
  }

  push('\n## 3. Rol regulatorio\n')
  push(rol ? `La organización actúa como: **${rol.label}**.` : GAP('rol regulatorio sin identificar. Bloqueante en Gate 2.'))

  push('\n## 4. Clasificación de riesgo\n')
  if (cls) {
    push(`- **Resultado:** ${NIVELES_RIESGO[cls.nivel]?.label || cls.nivel}`)
    push(`- **¿Sistema de IA (Art. 3.1)?:** ${cls.esSistemaIA ? 'Sí' : 'No'}`)
    push(`- **Motor de clasificación:** v${cls.versionMotor} (${fecha(cls.fecha)})`)
    if (cls.flags?.sectoresAltoRiesgo?.length) {
      push(`- **Ámbitos Anexo III:** ${cls.flags.sectoresAltoRiesgo.map((id) => SECTORES_ANEXO_III.find((x) => x.id === id)?.label).join('; ')}`)
    }
    if (cls.flags?.transparencia?.length) {
      push(`- **Obligaciones de transparencia:** ${cls.flags.transparencia.map((id) => TRIGGERS_TRANSPARENCIA.find((x) => x.id === id)?.label).join('; ')}`)
    }
    push(`- **Integra GPAI:** ${cls.flags?.gpai ? 'Sí' : 'No'}`)
    push('\n**Motivación del motor de clasificación:**\n')
    cls.motivos.forEach((m) => push(`- ${m}`))
  } else {
    push(GAP('clasificación regulatoria no ejecutada. Bloqueante en Gate 2.'))
  }

  push('\n## 5. Arquitectura\n')
  push(v(arq.descripcion, 'arquitectura no documentada. Bloqueante en Gate 4.'))
  push('\n## 6. Componentes y flujos de datos\n')
  push(`- **Componentes:** ${v(arq.componentes, 'mapa de componentes no documentado.')}`)
  push(`- **Flujos de datos:** ${v(arq.flujosDatos, 'flujos de datos no documentados.')}`)

  push('\n## 7. Modelos\n')
  if ((s.modelos || []).length) {
    push('| Modelo | Versión | Proveedor | Tipo | Licencia | Uso previsto | Limitaciones | Dependencia crítica |')
    push('|---|---|---|---|---|---|---|---|')
    s.modelos.forEach((m) =>
      push(`| ${m.nombre} | ${m.version || '—'} | ${m.proveedor || '—'} | ${TIPOS_MODELO.find((t) => t.id === m.tipo)?.label || m.tipo || '—'} | ${m.licencia || '—'} | ${m.usoPrevisto || '—'} | ${m.limitaciones || '—'} | ${m.dependenciaCritica ? 'Sí' : 'No'} |`)
    )
  } else {
    push(GAP('no hay fichas de modelo registradas (Model & Component Registry vacío).'))
  }

  push('\n## 8. Datos\n')
  if ((s.datasets || []).length) {
    push('| Dataset | Origen | Tipología | Datos personales | Cat. especiales | Evaluación privacidad | Calidad / sesgos |')
    push('|---|---|---|---|---|---|---|')
    s.datasets.forEach((d) =>
      push(`| ${d.nombre} | ${d.origen || '—'} | ${d.tipologia || '—'} | ${d.datosPersonales ? 'Sí' : 'No'} | ${d.categoriasEspeciales ? 'Sí' : 'No'} | ${d.evaluacionPrivacidad || (d.datosPersonales ? '⚠️ pendiente' : 'n/a')} | ${d.calidad || '—'} |`)
    )
  } else {
    push(GAP('no hay dataset cards registradas.'))
  }

  push('\n## 9. Desarrollo\n')
  push(`- **Nivel de autonomía:** ${NIVELES_AUTONOMIA.find((a) => a.id === s.intake?.autonomia)?.label || '—'}`)
  push(`- **Inputs:** ${s.intake?.inputs || '—'}`)
  push(`- **Outputs:** ${s.intake?.outputs || '—'}`)
  const commits = (s.evidencias || []).filter((e) => e.tipo === 'Commit / Pull request')
  push(commits.length ? `- **Evidencias de desarrollo:** ${commits.map((e) => e.titulo).join('; ')}` : GAP('sin evidencias de desarrollo vinculadas (commits/PRs).'))

  push('\n## 10. Riesgos\n')
  if ((s.riesgos || []).length) {
    push('| ID | Categoría | Descripción | Severidad | Probabilidad | Controles | Riesgo residual | Decisión | Estado |')
    push('|---|---|---|---|---|---|---|---|---|')
    s.riesgos.forEach((r) =>
      push(`| ${r.id} | ${r.categoria} | ${r.descripcion} | ${r.severidad} | ${r.probabilidad} | ${r.controles || '⚠️'} | ${r.riesgoResidual || '—'} | ${r.decision || '⚠️'} | ${r.estado} |`)
    )
  } else {
    push(GAP('registro de riesgos vacío. Un sistema sin riesgos identificados no es creíble para evaluación de conformidad.'))
  }

  push('\n## 11. Controles y matriz requisito-control-evidencia\n')
  const aplicables = (cls?.obligaciones || []).map((id) => CATALOGO_OBLIGACIONES.find((o) => o.id === id)).filter(Boolean)
  if (aplicables.length) {
    push('| ID obligación | Fuente | Requisito interno | Control | Evidencia esperada | Gate | Estado | Evidencias vinculadas |')
    push('|---|---|---|---|---|---|---|---|')
    aplicables.forEach((o) => {
      const inst = s.obligaciones?.[o.id]
      const evs = (s.evidencias || []).filter((e) => e.vinculo?.tipo === 'obligacion' && e.vinculo.refId === o.id)
      push(`| ${o.id} | ${o.fuente} | ${o.requisitoInterno} | ${o.control} | ${o.evidencia} | ${o.gate} | ${inst?.estado || 'Pendiente'} | ${evs.map((e) => e.titulo).join('; ') || '—'} |`)
    })
  } else {
    push(GAP('no hay obligaciones activadas: ejecuta la clasificación regulatoria.'))
  }

  push('\n## 12. Supervisión humana\n')
  push(v(arq.supervisionHumana, cls?.nivel === 'alto' ? 'supervisión humana no diseñada. Obligatoria (Art. 14) y bloqueante en Gate 4.' : 'supervisión humana no documentada.'))

  push('\n## 13. Logs\n')
  push(v(arq.logging, 'diseño de logging no documentado. Bloqueante en Gate 4 (Art. 12).'))

  push('\n## 14. Transparencia e instrucciones de uso\n')
  push(v(arq.instruccionesUso, 'instrucciones de uso no redactadas (Art. 13).'))

  push('\n## 15. Pruebas\n')
  const tests = (s.evidencias || []).filter((e) => e.tipo === 'Test ejecutado')
  if (tests.length) {
    tests.forEach((e) => push(`- **${e.titulo}** (${fecha(e.fecha)}): ${e.descripcion || ''} ${e.enlace ? `[enlace](${e.enlace})` : ''}`))
  } else {
    push(GAP('sin evidencias de pruebas ejecutadas. Bloqueante en Gate 6.'))
  }

  push('\n## 16. Ciberseguridad\n')
  push(v(arq.ciberseguridad, 'evaluación de ciberseguridad no documentada (Art. 15): threat model, vulnerabilidades y ataques específicos de IA.'))

  push('\n## 17. Cambios\n')
  if ((s.auditLog || []).length) {
    push('Historial de eventos del expediente (compliance log):\n')
    s.auditLog.slice(-30).forEach((l) => push(`- ${fecha(l.fecha)} — **${l.accion}**: ${l.detalle}`))
  } else {
    push('Sin cambios registrados.')
  }

  push('\n## 18. Evaluación de conformidad y gates\n')
  push('| Gate | Estado | Aprobador | Fecha |')
  push('|---|---|---|---|')
  gates.forEach((g) =>
    push(`| ${g.nombre} | ${g.estado.toUpperCase()} | ${g.aprobacion?.aprobador || '—'} | ${g.aprobacion?.fecha ? fecha(g.aprobacion.fecha) : '—'} |`)
  )

  push('\n## 19. Releases y monitorización\n')
  if ((s.releases || []).length) {
    push('| Versión | Estado | Creada | Decisión | Condiciones |')
    push('|---|---|---|---|---|')
    s.releases.forEach((r) =>
      push(`| ${r.version} | ${ESTADOS_RELEASE[r.estado]} | ${fecha(r.creadoEn)} | ${r.aprobador || '—'} | ${r.condiciones || '—'} |`)
    )
  } else {
    push('Sin releases registradas.')
  }
  push('')
  push(`**Plan de monitorización post-despliegue:** ${arq.monitorizacion || '⚠️ GAP: pendiente de diseño.'}`)

  push('\n## 20. Incidentes\n')
  const incidentes = (s.evidencias || []).filter((e) => e.tipo === 'Log / registro' && /incidente/i.test(e.titulo))
  push(incidentes.length ? incidentes.map((e) => `- ${e.titulo}: ${e.descripcion}`).join('\n') : 'Sin incidentes registrados.')

  push('\n---')
  push('\n## Anexo — Screening de prácticas prohibidas (Art. 5)\n')
  if (s.intake?.screeningCompleto) {
    PRACTICAS_PROHIBIDAS.forEach((p) =>
      push(`- ${p.label}: **${s.intake.screening?.[p.id] ? '⛔ SÍ — bloqueo' : 'No'}**`)
    )
  } else {
    push(GAP('screening de prácticas prohibidas no completado.'))
  }
  push('')
  push('> Este expediente es un documento vivo generado automáticamente. Toda afirmación relevante debe estar respaldada por una evidencia; las ausencias figuran como gaps documentales.')

  return lineas.join('\n')
}

export function descargarMarkdown(nombreFichero, contenido) {
  const blob = new Blob([contenido], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombreFichero
  a.click()
  URL.revokeObjectURL(url)
}
