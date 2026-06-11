# Capa de experiencia — Interfaz conversacional de vibe coding regulado

**Versión:** 1.0  
**Fecha:** 11 de junio de 2026  
**Ámbito:** Plataforma AI Act-native para desarrollo de sistemas de IA  
**Capa:** Experiencia de usuario / interfaz conversacional / desarrollo asistido  

---

## 1. Propósito de la capa

La **Capa de experiencia** es la interfaz mediante la cual el usuario interactúa con la plataforma para crear, modificar, validar y desplegar sistemas de IA utilizando lenguaje natural, prompts guiados, formularios inteligentes y flujos conversacionales.

Su objetivo es permitir un modelo de **vibe coding regulado**: el usuario puede describir lo que quiere construir de forma natural, iterar con rapidez y apoyarse en agentes de generación, pero la plataforma debe convertir esa intención en un proceso gobernado, documentado y trazable.

La capa debe conseguir que la creación de sistemas de IA sea:

- accesible para perfiles no técnicos;
- útil para perfiles técnicos;
- comprensible para negocio;
- verificable para cumplimiento;
- auditable para control interno, seguridad, privacidad y autoridades;
- conectada con los requisitos del Reglamento de IA.

La función esencial de esta capa es traducir la intención del usuario en una estructura que pueda ser procesada por la Capa de agentes y controlada por la Capa de control.

---

## 2. Principio rector

La Capa de experiencia debe operar bajo el siguiente principio:

> **El usuario puede pedir en lenguaje natural, pero la plataforma debe entender, estructurar, clasificar, documentar y controlar cada petición antes de convertirla en código, configuración, modelo, dato, prueba o despliegue.**

Esto implica que la experiencia no debe limitarse a un chat de generación de código. Debe actuar como una interfaz de desarrollo gobernado.

La plataforma debe evitar que el usuario pueda construir sistemas de IA de forma opaca, informal o no documentada.

---

## 3. Objetivos funcionales

La Capa de experiencia debe permitir al usuario:

1. describir una idea de sistema de IA;
2. convertir esa idea en un caso de uso estructurado;
3. definir la finalidad prevista del sistema;
4. identificar usuarios y personas afectadas;
5. seleccionar o proponer modelos de IA;
6. identificar datos, fuentes y sistemas conectados;
7. solicitar funcionalidades mediante lenguaje natural;
8. recibir propuestas de arquitectura;
9. revisar riesgos, controles y obligaciones;
10. visualizar documentación técnica generada;
11. validar pruebas y evidencias;
12. aprobar o solicitar cambios;
13. lanzar el despliegue si los gates están superados;
14. monitorizar el sistema en operación.

---

## 4. Usuarios objetivo

La Capa de experiencia debe adaptarse a distintos perfiles.

| Perfil | Necesidad principal | Tipo de interacción |
|---|---|---|
| Usuario de negocio | Convertir una necesidad en un caso de uso | Conversacional, guiada, no técnica |
| Product owner | Definir alcance, funcionalidades y roadmap | Mixta: chat, formularios, backlog |
| Desarrollador | Generar y modificar código | Conversacional técnica, integración con repositorio |
| Data scientist | Seleccionar modelos, datos y métricas | Técnica, notebooks, model registry |
| Legal / privacidad | Revisar clasificación, datos, riesgos y documentación | Paneles, informes, trazabilidad |
| Seguridad | Revisar dependencias, amenazas y vulnerabilidades | Dashboards y evidencias técnicas |
| Compliance / riesgo | Validar controles y gates | Matriz requisito-control-evidencia |
| Auditor | Revisar expediente y evidencias | Modo lectura, exportaciones, historial |
| Responsable del despliegue | Usar el sistema y consultar instrucciones | Manuales, avisos, monitorización |

---

## 5. Experiencia conversacional principal

La interfaz debe organizarse en torno a un asistente conversacional central que actúa como punto de entrada.

El asistente no debe comportarse como un generador libre de código. Debe comportarse como un **orquestador de desarrollo regulado**.

### 5.1. Tipos de petición admitidos

El usuario podrá realizar peticiones como:

