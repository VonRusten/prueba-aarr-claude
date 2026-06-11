// Contenido regulatorio versionado de la plataforma (Regulatory Content Management).
// Fuente: Reglamento (UE) 2024/1689 y documentos de diseño en /docs.

export const VERSION_MOTOR_CLASIFICACION = '1.0.0'

export const NIVELES_RIESGO = {
  fuera_ambito: { id: 'fuera_ambito', label: 'Fuera de ámbito (no es sistema de IA)', color: 'gris' },
  prohibido: { id: 'prohibido', label: 'Práctica prohibida (Art. 5)', color: 'negro' },
  alto: { id: 'alto', label: 'Alto riesgo (Art. 6 / Anexo III)', color: 'rojo' },
  transparencia: { id: 'transparencia', label: 'Obligaciones de transparencia (Art. 50)', color: 'ambar' },
  minimo: { id: 'minimo', label: 'Riesgo limitado o mínimo', color: 'verde' },
}

export const ROLES_REGULATORIOS = [
  { id: 'proveedor', label: 'Proveedor (desarrolla y comercializa el sistema)' },
  { id: 'deployer', label: 'Responsable del despliegue (deployer)' },
  { id: 'importador', label: 'Importador' },
  { id: 'distribuidor', label: 'Distribuidor' },
  { id: 'downstream', label: 'Proveedor downstream (integra un modelo GPAI de tercero)' },
]

export const NIVELES_AUTONOMIA = [
  { id: 'reglas', label: 'Reglas fijas programadas (sin inferencia)' },
  { id: 'asistencia', label: 'Asistencia / recomendación con revisión humana' },
  { id: 'decision', label: 'Decisión automatizada' },
  { id: 'agente', label: 'Agente autónomo que ejecuta acciones' },
]

export const PRACTICAS_PROHIBIDAS = [
  { id: 'pp_subliminal', label: 'Manipulación subliminal o deliberadamente engañosa que distorsione el comportamiento' },
  { id: 'pp_vulnerabilidades', label: 'Explotación de vulnerabilidades por edad, discapacidad o situación social' },
  { id: 'pp_social_scoring', label: 'Puntuación social (social scoring) con trato perjudicial injustificado' },
  { id: 'pp_prediccion_delito', label: 'Predicción individual de conducta delictiva basada únicamente en perfilado' },
  { id: 'pp_scraping_facial', label: 'Scraping indiscriminado de imágenes faciales para bases de reconocimiento' },
  { id: 'pp_emociones_trabajo', label: 'Reconocimiento de emociones en el trabajo o la educación (salvo excepción médica/seguridad)' },
  { id: 'pp_categorizacion_biometrica', label: 'Categorización biométrica para inferir datos sensibles (raza, opinión, orientación...)' },
  { id: 'pp_biometria_remota', label: 'Identificación biométrica remota en tiempo real en espacios públicos con fines policiales' },
]

export const SECTORES_ANEXO_III = [
  { id: 'biometria', label: 'Biometría (identificación, categorización, reconocimiento de emociones)' },
  { id: 'infraestructura', label: 'Infraestructuras críticas (suministros, tráfico, energía...)' },
  { id: 'educacion', label: 'Educación y formación (acceso, evaluación, supervisión de exámenes)' },
  { id: 'empleo', label: 'Empleo y gestión de trabajadores (selección, promoción, despido, monitorización)' },
  { id: 'servicios_esenciales', label: 'Servicios esenciales (crédito, seguros, prestaciones, emergencias)' },
  { id: 'law_enforcement', label: 'Aplicación de la ley' },
  { id: 'migracion', label: 'Migración, asilo y control fronterizo' },
  { id: 'justicia', label: 'Administración de justicia y procesos democráticos' },
]

export const TRIGGERS_TRANSPARENCIA = [
  { id: 't_interaccion', label: 'Interactúa directamente con personas físicas (p. ej. chatbot, asistente)' },
  { id: 't_contenido', label: 'Genera contenido sintético (texto, imagen, audio, vídeo, deepfakes)' },
  { id: 't_emociones', label: 'Realiza reconocimiento de emociones' },
  { id: 't_biometria_cat', label: 'Realiza categorización biométrica' },
]

export const TIPOS_MODELO = [
  { id: 'ninguno', label: 'Sin modelo de IA (solo reglas o lógica programada)' },
  { id: 'propio', label: 'Modelo propio entrenado a medida' },
  { id: 'tercero', label: 'Modelo de tercero (API o licencia comercial)' },
  { id: 'open_source', label: 'Modelo open source' },
  { id: 'gpai', label: 'Modelo de propósito general / LLM (GPAI)' },
  { id: 'fine_tuned', label: 'Modelo GPAI con fine-tuning propio' },
]

