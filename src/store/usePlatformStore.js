import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { clasificarSistema } from '../domain/classification'
import { gatesParaRelease } from '../domain/gates'

const ahora = () => new Date().toISOString()
const uid = (prefijo) => `${prefijo}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase()

const sistemaVacio = () => ({
  id: uid('SYS'),
  nombre: '',
  version: '0.1.0',
  owner: '',
  unidad: '',
  estado: 'idea',
  createdAt: ahora(),
  updatedAt: ahora(),
  contenidoActualizadoEn: ahora(),
  intake: { completo: false, screening: {}, transparencia: {}, sectores: [], tiposModelo: [] },
  finalidad: { version: 0, historial: [] },
  clasificacion: null,
  obligaciones: {},
  datasets: [],
  modelos: [],
  riesgos: [],
  evidencias: [],
  arquitectura: {},
  gates: {},
  releases: [],
  auditLog: [],
  docGeneradaEn: null,
  cambioPendienteEvaluacion: false,
})

export const usePlatformStore = create(
  persist(
    (set, get) => ({
      sistemas: [],

      // Mutación genérica con sello temporal y entrada de auditoría (compliance log).
      // `sustantivo: false` marca actos de gobierno (aprobaciones, decisiones de
      // release, generación de doc) que no desactualizan el expediente técnico.
      _mutar(id, updater, audit, { sustantivo = true } = {}) {
        set((st) => ({
          sistemas: st.sistemas.map((s) => {
            if (s.id !== id) return s
            const actualizado = updater({ ...s })
            actualizado.updatedAt = ahora()
            if (sustantivo) actualizado.contenidoActualizadoEn = ahora()
            if (audit) {
              actualizado.auditLog = [...(actualizado.auditLog || []), { fecha: ahora(), ...audit }]
            }
            return actualizado
          }),
        }))
      },

      crearSistemaDesdeIntake(datos) {
        const s = sistemaVacio()
        s.nombre = datos.nombre
        s.owner = datos.owner
        s.unidad = datos.unidad
        s.intake = { ...s.intake, ...datos.intake, completo: true, screeningCompleto: true }
        s.finalidad = {
          declaracion: datos.intake.finalidadPreliminar,
          outputsEsperados: datos.intake.outputs,
          usosExcluidos: datos.intake.usosExcluidos,
          decisionesAsistidas: '',
          version: 1,
          historial: [{ version: 1, fecha: ahora(), declaracion: datos.intake.finalidadPreliminar }],
        }
        s.clasificacion = clasificarSistema(s.intake)
        s.clasificacion.obligaciones.forEach((oid) => {
          s.obligaciones[oid] = { estado: 'Pendiente', responsable: '', justificacionNA: '' }
        })
        if (s.clasificacion.nivel === 'prohibido') s.estado = 'idea'
        else s.estado = 'diseno'
        s.auditLog = [
          { fecha: ahora(), accion: 'Intake completado', detalle: 'AI System Intake Record creado mediante intake conversacional.' },
          {
            fecha: ahora(),
            accion: 'Clasificación regulatoria',
            detalle: `Motor v${s.clasificacion.versionMotor}: nivel «${s.clasificacion.nivel}», ${s.clasificacion.obligaciones.length} obligaciones activadas.`,
          },
        ]
        set((st) => ({ sistemas: [...st.sistemas, s] }))
        return s.id
      },

      actualizarFicha(id, patch) {
        get()._mutar(id, (s) => ({ ...s, ...patch }), { accion: 'Ficha actualizada', detalle: Object.keys(patch).join(', ') })
      },

      actualizarIntake(id, patch) {
        get()._mutar(id, (s) => ({ ...s, intake: { ...s.intake, ...patch } }), {
          accion: 'Intake actualizado',
          detalle: Object.keys(patch).join(', '),
        })
      },

      actualizarFinalidad(id, patch) {
        get()._mutar(
          id,
          (s) => {
            const nuevaVersion = (s.finalidad.version || 0) + (patch.declaracion && patch.declaracion !== s.finalidad.declaracion ? 1 : 0)
            const finalidad = { ...s.finalidad, ...patch, version: nuevaVersion || s.finalidad.version || 1 }
            if (nuevaVersion > (s.finalidad.version || 0)) {
              finalidad.historial = [...(s.finalidad.historial || []), { version: nuevaVersion, fecha: ahora(), declaracion: patch.declaracion }]
            }
            return { ...s, finalidad, cambioPendienteEvaluacion: s.releases.some((r) => r.estado === 'deployed') ? true : s.cambioPendienteEvaluacion }
          },
          { accion: 'Finalidad prevista actualizada', detalle: 'La finalidad se versiona para detectar modificaciones sustanciales.' }
        )
      },

      reclasificar(id) {
        get()._mutar(
          id,
          (s) => {
            const cls = clasificarSistema(s.intake)
            const obligaciones = { ...s.obligaciones }
            cls.obligaciones.forEach((oid) => {
              if (!obligaciones[oid]) obligaciones[oid] = { estado: 'Pendiente', responsable: '', justificacionNA: '' }
            })
            return { ...s, clasificacion: cls, obligaciones }
          },
          { accion: 'Reclasificación ejecutada', detalle: 'El motor de clasificación se ha vuelto a ejecutar sobre el intake vigente.' }
        )
      },

      actualizarArquitectura(id, patch) {
        get()._mutar(id, (s) => ({ ...s, arquitectura: { ...s.arquitectura, ...patch } }), {
          accion: 'Arquitectura actualizada',
          detalle: Object.keys(patch).join(', '),
        })
      },

      guardarDataset(id, dataset) {
        get()._mutar(
          id,
          (s) => {
            const existe = s.datasets.some((d) => d.id === dataset.id)
            return { ...s, datasets: existe ? s.datasets.map((d) => (d.id === dataset.id ? dataset : d)) : [...s.datasets, { ...dataset, id: uid('DS') }] }
          },
          { accion: 'Dataset card', detalle: `Dataset «${dataset.nombre}» registrado/actualizado.` }
        )
      },

      eliminarDataset(id, dsId) {
        get()._mutar(id, (s) => ({ ...s, datasets: s.datasets.filter((d) => d.id !== dsId) }), {
          accion: 'Dataset eliminado',
          detalle: dsId,
        })
      },

      guardarModelo(id, modelo) {
        get()._mutar(
          id,
          (s) => {
            const existe = s.modelos.some((m) => m.id === modelo.id)
            return { ...s, modelos: existe ? s.modelos.map((m) => (m.id === modelo.id ? modelo : m)) : [...s.modelos, { ...modelo, id: uid('MDL') }] }
          },
          { accion: 'Model card', detalle: `Modelo «${modelo.nombre}» registrado/actualizado.` }
        )
      },

      eliminarModelo(id, mId) {
        get()._mutar(id, (s) => ({ ...s, modelos: s.modelos.filter((m) => m.id !== mId) }), {
          accion: 'Modelo eliminado',
          detalle: mId,
        })
      },

      guardarRiesgo(id, riesgo) {
        get()._mutar(
          id,
          (s) => {
            const existe = s.riesgos.some((r) => r.id === riesgo.id)
            return { ...s, riesgos: existe ? s.riesgos.map((r) => (r.id === riesgo.id ? riesgo : r)) : [...s.riesgos, { ...riesgo, id: uid('RSK') }] }
          },
          { accion: 'Riesgo registrado', detalle: `${riesgo.categoria}: ${riesgo.descripcion?.slice(0, 80)}` }
        )
      },

      eliminarRiesgo(id, rId) {
        get()._mutar(id, (s) => ({ ...s, riesgos: s.riesgos.filter((r) => r.id !== rId) }), {
          accion: 'Riesgo eliminado',
          detalle: rId,
        })
      },

      actualizarObligacion(id, oblId, patch) {
        get()._mutar(
          id,
          (s) => ({ ...s, obligaciones: { ...s.obligaciones, [oblId]: { ...s.obligaciones[oblId], ...patch } } }),
          { accion: 'Obligación actualizada', detalle: `${oblId} → ${patch.estado || 'editada'}` }
        )
      },

      agregarEvidencia(id, evidencia) {
        get()._mutar(
          id,
          (s) => ({ ...s, evidencias: [...s.evidencias, { ...evidencia, id: uid('EVD'), fecha: ahora() }] }),
          { accion: 'Evidencia registrada', detalle: `${evidencia.tipo}: ${evidencia.titulo}` }
        )
      },

      eliminarEvidencia(id, evId) {
        get()._mutar(id, (s) => ({ ...s, evidencias: s.evidencias.filter((e) => e.id !== evId) }), {
          accion: 'Evidencia eliminada',
          detalle: evId,
        })
      },

      aprobarGate(id, gateId, aprobador, notas) {
        get()._mutar(
          id,
          (s) => ({ ...s, gates: { ...s.gates, [gateId]: { aprobado: true, aprobador, notas, fecha: ahora() } } }),
          { accion: `Gate ${gateId} aprobado`, detalle: `Aprobador: ${aprobador}. ${notas || ''}` },
          { sustantivo: false }
        )
      },

      revocarGate(id, gateId, motivo) {
        get()._mutar(
          id,
          (s) => {
            const gates = { ...s.gates }
            delete gates[gateId]
            return { ...s, gates }
          },
          { accion: `Gate ${gateId} revocado`, detalle: motivo || 'Aprobación retirada.' },
          { sustantivo: false }
        )
      },

      marcarDocGenerada(id) {
        get()._mutar(
          id,
          (s) => ({ ...s, docGeneradaEn: ahora() }),
          { accion: 'Expediente técnico generado', detalle: 'Technical Documentation File exportado en Markdown.' },
          { sustantivo: false }
        )
      },

      crearRelease(id, version, notas) {
        get()._mutar(
          id,
          (s) => ({
            ...s,
            releases: [
              ...s.releases,
              { id: uid('REL'), version, notas, estado: 'draft', creadoEn: ahora(), historial: [{ fecha: ahora(), evento: 'Creada en estado borrador' }] },
            ],
          }),
          { accion: 'Release creada', detalle: `Versión ${version} en borrador.` },
          { sustantivo: false }
        )
      },

      // Flujo de aprobación de release: valida gates y registra decisión.
      decidirRelease(id, relId, aprobador, condiciones) {
        const sistema = get().sistemas.find((s) => s.id === id)
        const { bloqueados, pendientes } = gatesParaRelease(sistema)
        let estado, evento
        if (bloqueados.length > 0) {
          estado = 'blocked'
          evento = `Bloqueada: ${bloqueados.length} gate(s) con checks incumplidos (${bloqueados.map((g) => g.id).join(', ')}).`
        } else if (pendientes.length > 0) {
          if (!condiciones) {
            estado = 'blocked'
            evento = `Bloqueada: ${pendientes.length} gate(s) sin aprobación humana (${pendientes.map((g) => g.id).join(', ')}). Una aprobación condicionada exige condiciones explícitas.`
          } else {
            estado = 'conditionally_approved'
            evento = `Aprobada con condiciones por ${aprobador}: ${condiciones}`
          }
        } else {
          estado = 'approved'
          evento = `Aprobada por ${aprobador}: todos los gates superados.`
        }
        get()._mutar(
          id,
          (s) => ({
            ...s,
            releases: s.releases.map((r) =>
              r.id === relId
                ? { ...r, estado, aprobador: estado !== 'blocked' ? aprobador : r.aprobador, condiciones, decididoEn: ahora(), historial: [...r.historial, { fecha: ahora(), evento }] }
                : r
            ),
          }),
          { accion: 'Decisión de release', detalle: evento },
          { sustantivo: false }
        )
        return { estado, evento }
      },

      desplegarRelease(id, relId) {
        get()._mutar(
          id,
          (s) => ({
            ...s,
            estado: 'produccion',
            version: s.releases.find((r) => r.id === relId)?.version || s.version,
            releases: s.releases.map((r) =>
              r.id === relId
                ? { ...r, estado: 'deployed', historial: [...r.historial, { fecha: ahora(), evento: 'Desplegada en producción' }] }
                : r
            ),
          }),
          { accion: 'Release desplegada', detalle: 'Despliegue controlado registrado. Se activa monitorización post-market y Gate 10 para cambios.' },
          { sustantivo: false }
        )
      },

      revertirRelease(id, relId, motivo) {
        get()._mutar(
          id,
          (s) => ({
            ...s,
            releases: s.releases.map((r) =>
              r.id === relId ? { ...r, estado: 'rolled_back', historial: [...r.historial, { fecha: ahora(), evento: `Rollback: ${motivo}` }] } : r
            ),
          }),
          { accion: 'Rollback ejecutado', detalle: motivo }
        )
      },

      eliminarSistema(id) {
        set((st) => ({ sistemas: st.sistemas.filter((s) => s.id !== id) }))
      },
    }),
    { name: 'plataforma-ai-act-native' }
  )
)