- “Quiero crear una aplicación que revise reclamaciones de clientes y proponga una respuesta.”
- “Añade una funcionalidad para clasificar solicitudes por prioridad.”
- “Integra un modelo LLM para resumir expedientes.”
- “Haz que el sistema sugiera una decisión.”
- “Conecta la aplicación con esta base documental.”
- “Genera una API para consumir el resultado.”
- “Crea una interfaz para que un supervisor humano apruebe el output.”
- “Documenta el sistema para cumplir el Reglamento de IA.”
- “Evalúa si este cambio puede ser una modificación sustancial.”

La plataforma debe transformar cada petición en una estructura controlada.

---

## 6. Estructura estándar de captura de intención

Cada petición del usuario debe convertirse en un registro con esta estructura:

```text
User Intent:
Texto literal de la petición del usuario.

Functional Objective:
Qué quiere conseguir funcionalmente.

AI Relevance:
Por qué puede implicar o no el uso de IA.

Intended Purpose Impact:
Relación con la finalidad prevista existente o necesidad de crear/modificar finalidad.

Affected Users:
Usuarios directos e indirectos.

Affected Persons:
Personas físicas potencialmente afectadas.

Input Data:
Datos, documentos, prompts, señales o variables de entrada.

Expected Output:
Predicción, recomendación, decisión, clasificación, contenido, alerta o acción.

Autonomy Level:
Asistencia, recomendación, decisión automatizada, agente autónomo o ejecución de acción.

Regulatory Trigger:
Posibles obligaciones del Reglamento de IA, protección de datos u otra normativa.

Development Request:
Qué debe construirse o modificarse.

Evidence Required:
Qué evidencias deberán generarse.
```

---

## 7. Modos de interacción

La Capa de experiencia debe ofrecer varios modos.

### 7.1. Modo idea

Permite al usuario describir una necesidad sin estructura previa.

Objetivo:

- identificar el caso de uso;
- detectar si puede haber sistema de IA;
- determinar finalidad prevista;
- activar clasificación preliminar.

Salida:

- Idea Brief;
- AI System Intake Record;
- preguntas pendientes.

### 7.2. Modo diseño

Permite pasar de la idea a un diseño funcional y técnico.

Objetivo:

- definir arquitectura;
- identificar datos;
- identificar modelos;
- identificar riesgos;
- proponer controles;
- definir backlog inicial.

Salida:

- Functional Design Record;
- Architecture Draft;
- Initial Risk Register;
- Data and Model Requirements.

### 7.3. Modo vibe coding

Permite pedir funcionalidades en lenguaje natural.

Objetivo:

- generar código;
- generar pruebas;
- actualizar documentación;
- vincular cambios a requisitos, riesgos y evidencias.

Salida:

- código;
- tests;
- actualización documental;
- matriz de trazabilidad.

### 7.4. Modo revisión jurídica y de cumplimiento

Permite revisar el estado regulatorio del sistema.

Objetivo:

- revisar clasificación;
- revisar obligaciones;
- revisar riesgos;
- revisar documentación técnica;
- revisar evidencias.

Salida:

- Compliance Review Report;
- Gap Analysis;
- lista de bloqueos.

### 7.5. Modo release

Permite preparar una versión para despliegue.

Objetivo:

- verificar gates;
- revisar pruebas;
- revisar documentación;
- validar riesgos residuales;
- preparar despliegue controlado.

Salida:

- Release Readiness Report;
- Conformity Readiness Report;
- Deployment Approval Record.

### 7.6. Modo monitorización

Permite revisar el comportamiento del sistema desplegado.

Objetivo:

- analizar logs;
- revisar rendimiento;
- detectar drift;
- registrar incidentes;
- activar reevaluaciones.

Salida:

- Monitoring Report;
- Incident Record;
- Corrective Action Plan.

---

## 8. Pantallas principales

La Capa de experiencia debería incluir las siguientes vistas.

### 8.1. Home de proyectos de IA

Debe mostrar:

- proyectos activos;
- sistemas en diseño;
- sistemas en validación;
- sistemas bloqueados;
- sistemas desplegados;
- riesgos críticos;
- gates pendientes;
- alertas regulatorias;
- cambios normativos relevantes.

### 8.2. Ficha del sistema de IA

Debe mostrar:

- nombre;
- versión;
- owner;
- unidad responsable;
- finalidad prevista;
- clasificación regulatoria;
- rol regulatorio;
- estado del ciclo de vida;
- modelos integrados;
- fuentes de datos;
- riesgos principales;
- controles implementados;
- documentación disponible;
- estado de gates.

### 8.3. Conversación de desarrollo