export const CATEGORIAS_RIESGO = [
  'Derechos fundamentales',
  'Salud y seguridad',
  'Protección de datos',
  'Seguridad (adversarial, prompt injection, poisoning)',
  'Robustez (drift, degradación, OOD)',
  'Transparencia',
  'Supervisión humana',
  'Terceros y proveedores',
  'Propiedad intelectual',
  'Operacional',
  'Cumplimiento sectorial',
]

export const SEVERIDADES = ['Baja', 'Media', 'Alta', 'Crítica']
export const PROBABILIDADES = ['Baja', 'Media', 'Alta']

export const ESTADOS_OBLIGACION = ['Pendiente', 'En curso', 'Validado', 'No aplica']

export const ESTADOS_SISTEMA = [
  { id: 'idea', label: 'Idea' },
  { id: 'diseno', label: 'Diseño' },
  { id: 'desarrollo', label: 'Desarrollo' },
  { id: 'validacion', label: 'Validación' },
  { id: 'produccion', label: 'Producción' },
  { id: 'retirado', label: 'Retirado' },
]

export const ESTADOS_RELEASE = {
  draft: 'Borrador',
  in_validation: 'En validación',
  blocked: 'Bloqueada por gate',
  conditionally_approved: 'Aprobada con condiciones',
  approved: 'Aprobada',
  deployed: 'Desplegada',
  rolled_back: 'Revertida',
  retired: 'Retirada',
}

export const TIPOS_EVIDENCIA = [
  'Documento',
  'Test ejecutado',
  'Commit / Pull request',
  'Dataset card',
  'Model card',
  'Informe de evaluación',
  'Decisión aprobatoria',
  'Log / registro',
]

