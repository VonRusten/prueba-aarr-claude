import {
  NIVELES_AUTONOMIA,
  PRACTICAS_PROHIBIDAS,
  ROLES_REGULATORIOS,
  SECTORES_ANEXO_III,
  TIPOS_MODELO,
  TRIGGERS_TRANSPARENCIA,
} from './constants'

// Guion del Agente de Intake y Finalidad Prevista (doc 02 §5):
// transforma la descripción del usuario en un AI System Intake Record
// preguntando solo lo imprescindible, paso a paso.
export const PASOS_INTAKE = [
  {
    key: 'nombre',
    tipo: 'text',
    pregunta: '¿Qué nombre quieres dar al sistema de IA?',
    porQue: 'Todo sistema debe existir como registro maestro identificable (AI System Registry).',
  },
  {
    key: 'descripcion',
    tipo: 'textarea',
    pregunta: 'Describe con tus palabras qué quieres construir. Cuanto más contexto, mejor: analizaré tu descripción para detectar implicaciones regulatorias.',
    porQue: 'La plataforma estructura tu intención antes de permitir el desarrollo (vibe coding regulado).',
    analizar: true,
  },
  {
    key: 'finalidadPreliminar',
    tipo: 'textarea',
    pregunta: '¿Cuál es la finalidad prevista del sistema? ¿Para qué se diseña exactamente y qué decisiones asiste?',
    porQue: 'La finalidad prevista es la pieza central del Reglamento de IA: determina clasificación, obligaciones y límites de uso.',
  },
  {
    key: 'usuarios',
    tipo: 'text',
    pregunta: '¿Quiénes serán los usuarios del sistema? (internos, externos, profesionales, consumidores...)',
    porQue: 'Identificar usuarios es evidencia mínima del Gate 1.',
  },
  {
    key: 'afectados',
    tipo: 'text',
    pregunta: '¿Qué personas físicas pueden verse afectadas por los outputs? (clientes, empleados, candidatos, menores, colectivos vulnerables...)',
    porQue: 'El enfoque basado en riesgo gira en torno a las personas afectadas.',
  },
  {
    key: 'inputs',
    tipo: 'text',
    pregunta: '¿Qué datos, documentos, señales o variables recibirá el sistema como entrada?',
    porQue: 'Los inputs determinan la gobernanza de datos y la evaluación de privacidad.',
  },
  {
    key: 'outputs',
    tipo: 'text',
    pregunta: '¿Qué generará el sistema? (predicciones, recomendaciones, decisiones, clasificaciones, contenidos, puntuaciones, acciones...)',
    porQue: 'El tipo de output condiciona si existe sistema de IA y su nivel de riesgo.',
  },
  {
    key: 'autonomia',
    tipo: 'choice',
    opciones: NIVELES_AUTONOMIA,
    pregunta: '¿Qué grado de autonomía tendrá el sistema?',
    porQue: 'La autonomía distingue un sistema de IA de un software de reglas fijas (Art. 3.1).',
  },
  {
    key: 'tiposModelo',
    tipo: 'multichoice',
    opciones: TIPOS_MODELO,
    pregunta: '¿Qué tipo de modelos de IA prevés integrar? (puedes elegir varios)',
    porQue: 'Integrar un modelo GPAI/LLM activa obligaciones de la cadena de valor.',
  },
  {
    key: 'sectores',
    tipo: 'multichoice',
    opciones: [...SECTORES_ANEXO_III, { id: 'ninguno', label: 'Ninguno de los anteriores' }],
    pregunta: '¿El sistema se usará en alguno de estos ámbitos del Anexo III (alto riesgo)?',
    porQue: 'Los ámbitos del Anexo III determinan la clasificación de alto riesgo (Art. 6.2).',
  },
  {
    key: 'transparencia',
    tipo: 'flags',
    opciones: TRIGGERS_TRANSPARENCIA,
    pregunta: 'Marca lo que aplique al sistema (obligaciones de transparencia del Art. 50):',
    porQue: 'Estas características activan avisos, etiquetado e información a las personas expuestas.',
  },
  {
    key: 'datosPersonales',
    tipo: 'boolean',
    pregunta: '¿El sistema tratará datos personales?',
    porQue: 'Activa los controles de privacidad (RGPD) vinculados a los datasets.',
  },
  {
    key: 'screening',
    tipo: 'flags',
    opciones: PRACTICAS_PROHIBIDAS,
    pregunta: 'Screening de prácticas prohibidas (Art. 5). Marca SOLO si el sistema encaja en alguna de estas prácticas:',
    porQue: 'Si encaja en una práctica prohibida sin excepción aplicable, el proyecto queda bloqueado antes del diseño.',
  },
  {
    key: 'usosExcluidos',
    tipo: 'text',
    pregunta: '¿Qué usos quedan expresamente excluidos del sistema?',
    porQue: 'Delimitar usos excluidos es evidencia mínima del Gate 1 y protege frente a mal uso razonablemente previsible.',
  },
  {
    key: 'rol',
    tipo: 'choice',
    opciones: ROLES_REGULATORIOS,
    pregunta: '¿Qué rol regulatorio asume tu organización respecto de este sistema?',
    porQue: 'Las obligaciones del Reglamento dependen del rol (Role & Responsibility Engine).',
  },
  {
    key: 'owner',
    tipo: 'text',
    pregunta: '¿Quién es el owner (responsable) del sistema?',
    porQue: 'Sin owner no hay accountability: es evidencia mínima del Gate 0.',
  },
  {
    key: 'unidad',
    tipo: 'text',
    pregunta: '¿Qué unidad u organización es responsable?',
    porQue: 'Evidencia mínima del Gate 0.',
  },
]