Debe permitir:

- introducir peticiones en lenguaje natural;
- ver cómo la plataforma estructura la petición;
- confirmar o corregir la interpretación;
- visualizar agentes activados;
- consultar evidencias generadas;
- revisar cambios propuestos;
- aprobar o rechazar acciones.

### 8.4. Backlog regulado

Cada tarea debe mostrar:

- requisito funcional;
- relación con finalidad prevista;
- componentes afectados;
- riesgos asociados;
- controles requeridos;
- pruebas necesarias;
- documentación que se actualizará;
- estado de readiness;
- estado de done.

### 8.5. Expediente técnico vivo

Debe permitir visualizar:

- secciones completas;
- secciones incompletas;
- evidencias vinculadas;
- fuentes de información;
- historial de cambios;
- exportación a Markdown, Word o PDF.

### 8.6. Mapa de riesgos

Debe mostrar:

- riesgos inherentes;
- controles;
- riesgos residuales;
- propietarios;
- fechas de revisión;
- relación con componentes;
- relación con pruebas;
- bloqueos.

### 8.7. Panel de gates

Debe mostrar:

- gates superados;
- gates bloqueados;
- evidencias faltantes;
- responsables;
- fecha límite;
- justificaciones;
- aprobaciones.

---

## 9. Flujo de usuario: creación de un sistema de IA

La experiencia debe seguir este flujo:

```text
1. Usuario describe la idea
   ↓
2. Plataforma estructura la intención
   ↓
3. Plataforma pregunta lo imprescindible
   ↓
4. Se genera finalidad prevista
   ↓
5. Se ejecuta clasificación preliminar
   ↓
6. Se propone arquitectura inicial
   ↓
7. Se identifican datos y modelos
   ↓
8. Se genera registro de riesgos inicial
   ↓
9. Usuario valida o ajusta diseño
   ↓
10. Usuario solicita funcionalidades con vibe coding
   ↓
11. Plataforma genera código, tests y documentación
   ↓
12. Plataforma ejecuta validaciones
   ↓
13. Plataforma actualiza expediente técnico
   ↓
14. Usuario revisa estado de gates
   ↓
15. Plataforma permite o bloquea release
```

---

## 10. Flujo de usuario: petición de funcionalidad mediante vibe coding

Cuando el usuario pida una funcionalidad, la experiencia debe obligar a pasar por esta secuencia:

```text
1. Petición natural del usuario
   ↓
2. Reformulación estructurada
   ↓
3. Identificación de impacto regulatorio
   ↓
4. Identificación de componentes afectados
   ↓
5. Identificación de datos/modelos afectados
   ↓
6. Identificación de riesgos
   ↓
7. Definición de criterios de aceptación
   ↓
8. Generación de código
   ↓
9. Generación de pruebas
   ↓
10. Actualización documental
   ↓
11. Validación de gates
```

La interfaz debe permitir que el usuario vea esta transformación antes de ejecutar cambios sustantivos.

---

## 11. Reglas de experiencia para evitar desarrollo no gobernado

La interfaz debe aplicar las siguientes reglas:

1. No presentar la generación de código como una acción aislada.
2. No ocultar al usuario las implicaciones regulatorias de su petición.
3. No permitir saltar la definición de finalidad prevista.
4. No permitir integrar modelos sin ficha de modelo.
5. No permitir usar datos sin ficha de datos.
6. No permitir pasar a producción sin gates.
7. No generar una falsa sensación de conformidad.
8. No mostrar documentación como completada si faltan evidencias.
9. No confundir prototipo con sistema listo para despliegue.
10. No permitir que el usuario reduzca controles críticos sin evaluación.

---

## 12. Diseño de prompts del sistema

La Capa de experiencia debe usar prompts internos estructurados para canalizar la conversación.

### 12.1. Prompt de intake

```text
Actúa como asistente de intake de sistemas de IA. 
Tu objetivo es transformar la descripción del usuario en una ficha inicial de sistema de IA.
No generes código.
Identifica finalidad prevista, usuarios, afectados, datos, outputs, autonomía, modelos, contexto y posibles obligaciones.
Si falta información esencial, pregunta solo lo imprescindible.
Devuelve la información en formato estructurado.
```

### 12.2. Prompt de vibe coding regulado