// Catálogo de obligaciones: matriz requisito-control-evidencia (compliance as code).
// aplicabilidad: niveles de riesgo o flags que activan la obligación.
export const CATALOGO_OBLIGACIONES = [
  {
    id: 'RIA-GEN-ART04-001',
    fuente: 'Art. 4',
    obligacion: 'Alfabetización en materia de IA del personal que opera el sistema',
    requisitoInterno: 'El personal implicado debe tener formación documentada en IA y sus riesgos',
    control: 'Registro de formación y alfabetización en IA',
    evidencia: 'Registro de formación del equipo',
    gate: 'G8',
    aplicabilidad: ['todos'],
  },
  {
    id: 'RIA-GEN-ART05-001',
    fuente: 'Art. 5',
    obligacion: 'Screening de prácticas prohibidas antes del desarrollo',
    requisitoInterno: 'Todo caso de uso debe superar el cuestionario de prácticas prohibidas',
    control: 'Cuestionario obligatorio de prácticas prohibidas en el intake',
    evidencia: 'Prohibited Practices Assessment',
    gate: 'G2',
    aplicabilidad: ['todos'],
  },
  {
    id: 'RIA-HR-ART09-001',
    fuente: 'Art. 9',
    obligacion: 'Sistema de gestión de riesgos durante todo el ciclo de vida',
    requisitoInterno: 'Registro de riesgos vivo con controles, propietarios y riesgo residual',
    control: 'Risk register integrado con revisión por release',
    evidencia: 'AI Risk Management File / Risk Register',
    gate: 'G8',
    aplicabilidad: ['alto'],
  },
  {
    id: 'RIA-HR-ART10-001',
    fuente: 'Art. 10',
    obligacion: 'Gobernanza y calidad de los datos de entrenamiento, validación y prueba',
    requisitoInterno: 'Todo dataset debe tener ficha con origen, calidad, sesgos y linaje',
    control: 'Dataset cards obligatorias y evaluación de datos personales',
    evidencia: 'Dataset Card + Data Quality Report',
    gate: 'G3',
    aplicabilidad: ['alto'],
  },
  {
    id: 'RIA-HR-ART11-001',
    fuente: 'Art. 11 / Anexo IV',
    obligacion: 'Documentación técnica completa y actualizada',
    requisitoInterno: 'El expediente técnico debe generarse y mantenerse vivo',
    control: 'Generador automático de expediente técnico',
    evidencia: 'Technical Documentation File versionado',
    gate: 'G7',
    aplicabilidad: ['alto'],
  },
  {
    id: 'RIA-HR-ART12-001',
    fuente: 'Art. 12',
    obligacion: 'Registro automático de eventos (logs) durante el funcionamiento',
    requisitoInterno: 'El sistema debe registrar eventos relevantes de forma trazable',
    control: 'Diseño de logging estructurado desde arquitectura',
    evidencia: 'Logging Design + pruebas de logging',
    gate: 'G4',
    aplicabilidad: ['alto'],
  },
  {
    id: 'RIA-HR-ART13-001',
    fuente: 'Art. 13',
    obligacion: 'Transparencia e instrucciones de uso para deployers',
    requisitoInterno: 'Deben existir instrucciones de uso con limitaciones e interpretación de outputs',
    control: 'Generación de Instructions for Use',
    evidencia: 'Instructions for Use / Deployer Manual',
    gate: 'G7',
    aplicabilidad: ['alto'],
  },
  {
    id: 'RIA-HR-ART14-001',
    fuente: 'Art. 14',
    obligacion: 'Supervisión humana efectiva',
    requisitoInterno: 'Debe diseñarse intervención humana con override, escalado y parada segura',
    control: 'Human Oversight Design Card + workflow de revisión',
    evidencia: 'Human Oversight Design Card',
    gate: 'G4',
    aplicabilidad: ['alto'],
  },
  {
    id: 'RIA-HR-ART15-001',
    fuente: 'Art. 15',
    obligacion: 'Precisión, robustez y ciberseguridad',
    requisitoInterno: 'Deben probarse precisión, robustez y resistencia a ataques específicos de IA',
    control: 'Test suite de precisión, robustez y seguridad (incl. prompt injection)',
    evidencia: 'Testing & Validation Report + Security Assessment',
    gate: 'G6',
    aplicabilidad: ['alto'],
  },
  {
    id: 'RIA-HR-ART17-001',
    fuente: 'Art. 17',
    obligacion: 'Sistema de gestión de calidad del proveedor',
    requisitoInterno: 'Los procedimientos de desarrollo, validación y cambios deben estar gobernados',
    control: 'Gates obligatorios y registro de decisiones de la plataforma',
    evidencia: 'Registro de gates, decisiones y aprobaciones',
    gate: 'G8',
    aplicabilidad: ['alto'],
  },
  {
    id: 'RIA-HR-ART27-001',
    fuente: 'Art. 27',
    obligacion: 'Evaluación de impacto en derechos fundamentales (FRIA) cuando proceda',
    requisitoInterno: 'Debe evaluarse el impacto sobre personas afectadas y derechos fundamentales',
    control: 'Matriz común de afectación (FRIA/EIPD)',
    evidencia: 'Fundamental Rights Impact Assessment',
    gate: 'G8',
    aplicabilidad: ['alto'],
  },
  {
    id: 'RIA-HR-ART43-001',
    fuente: 'Art. 43',
    obligacion: 'Evaluación de conformidad antes de la puesta en servicio',
    requisitoInterno: 'Debe completarse el paquete de conformidad con evidencias y aprobaciones',
    control: 'Conformity readiness check en release governance',
    evidencia: 'Conformity Readiness Report',
    gate: 'G8',
    aplicabilidad: ['alto'],
  },
  {
    id: 'RIA-HR-ART72-001',
    fuente: 'Art. 72',
    obligacion: 'Plan de monitorización post-comercialización',
    requisitoInterno: 'Debe existir plan de monitorización con métricas, drift e incidentes',
    control: 'Monitoring design + plan post-market en release',
    evidencia: 'Post-market Monitoring Plan',
    gate: 'G9',
    aplicabilidad: ['alto'],
  },
  {
    id: 'RIA-HR-ART73-001',
    fuente: 'Art. 73',
    obligacion: 'Notificación de incidentes graves',
    requisitoInterno: 'Debe existir procedimiento de registro, evaluación y notificación de incidentes',
    control: 'Incident register con evaluación de gravedad',
    evidencia: 'Incident Management Procedure',
    gate: 'G9',
    aplicabilidad: ['alto'],
  },
  {
    id: 'RIA-T-ART50-001',
    fuente: 'Art. 50.1',
    obligacion: 'Informar a las personas de que interactúan con un sistema de IA',
    requisitoInterno: 'La interfaz debe mostrar aviso claro de interacción con IA',
    control: 'User notice integrado en UX',
    evidencia: 'User Notice Pack / captura de interfaz',
    gate: 'G7',
    aplicabilidad: ['flag:t_interaccion'],
  },
  {
    id: 'RIA-T-ART50-002',
    fuente: 'Art. 50.2',
    obligacion: 'Marcar el contenido generado o manipulado por IA',
    requisitoInterno: 'El contenido sintético debe ser identificable (etiquetado/marcado)',
    control: 'Etiquetado de outputs generados',
    evidencia: 'Especificación de marcado + prueba',
    gate: 'G7',
    aplicabilidad: ['flag:t_contenido'],
  },
  {
    id: 'RIA-T-ART50-003',
    fuente: 'Art. 50.3',
    obligacion: 'Informar de la exposición a reconocimiento de emociones o categorización biométrica',
    requisitoInterno: 'Las personas expuestas deben ser informadas del funcionamiento del sistema',
    control: 'Information notice específico',
    evidencia: 'Information Notice Requirements',
    gate: 'G7',
    aplicabilidad: ['flag:t_emociones', 'flag:t_biometria_cat'],
  },
  {
    id: 'RIA-GPAI-DWN-001',
    fuente: 'Arts. 53-55 (cadena de valor)',
    obligacion: 'Obtener y evaluar la documentación del proveedor del modelo GPAI',
    requisitoInterno: 'Todo modelo GPAI integrado debe tener model card y documentación del proveedor',
    control: 'Ficha de modelo obligatoria con due diligence de tercero',
    evidencia: 'Model Card + Third-Party Model Assessment',
    gate: 'G3',
    aplicabilidad: ['flag:gpai'],
  },
  {
    id: 'RIA-GPAI-DWN-002',
    fuente: 'Cadena de valor GPAI',
    obligacion: 'Evaluar limitaciones y riesgos del modelo GPAI en el uso previsto',
    requisitoInterno: 'Deben probarse las limitaciones del modelo en el contexto de la finalidad prevista',
    control: 'Evaluaciones propias: benchmarks y red teaming del uso concreto',
    evidencia: 'Informe de evaluación del modelo en contexto',
    gate: 'G6',
    aplicabilidad: ['flag:gpai'],
  },
  {
    id: 'RGPD-EIPD-001',
    fuente: 'RGPD Art. 35',
    obligacion: 'Evaluación de impacto en protección de datos (EIPD/DPIA) cuando haya alto riesgo para derechos',
    requisitoInterno: 'El tratamiento de datos personales debe estar evaluado antes de usar datos reales',
    control: 'Privacy assessment vinculado a datasets con datos personales',
    evidencia: 'DPIA Input Pack / Privacy Assessment',
    gate: 'G3',
    aplicabilidad: ['flag:datos_personales'],
  },
  {
    id: 'RIA-MIN-ART95-001',
    fuente: 'Art. 95',
    obligacion: 'Códigos de conducta y buenas prácticas voluntarias',
    requisitoInterno: 'Aplicar buenas prácticas proporcionales: documentación básica y revisión interna',
    control: 'Ficha de sistema y documentación proporcional',
    evidencia: 'AI System Card',
    gate: 'G7',
    aplicabilidad: ['minimo', 'transparencia'],
  },
]

// Definición de los 11 gates de la Capa de control (doc 03, §4).
export const GATES = [
  { id: 'G0', nombre: 'Gate 0 — Idea válida', objetivo: 'Verificar que la idea puede entrar en la plataforma.' },
  { id: 'G1', nombre: 'Gate 1 — Intake y finalidad prevista', objetivo: 'Asegurar que existe una finalidad prevista clara.' },
  { id: 'G2', nombre: 'Gate 2 — Clasificación regulatoria', objetivo: 'Determinar obligaciones aplicables.' },
  { id: 'G3', nombre: 'Gate 3 — Datos y modelos', objetivo: 'Asegurar que los datos y modelos están identificados y gobernados.' },
  { id: 'G4', nombre: 'Gate 4 — Arquitectura y diseño', objetivo: 'Validar que el sistema puede cumplir desde diseño.' },
  { id: 'G5', nombre: 'Gate 5 — Desarrollo', objetivo: 'Asegurar que el desarrollo es trazable.' },
  { id: 'G6', nombre: 'Gate 6 — Testing y validación', objetivo: 'Comprobar que la funcionalidad cumple los criterios definidos.' },
  { id: 'G7', nombre: 'Gate 7 — Documentación técnica', objetivo: 'Asegurar que el expediente técnico está actualizado.' },
  { id: 'G8', nombre: 'Gate 8 — Conformidad y aprobación', objetivo: 'Verificar preparación para puesta en servicio.' },
  { id: 'G9', nombre: 'Gate 9 — Despliegue', objetivo: 'Controlar la salida a producción.' },
  { id: 'G10', nombre: 'Gate 10 — Cambio y reevaluación', objetivo: 'Controlar modificaciones posteriores al despliegue.' },
]