```text
Actúa como asistente de vibe coding regulado.
Antes de generar código, transforma la petición del usuario en requisito funcional, impacto regulatorio, componentes afectados, datos afectados, modelos afectados, riesgos, controles, pruebas y documentación que debe actualizarse.
No generes código si la tarea no cumple Definition of Ready.
Si generas código, genera también tests, comentarios relevantes, documentación de componente y evidencia para el expediente técnico.
```

### 12.3. Prompt de revisión de release

```text
Actúa como asistente de revisión de release de un sistema de IA.
Verifica gates, riesgos, pruebas, documentación técnica, instrucciones de uso, logs, supervisión humana, monitorización e incidentes.
No recomiendes despliegue si faltan evidencias críticas.
Devuelve una decisión: aprobado, aprobado condicionado o bloqueado.
```

---

## 13. Salidas visibles para el usuario

La Capa de experiencia debe presentar siempre resultados en lenguaje comprensible.

Formato recomendado:

```text
Resultado:
Qué se ha entendido o generado.

Impacto:
Qué cambia funcional, técnica o regulatoriamente.

Riesgos:
Riesgos nuevos o modificados.

Evidencias:
Qué evidencias se han creado o actualizado.

Pendientes:
Qué falta para avanzar.

Decisión:
Puede continuar / requiere revisión / bloqueado.
```

---

## 14. UX de cumplimiento sin fricción

La experiencia debe integrar cumplimiento sin convertirlo en una carga excesiva.

Principios de UX:

- preguntar progresivamente;
- no mostrar cuestionarios jurídicos largos si no son necesarios;
- reutilizar información ya aportada;
- autocompletar desde repositorios internos;
- explicar por qué se pregunta cada dato;
- mostrar impacto de las respuestas;
- usar lenguaje claro;
- diferenciar entre advertencia y bloqueo;
- permitir trabajo en borrador;
- bloquear solo en puntos críticos.

---

## 15. Mecanismos de transparencia para el usuario

La plataforma debe mostrar:

- por qué una petición se clasifica como relevante;
- qué agente está interviniendo;
- qué obligación se activa;
- qué evidencia falta;
- qué gate bloquea;
- qué riesgo se ha detectado;
- qué parte del expediente se actualiza;
- qué revisión humana se requiere.

Esto permite que el usuario entienda que la plataforma no es un simple asistente de programación, sino un entorno de desarrollo regulado.

---

## 16. Indicadores de éxito de la capa

La Capa de experiencia debe medirse mediante indicadores como:

| Indicador | Objetivo |
|---|---|
| Tiempo de creación de ficha inicial | Reducir fricción de intake |
| Porcentaje de peticiones estructuradas correctamente | Mejorar calidad del desarrollo |
| Número de tareas bloqueadas antes de generar código | Prevenir riesgos tempranos |
| Porcentaje de documentación autogenerada | Reducir carga documental |
| Porcentaje de funcionalidades con trazabilidad completa | Aumentar auditabilidad |
| Satisfacción de usuarios técnicos | Mantener utilidad práctica |
| Satisfacción de usuarios legales/compliance | Asegurar confianza regulatoria |
| Incidencias detectadas antes de release | Mejorar control preventivo |

---

## 17. Riesgos específicos de esta capa

| Riesgo | Mitigación |
|---|---|
| El usuario percibe la plataforma como demasiado burocrática | UX progresiva y preguntas contextuales |
| El usuario intenta saltarse controles | Gates no eludibles y trazabilidad obligatoria |
| El usuario no entiende implicaciones regulatorias | Explicaciones breves y orientadas al impacto |
| El asistente genera código demasiado pronto | Definition of Ready obligatoria |
| Se confunde prototipo con producción | Estados diferenciados: idea, PoC, piloto, producción |
| Se generan respuestas jurídicas excesivamente cerradas | Escalado humano para incertidumbre relevante |
| Se ocultan bloqueos en exceso | Panel claro de gates y evidencias faltantes |

---

## 18. Resultado esperado

La Capa de experiencia debe permitir que un usuario pueda construir sistemas de IA de forma ágil, conversacional y asistida, pero sin perder el control regulatorio, técnico ni documental.

Su función no es solo facilitar el desarrollo, sino convertir cada interacción en una pieza del expediente vivo del sistema de IA.

La experiencia óptima se resume así:

> **El usuario construye con lenguaje natural; la plataforma convierte cada intención en diseño, código, prueba, control y evidencia.**
