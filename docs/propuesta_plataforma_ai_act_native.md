# Propuesta de diseño de plataforma AI Act-native para desarrollo de sistemas de IA

**Versión:** 1.0  
**Fecha:** 11 de junio de 2026  
**Objeto:** Diseño funcional, jurídico y técnico de una plataforma de desarrollo de sistemas de IA que incorpore cumplimiento nativo del Reglamento (UE) 2024/1689, Reglamento de Inteligencia Artificial.

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)  
2. [Principio de diseño](#2-principio-de-diseño-cumplimiento-verificable-no-cumplimiento-declarado)  
3. [Alcance regulatorio que debe cubrir la plataforma](#3-alcance-regulatorio-que-debe-cubrir-la-plataforma)  
4. [Arquitectura conceptual de la plataforma](#4-arquitectura-conceptual-de-la-plataforma)  
5. [Módulo 1 — Intake regulatorio y funcional del caso de uso](#5-módulo-1--intake-regulatorio-y-funcional-del-caso-de-uso)  
6. [Módulo 2 — Motor de clasificación regulatoria](#6-módulo-2--motor-de-clasificación-regulatoria)  
7. [Módulo 3 — Gestor de requisitos normativos como código](#7-módulo-3--gestor-de-requisitos-normativos-como-código)  
8. [Módulo 4 — Repositorio vivo de documentación técnica](#8-módulo-4--repositorio-vivo-de-documentación-técnica)  
9. [Módulo 5 — Repositorio de código documentado y trazable](#9-módulo-5--repositorio-de-código-documentado-y-trazable)  
10. [Módulo 6 — Gestión de datos y datasets](#10-módulo-6--gestión-de-datos-y-datasets)  
11. [Módulo 7 — Gestión de modelos, componentes y proveedores](#11-módulo-7--gestión-de-modelos-componentes-y-proveedores)  
12. [Módulo 8 — Sistema de gestión de riesgos de IA](#12-módulo-8--sistema-de-gestión-de-riesgos-de-ia)  
13. [Módulo 9 — Testing, validación y evaluación técnica](#13-módulo-9--testing-validación-y-evaluación-técnica)  
14. [Módulo 10 — Supervisión humana by design](#14-módulo-10--supervisión-humana-by-design)  
15. [Módulo 11 — Logs, trazabilidad y auditoría](#15-módulo-11--logs-trazabilidad-y-auditoría)  
16. [Módulo 12 — Transparencia e instrucciones de uso](#16-módulo-12--transparencia-e-instrucciones-de-uso)  
17. [Módulo 13 — Evaluación de impacto en derechos fundamentales y EIPD](#17-módulo-13--evaluación-de-impacto-en-derechos-fundamentales-y-eipd)  
18. [Módulo 14 — Sistema de calidad del proveedor](#18-módulo-14--sistema-de-calidad-del-proveedor)  
19. [Módulo 15 — Evaluación de conformidad, declaración UE y marcado CE](#19-módulo-15--evaluación-de-conformidad-declaración-ue-y-marcado-ce)  
20. [Módulo 16 — Post-market monitoring e incidentes](#20-módulo-16--post-market-monitoring-e-incidentes)  
21. [Módulo 17 — Actualización normativa y estándares](#21-módulo-17--actualización-normativa-y-estándares)  
22. [Modelo de datos esencial](#22-modelo-de-datos-esencial)  
23. [Flujo operativo completo](#23-flujo-operativo-completo)  
24. [Gates obligatorios](#24-gates-obligatorios)  
25. [Integraciones técnicas recomendables](#25-integraciones-técnicas-recomendables)  
26. [Diseño técnico de alto nivel](#26-diseño-técnico-de-alto-nivel)  
27. [Entregables que debe generar automáticamente](#27-entregables-que-debe-generar-automáticamente)  
28. [Funcionalidad diferencial: documentación técnica generada desde el código](#28-funcionalidad-diferencial-documentación-técnica-generada-desde-el-código)  
29. [MVP recomendable](#29-mvp-recomendable)  
30. [Riesgos de diseño que conviene evitar](#30-riesgos-de-diseño-que-conviene-evitar)  
31. [Conclusión ejecutiva](#31-conclusión-ejecutiva)  
32. [Fuentes oficiales de referencia](#32-fuentes-oficiales-de-referencia)  

---

## 1. Resumen ejecutivo

Este documento propone el diseño de una **plataforma de desarrollo de sistemas de IA concebida como una “AI Act-native development platform”**.

La plataforma no debe limitarse a permitir desarrollar, integrar, probar y desplegar aplicaciones que incorporen uno o varios modelos de IA. Su elemento diferencial debe consistir en que, durante todo el ciclo de vida del sistema, la plataforma **genere automáticamente las evidencias necesarias para demostrar cumplimiento regulatorio**, especialmente respecto del Reglamento (UE) 2024/1689, Reglamento de Inteligencia Artificial.

La idea central es:

> **La plataforma no documenta al final; documenta mientras se diseña, codifica, integra, prueba, despliega y monitoriza el sistema de IA.**

De esta forma, cada sistema de IA creado en la plataforma debe quedar asociado desde su origen a:

- una finalidad prevista;
- una clasificación regulatoria;
- un rol regulatorio;
- una arquitectura técnica;
- un conjunto de modelos;
- un conjunto de fuentes de datos;
- un mapa de obligaciones;
- un registro de riesgos;
- un conjunto de controles;
- una batería de pruebas;
- un sistema de logs;
- un diseño de supervisión humana;
- una documentación técnica viva;
- un expediente de conformidad;
- un plan de monitorización post-despliegue.

---

## 2. Principio de diseño: cumplimiento verificable, no cumplimiento declarado

La plataforma debe partir de una premisa básica: el Reglamento de IA opera con un enfoque basado en riesgo y establece obligaciones diferentes en función del rol, el tipo de sistema, la finalidad prevista y el contexto de uso.

Por tanto, la plataforma no debería prometer “cumplimiento automático” de cualquier sistema de IA, sino:

> **Cumplimiento nativo, trazable y auditable, mediante controles obligatorios, generación automática de documentación técnica, evidencias verificables y bloqueo de despliegues no conformes.**

Esto implica que la plataforma actúa como una combinación de:

1. **entorno de desarrollo de sistemas de IA**;
2. **repositorio vivo de documentación técnica**;
3. **motor de clasificación regulatoria**;
4. **sistema de gestión de riesgos de IA**;
5. **sistema de calidad del proveedor**;
6. **MLOps / LLMOps gobernado**;
7. **registro de evidencias para evaluación de conformidad**;
8. **módulo de monitorización post-comercialización / post-despliegue**.

---

## 3. Alcance regulatorio que debe cubrir la plataforma

La plataforma debe cubrir, como mínimo, cinco capas normativas del Reglamento de IA.

---

### 3.1. Capa 1: determinación de si existe un sistema de IA

Debe existir un **módulo de identificación del sistema de IA** que analice si la aplicación informática que se está desarrollando encaja en el concepto de sistema de IA.

La plataforma debería obligar a documentar:

| Elemento | Pregunta que debe resolver |
|---|---|
| Finalidad prevista | ¿Para qué se diseña el sistema? |
| Input | ¿Qué datos, instrucciones, documentos, señales o variables recibe? |
| Output | ¿Genera predicciones, recomendaciones, decisiones, clasificaciones, contenidos, puntuaciones o acciones? |
| Grado de autonomía | ¿Opera con reglas fijas, inferencia estadística, aprendizaje automático, LLM, agente autónomo o combinación? |
| Contexto de uso | ¿Dónde se usará y por quién? |
| Personas afectadas | ¿Puede afectar a derechos, intereses, oportunidades, seguridad o condiciones de personas físicas? |

**Resultado:** ficha inicial del sistema de IA.

---

### 3.2. Capa 2: exclusiones, prácticas prohibidas y usos no admisibles

Antes de permitir el desarrollo, la plataforma debe ejecutar un **screening de prácticas prohibidas**.

Debe incluir un cuestionario jurídico-técnico sobre:

- manipulación subliminal o engañosa;
- explotación de vulnerabilidades;
- social scoring;
- predicción individual de conducta delictiva basada solo en perfilado;
- scraping indiscriminado de imágenes faciales;
- reconocimiento de emociones en trabajo o educación, salvo excepciones;
- categorización biométrica sensible;
- identificación biométrica remota en espacios públicos para fines policiales, con sus excepciones.

La plataforma debería tener un **bloqueo duro**: si el caso de uso encaja en una práctica prohibida y no existe excepción aplicable, el proyecto no puede avanzar a fase de diseño.

---

### 3.3. Capa 3: clasificación de riesgo

La plataforma debe incorporar un **motor de clasificación de riesgo** que evalúe si el sistema es:

| Categoría | Consecuencia en la plataforma |
|---|---|
| Práctica prohibida | Bloqueo del proyecto |
| Alto riesgo | Activación completa del expediente técnico, SGIA, evaluación de conformidad, post-market monitoring, logs, documentación y controles reforzados |
| Transparencia específica | Activación de avisos, etiquetado, información al usuario y trazabilidad |
| GPAI / integración de modelo de propósito general | Activación de obligaciones de documentación upstream/downstream |
| Riesgo limitado o mínimo | Documentación proporcional, buenas prácticas, registro y controles internos |

El motor de clasificación debe estar diseñado para actualizarse conforme evolucionen guías, estándares, actos delegados, actos de ejecución y criterios de autoridades competentes.

---

### 3.4. Capa 4: requisitos de los sistemas de alto riesgo

Si el sistema es de alto riesgo, la plataforma debe activar obligatoriamente los requisitos de los artículos 8 a 15 del Reglamento de IA.

| Requisito AI Act | Traducción funcional en la plataforma |
|---|---|
| Gestión de riesgos | Risk engine integrado en ciclo de vida |
| Gobernanza de datos | Data cards, calidad, sesgos, procedencia, representatividad |
| Documentación técnica | Expediente técnico autogenerado |
| Registro de logs | Logging by design y trazabilidad de eventos |
| Transparencia e instrucciones de uso | Manual de uso, limitaciones, interpretación de outputs |
| Supervisión humana | Diseño de controles humanos, override, stop button, escalado |
| Precisión, solidez y ciberseguridad | Testing, métricas, red teaming, adversarial testing, seguridad |

---

### 3.5. Capa 5: obligaciones del proveedor, deployer y cadena de valor

La plataforma debe distinguir roles. No basta con desarrollar “un sistema”; hay que saber si la organización actúa como:

- proveedor;
- responsable del despliegue;
- importador;
- distribuidor;
- representante autorizado;
- downstream provider que integra un modelo de propósito general;
- tercero que realiza una modificación sustancial.

Esto es crítico para el diseño de la plataforma: debe haber un **Role & Responsibility Engine** que determine qué obligaciones se activan.

---

## 4. Arquitectura conceptual de la plataforma

La plataforma debería organizarse en diecisiete grandes módulos:

1. Intake regulatorio y funcional del caso de uso.
2. Motor de clasificación regulatoria.
3. Gestor de requisitos normativos como código.
4. Repositorio vivo de documentación técnica.
5. Repositorio de código documentado y trazable.
6. Gestión de datos y datasets.
7. Gestión de modelos, componentes y proveedores.
8. Sistema de gestión de riesgos de IA.
9. Testing, validación y evaluación técnica.
10. Supervisión humana by design.
11. Logs, trazabilidad y auditoría.
12. Transparencia e instrucciones de uso.
13. Evaluación de impacto en derechos fundamentales y EIPD.
14. Sistema de calidad del proveedor.
15. Evaluación de conformidad, declaración UE y marcado CE.
16. Post-market monitoring e incidentes.
17. Actualización normativa y estándares.

---

## 5. Módulo 1 — Intake regulatorio y funcional del caso de uso

Este es el punto de entrada.

Debe recoger información estructurada sobre:

| Bloque | Información |
|---|---|
| Identificación | Nombre, versión, owner, unidad, proveedor, cliente, país, sector |
| Finalidad prevista | Propósito principal, decisiones asistidas, outputs esperados |
| Usuarios | Usuarios internos, externos, profesionales, consumidores, empleados |
| Personas afectadas | Clientes, empleados, candidatos, ciudadanos, menores, colectivos vulnerables |
| Datos | Tipología, origen, datos personales, categorías especiales, datos sintéticos, datasets externos |
| Modelos | Modelo propio, modelo de tercero, GPAI, LLM, modelo open source, fine-tuning |
| Integraciones | APIs, sistemas core, CRM, RR. HH., scoring, canales digitales |
| Autonomía | Recomendación, asistencia, decisión automatizada, agente, ejecución de acciones |
| Impacto | Derechos fundamentales, salud, seguridad, acceso a servicios, condiciones laborales |
| Jurisdicciones | UE, terceros países, despliegue global |
| Estado | Idea, PoC, piloto, producción, modificación |

**Resultado documental:** AI System Intake Record.

---

## 6. Módulo 2 — Motor de clasificación regulatoria

Debe funcionar como un árbol de decisión versionado.

### 6.1. Preguntas mínimas

La plataforma debe resolver, como mínimo:

1. ¿Es un sistema de IA?
2. ¿Está excluido del ámbito de aplicación?
3. ¿Encaja en una práctica prohibida?
4. ¿Es un sistema de alto riesgo por producto o por Anexo III?
5. ¿Es un sistema sujeto a obligaciones específicas de transparencia?
6. ¿Integra un modelo de propósito general?
7. ¿Se usa para tomar o asistir decisiones sobre personas físicas?
8. ¿Requiere evaluación de impacto en derechos fundamentales?
9. ¿Requiere EIPD / DPIA?
10. ¿Existe modificación sustancial respecto de una versión anterior?

### 6.2. Salida del motor

El motor debe generar automáticamente:

- clasificación de riesgo;
- rol regulatorio;
- obligaciones activadas;
- controles obligatorios;
- entregables exigibles;
- aprobaciones necesarias;
- evidencia mínima;
- bloqueo o autorización condicionada.

La clasificación no debería quedar como un texto libre: debe convertirse en **requisitos ejecutables** dentro del ciclo de desarrollo.

---

## 7. Módulo 3 — Gestor de requisitos normativos como código

Aquí está una de las claves del producto.

Cada obligación del Reglamento debe convertirse en una unidad estructurada:

| Campo | Ejemplo |
|---|---|
| ID obligación | RIA-HR-ART11-001 |
| Fuente | Artículo 11 / Anexo IV |
| Tipo | Documentación técnica |
| Aplicabilidad | Alto riesgo |
| Control asociado | Generación de ficha técnica |
| Evidencia esperada | Documento técnico versionado |
| Responsable | Product owner / legal owner / ML engineer |
| Gate | Antes de evaluación de conformidad |
| Estado | Pendiente / En curso / Validado / No aplicable justificado |
| Evidencia vinculada | Commit, test, dataset card, informe, decisión aprobatoria |

Esto permite implementar **compliance as code**: la norma se traduce en controles verificables dentro de la plataforma.

---

## 8. Módulo 4 — Repositorio vivo de documentación técnica

La plataforma debe generar automáticamente un **Technical Documentation File** alineado con el Anexo IV del Reglamento de IA.

### 8.1. Estructura del expediente técnico

El expediente debería tener, al menos, estos capítulos:

| Capítulo | Contenido generado por la plataforma |
|---|---|
| 1. Descripción general del sistema | Finalidad prevista, proveedor, versión, relación con versiones anteriores |
| 2. Arquitectura funcional | Componentes, módulos, APIs, interacción con hardware/software |
| 3. Formas de comercialización o puesta en servicio | API, SaaS, paquete software, integración en producto, descarga |
| 4. Interfaz de usuario | Pantallas, flujos, roles, avisos, explicabilidad al deployer |
| 5. Instrucciones de uso | Manual para deployers, limitaciones, condiciones de uso |
| 6. Desarrollo del sistema | Métodos, pasos, herramientas, modelos preentrenados, terceros |
| 7. Datos | Origen, preparación, entrenamiento, validación, test, calidad, sesgos |
| 8. Diseño y desarrollo | Decisiones técnicas, requisitos funcionales y no funcionales |
| 9. Gestión de riesgos | Riesgos conocidos, previsibles, mal uso razonablemente previsible, mitigaciones |
| 10. Supervisión humana | Roles, intervención, override, stop, escalado |
| 11. Métricas y pruebas | Accuracy, robustness, cybersecurity, fairness, explainability |
| 12. Ciberseguridad | Threat model, controles, pruebas, vulnerabilidades IA específicas |
| 13. Logs | Eventos registrados, retención, acceso, interpretación |
| 14. Cambios | Historial de versiones, modificaciones, cambios sustanciales |
| 15. Evaluación de conformidad | Checklist, evidencias, aprobaciones, organismo notificado si aplica |
| 16. Declaración UE de conformidad | Borrador generado automáticamente cuando proceda |
| 17. Monitorización post-market | Plan, métricas, feedback, incidentes, drift, acciones correctivas |

---

## 9. Módulo 5 — Repositorio de código documentado y trazable

Conviene hacer una precisión jurídica importante: **el Reglamento de IA no exige documentar “todo el código fuente línea por línea” como obligación general**. Lo que exige es documentación técnica suficiente para demostrar conformidad, trazabilidad, funcionamiento, diseño, desarrollo, riesgos, datos, controles, pruebas y mantenimiento.

Dicho esto, desde diseño de plataforma sí tiene mucho sentido imponer una capa superior: **code documentation by design**.

### 9.1. Qué debe documentar la plataforma sobre el código

La plataforma debería exigir que cada componente de código tenga una ficha técnica mínima:

| Elemento | Contenido |
|---|---|
| Componente | Nombre del módulo, repositorio, owner |
| Función | Qué hace dentro del sistema de IA |
| Relación con finalidad prevista | Qué parte del propósito soporta |
| Inputs | Datos, prompts, variables, documentos, señales |
| Outputs | Respuesta, predicción, clasificación, scoring, acción |
| Dependencias | Librerías, modelos, APIs, servicios externos |
| Riesgos asociados | Seguridad, sesgo, alucinación, privacidad, explicabilidad |
| Controles | Validaciones, guardrails, umbrales, revisión humana |
| Tests | Unitarios, integración, rendimiento, seguridad, fairness |
| Evidencia | Commits, pull requests, aprobaciones, resultados |
| Estado | Experimental, validado, producción, retirado |

### 9.2. Integración con Git

La plataforma debe integrarse con GitHub, GitLab, Azure DevOps o equivalente para capturar:

- repositorio;
- rama;
- commit hash;
- pull request;
- revisión de código;
- aprobador;
- cambios introducidos;
- dependencias;
- vulnerabilidades;
- pruebas ejecutadas;
- relación con requisito regulatorio;
- relación con ticket funcional;
- relación con riesgo mitigado.

Cada pull request debería estar vinculado a:

1. requisito funcional;
2. requisito normativo;
3. riesgo asociado;
4. evidencia de prueba;
5. impacto en documentación técnica;
6. decisión sobre si constituye modificación sustancial.

---

## 10. Módulo 6 — Gestión de datos y datasets

La plataforma debe tener un **Data Governance Hub** con:

| Entidad | Documento asociado |
|---|---|
| Dataset | Dataset Card |
| Fuente de datos | Source Record |
| Datos personales | Privacy Record |
| Base jurídica | GDPR Legal Basis Record |
| Categorías especiales | Special Category Assessment |
| Finalidad original | Purpose Compatibility Assessment |
| Calidad | Data Quality Report |
| Sesgos | Bias Assessment |
| Representatividad | Representativeness Report |
| Retención | Retention Rule |
| Accesos | Access Control Log |
| Transformaciones | Data Lineage Graph |

### 10.1. Controles automáticos

La plataforma debería incluir:

- detección de datos personales;
- detección de categorías especiales;
- evaluación de minimización;
- linaje de datos;
- control de finalidad;
- bloqueo de datasets sin propietario;
- bloqueo de datasets sin origen documentado;
- trazabilidad de transformaciones;
- evaluación de sesgos;
- generación de evidencias para EIPD;
- generación de evidencias para evaluación de impacto en derechos fundamentales.

---

## 11. Módulo 7 — Gestión de modelos, componentes y proveedores

Muchos sistemas no entrenarán un modelo desde cero, sino que integrarán:

- modelos comerciales;
- modelos open source;
- modelos fundacionales;
- LLMs;
- APIs de terceros;
- modelos fine-tuned;
- RAG;
- agentes;
- clasificadores;
- embeddings;
- motores de recomendación.

La plataforma debe tener un **Model & Component Registry**.

### 11.1. Ficha de modelo

| Campo | Contenido |
|---|---|
| Modelo | Nombre, versión, proveedor |
| Tipo | LLM, clasificación, visión, scoring, embeddings, agente |
| Origen | Propio, tercero, open source, GPAI |
| Licencia | Comercial, open source, restricciones |
| Uso previsto | Para qué se integra |
| Limitaciones | Técnicas, jurídicas, operativas |
| Documentación recibida | Model card, API docs, security docs, GPAI docs |
| Evaluaciones propias | Benchmarks, red teaming, tests internos |
| Riesgos | Sesgo, alucinación, seguridad, privacidad, IP |
| Sustitución | Plan de retirada o cambio de modelo |
| Dependencia crítica | Sí/no |
| Obligaciones contractuales | SLA, auditoría, logs, soporte, incidentes |

---

## 12. Módulo 8 — Sistema de gestión de riesgos de IA

Debe ser uno de los módulos centrales.

### 12.1. Taxonomía mínima de riesgos

La plataforma debería incluir una taxonomía base:

| Categoría | Ejemplos |
|---|---|
| Derechos fundamentales | discriminación, exclusión, falta de recurso, opacidad |
| Salud y seguridad | daños físicos, errores críticos, uso en infraestructuras |
| Protección de datos | base jurídica, minimización, decisiones automatizadas, categorías especiales |
| Seguridad | adversarial attacks, prompt injection, data poisoning, model poisoning |
| Robustez | drift, degradación, errores fuera de distribución |
| Transparencia | imposibilidad de interpretar outputs, instrucciones deficientes |
| Supervisión humana | automatización excesiva, rubber stamping, falta de override |
| Terceros | modelo opaco, proveedor no cooperativo, falta de logs |
| Propiedad intelectual | entrenamiento, outputs, licencias, scraping |
| Operacional | falta de mantenimiento, monitorización insuficiente, dependencia crítica |
| Cumplimiento sectorial | financiero, laboral, sanitario, seguros, educación, justicia |

### 12.2. Flujo de riesgo

Cada riesgo debe tener:

- descripción;
- causa;
- evento;
- consecuencia;
- personas afectadas;
- severidad;
- probabilidad;
- nivel inherente;
- controles preventivos;
- controles detectivos;
- controles correctivos;
- propietario;
- evidencia;
- riesgo residual;
- decisión de aceptación;
- fecha de revisión;
- vínculo con requisito AI Act;
- vínculo con componente técnico;
- vínculo con pruebas.

---

## 13. Módulo 9 — Testing, validación y evaluación técnica

La plataforma debe impedir el paso a producción si no existen pruebas suficientes.

### 13.1. Pruebas mínimas

| Área | Pruebas |
|---|---|
| Accuracy | Métricas por finalidad prevista |
| Robustez | Out-of-distribution, perturbaciones, degradación |
| Ciberseguridad | SAST, DAST, dependency scanning, secrets scanning, adversarial testing |
| IA específica | Prompt injection, data poisoning, model evasion, model extraction |
| Sesgo | Métricas por grupos relevantes, falsos positivos/negativos |
| Explicabilidad | Capacidad de justificar outputs o facilitar interpretación |
| Supervisión humana | Validación de intervención, override, escalado |
| Logging | Integridad, completitud, retención, interpretabilidad |
| Rendimiento | Latencia, disponibilidad, límites de carga |
| Seguridad operacional | Fallback, fail-safe, rollback |

---

## 14. Módulo 10 — Supervisión humana by design

La plataforma debe obligar a diseñar la supervisión humana antes del despliegue.

### 14.1. Elementos que debe exigir la plataforma

| Elemento | Pregunta |
|---|---|
| Responsable de supervisión | ¿Quién supervisa? |
| Competencia | ¿Qué formación debe tener? |
| Momento | ¿Antes, durante o después del output? |
| Capacidad de intervención | ¿Puede aceptar, rechazar, modificar, escalar? |
| Override | ¿Puede anular el output? |
| Stop button | ¿Puede detener el sistema de forma segura? |
| Evidencia | ¿Queda registro de la intervención humana? |
| Riesgo de automatización | ¿Cómo se evita el rubber stamping? |
| Instrucciones | ¿Qué debe revisar el humano? |
| Escalado | ¿Cuándo se eleva a comité o experto? |

La plataforma debería generar automáticamente una **Human Oversight Design Card**.

---

## 15. Módulo 11 — Logs, trazabilidad y auditoría

La plataforma debe incorporar logging desde el diseño.

### 15.1. Tipos de logs

| Tipo de log | Finalidad |
|---|---|
| Development logs | Evidenciar diseño, cambios, pruebas |
| Data logs | Linaje y transformaciones |
| Model logs | Versiones, parámetros, benchmarks |
| Inference logs | Inputs, outputs, usuario, momento, versión |
| Human oversight logs | Intervención, aceptación, rechazo, override |
| Security logs | Accesos, anomalías, ataques |
| Monitoring logs | Drift, performance, errores |
| Incident logs | Eventos adversos, investigación, acciones |
| Compliance logs | Aprobaciones, excepciones, decisiones |

### 15.2. Requisitos internos del logging

Los logs deben ser:

- completos;
- proporcionales;
- seguros;
- interpretables;
- exportables;
- protegidos frente a alteración;
- sujetos a control de acceso;
- compatibles con protección de datos;
- vinculados a la versión exacta del sistema;
- conservados conforme a una política definida.

---

## 16. Módulo 12 — Transparencia e instrucciones de uso

La plataforma debe generar:

1. **Instructions for Use**;
2. **Deployer Manual**;
3. **User-facing notices**;
4. **Limitations Sheet**;
5. **Known Risks Sheet**;
6. **Output Interpretation Guide**;
7. **Human Oversight Guide**.

Contenido mínimo:

| Bloque | Contenido |
|---|---|
| Finalidad prevista | Para qué puede usarse |
| Usos no permitidos | Para qué no debe usarse |
| Nivel de precisión | Métricas y condiciones |
| Limitaciones | Casos donde puede fallar |
| Datos de entrada | Requisitos de calidad y formato |
| Interpretación del output | Cómo leer resultados |
| Supervisión humana | Qué debe revisar el usuario |
| Logs | Cómo se registran y consultan |
| Mantenimiento | Actualizaciones, versiones, soporte |
| Riesgos residuales | Riesgos conocidos no eliminados |

---

## 17. Módulo 13 — Evaluación de impacto en derechos fundamentales y EIPD

La plataforma debería incorporar dos flujos diferenciados:

| Evaluación | Cuándo se activa |
|---|---|
| EIPD / DPIA | Cuando haya tratamiento de datos personales de alto riesgo conforme RGPD |
| Fundamental Rights Impact Assessment | Cuando proceda conforme al Reglamento de IA para determinados deployers y usos de alto riesgo |

La plataforma debería evitar duplicidades generando una **matriz común de afectación**:

- personas afectadas;
- derechos potencialmente afectados;
- datos tratados;
- finalidad;
- necesidad y proporcionalidad;
- riesgos;
- medidas de mitigación;
- información a interesados;
- mecanismos de recurso;
- intervención humana;
- evidencia.

---

## 18. Módulo 14 — Sistema de calidad del proveedor

La plataforma debe incorporar un **Quality Management System Layer**.

### 18.1. Procedimientos internos gestionados por la plataforma

| Procedimiento | Automatización |
|---|---|
| Clasificación de sistemas IA | Árbol de decisión obligatorio |
| Gestión de riesgos | Risk register integrado |
| Diseño y desarrollo | Gates y evidencias |
| Verificación y validación | Test suites obligatorias |
| Gestión de datos | Data governance workflow |
| Gestión de modelos terceros | Due diligence y documentación |
| Cambios | Substantial modification assessment |
| Incidentes | Registro, investigación, reporting |
| Post-market monitoring | Métricas, feedback, acciones correctivas |
| Documentación | Technical file autogenerado |
| Evaluación de conformidad | Checklist y paquete de evidencias |
| Formación | Registro de alfabetización en IA |

---

## 19. Módulo 15 — Evaluación de conformidad, declaración UE y marcado CE

Para sistemas de alto riesgo, la plataforma debe preparar el expediente para evaluación de conformidad.

### 19.1. Funcionalidad de conformity readiness

La plataforma debería generar:

- checklist de requisitos;
- matriz requisito-control-evidencia;
- informe de brechas;
- expediente técnico;
- instrucciones de uso;
- declaración UE de conformidad;
- evidencias de testing;
- informe de riesgos residuales;
- informe de cambios;
- plan post-market;
- registro de aprobaciones;
- paquete exportable para organismo notificado, si aplica.

---

## 20. Módulo 16 — Post-market monitoring e incidentes

La plataforma debe incluir:

| Funcionalidad | Descripción |
|---|---|
| Monitoring dashboard | Performance, drift, errores, anomalías |
| Feedback loop | Feedback de deployers y usuarios |
| Incident register | Registro de incidentes y near misses |
| Serious incident assessment | Determinación de si es incidente grave |
| Causal link assessment | Análisis de causalidad con el sistema |
| Corrective actions | CAPA: corrective and preventive actions |
| Authority reporting pack | Paquete de notificación |
| Model rollback | Retorno a versión segura |
| Decommissioning | Retirada controlada del sistema |
| Reassessment trigger | Reapertura de clasificación y conformidad |

---

## 21. Módulo 17 — Actualización normativa y estándares

La plataforma debe estar preparada para actualizar controles según evolucionen:

- guías de la Comisión;
- estándares armonizados;
- especificaciones comunes;
- actos delegados;
- actos de ejecución;
- plantillas oficiales;
- criterios de autoridades nacionales;
- jurisprudencia;
- sector financiero, sanitario, laboral, educativo, etc.

Esto implica que la plataforma debe tener un **Regulatory Content Management System** versionado:

| Elemento | Gestión |
|---|---|
| Obligación | Texto fuente, versión, fecha |
| Control | Control técnico/jurídico asociado |
| Evidencia | Evidencia requerida |
| Aplicabilidad | Riesgo, rol, sector, jurisdicción |
| Estado | Vigente, borrador, derogado, pendiente |
| Fuente | Reglamento, guía, estándar, política interna |
| Impacto | Qué proyectos quedan afectados por cambios |

---

## 22. Modelo de datos esencial

La plataforma debería estructurarse alrededor de estas entidades principales:

| Entidad | Finalidad |
|---|---|
| AI System | Registro maestro del sistema |
| Use Case | Caso de uso concreto |
| Intended Purpose | Finalidad prevista |
| Regulatory Role | Proveedor, deployer, importador, distribuidor, downstream provider |
| Risk Classification | Prohibido, alto riesgo, transparencia, GPAI, mínimo |
| Requirement | Obligación normativa |
| Control | Medida implementada |
| Evidence | Evidencia documental o técnica |
| Code Component | Módulo de software |
| Model Component | Modelo IA integrado |
| Dataset | Dataset usado |
| Data Processing Activity | Tratamiento de datos personales |
| Risk | Riesgo identificado |
| Test | Prueba técnica o funcional |
| Human Oversight Measure | Medida de supervisión humana |
| Log Schema | Esquema de logs |
| Release | Versión liberada |
| Deployment | Instancia desplegada |
| Incident | Incidente o evento adverso |
| Change Request | Cambio funcional/técnico |
| Substantial Modification Assessment | Evaluación de modificación sustancial |
| Technical Documentation File | Expediente técnico |
| Conformity Assessment Pack | Paquete de evaluación |
| Post-market Monitoring Plan | Plan de monitorización |

---

## 23. Flujo operativo completo

La plataforma debería imponer este flujo:

```text
1. Registro del caso de uso
   ↓
2. Determinación de si es sistema de IA
   ↓
3. Identificación de rol regulatorio
   ↓
4. Screening de prácticas prohibidas
   ↓
5. Clasificación de riesgo
   ↓
6. Activación automática de obligaciones
   ↓
7. Diseño funcional y técnico
   ↓
8. Registro de datos, modelos y proveedores
   ↓
9. Gestión de riesgos
   ↓
10. Desarrollo con trazabilidad de código
   ↓
11. Testing y validación
   ↓
12. Diseño de supervisión humana
   ↓
13. Generación de instrucciones de uso
   ↓
14. Generación de documentación técnica
   ↓
15. Evaluación de conformidad
   ↓
16. Aprobación de salida a producción
   ↓
17. Despliegue controlado
   ↓
18. Monitorización post-market
   ↓
19. Gestión de incidentes y cambios
   ↓
20. Revisión continua de conformidad
```

---

## 24. Gates obligatorios

La plataforma debería tener gates que bloqueen el avance si falta evidencia.

| Gate | Bloquea si falta |
|---|---|
| Gate 0 — Intake | Finalidad prevista, owner, contexto |
| Gate 1 — Clasificación | Resultado de riesgo y rol |
| Gate 2 — Legal basis/data | Evaluación de datos y privacidad |
| Gate 3 — Design approval | Arquitectura, riesgos iniciales, controles |
| Gate 4 — Development readiness | Requisitos, modelo, datasets, proveedores |
| Gate 5 — Validation | Tests mínimos superados |
| Gate 6 — Human oversight | Supervisión humana diseñada y probada |
| Gate 7 — Technical documentation | Expediente técnico completo |
| Gate 8 — Conformity readiness | Evidencias y aprobaciones |
| Gate 9 — Deployment | Logs, monitoring, incident process |
| Gate 10 — Change | Evaluación de modificación sustancial |

---

## 25. Integraciones técnicas recomendables

La plataforma no debería reinventar todo, sino integrarse con herramientas existentes.

| Categoría | Integraciones |
|---|---|
| Código | GitHub, GitLab, Azure DevOps |
| Gestión de proyectos | Jira, Azure Boards, ServiceNow |
| MLOps | MLflow, Kubeflow, SageMaker, Vertex AI, Azure ML |
| Datos | Data catalog, Snowflake, Databricks, BigQuery |
| Seguridad | Snyk, SonarQube, Dependabot, Wiz, Prisma |
| Observabilidad | Datadog, Grafana, Prometheus, OpenTelemetry |
| Documentación | Confluence, SharePoint, Markdown repo |
| GRC | Archer, ServiceNow GRC, OneTrust, MetricStream |
| IAM | Azure AD, Okta |
| Legal/privacy | Records of processing, DPIA tools, contract lifecycle tools |

---

## 26. Diseño técnico de alto nivel

### 26.1. Arquitectura lógica

```text
Frontend
  ├─ Portal de proyectos IA
  ├─ Formularios regulatorios inteligentes
  ├─ Dashboards de cumplimiento
  ├─ Vista de expediente técnico
  └─ Panel de riesgos, tests, releases e incidentes

Backend
  ├─ Regulatory Rules Engine
  ├─ Workflow Engine
  ├─ Evidence Engine
  ├─ Risk Engine
  ├─ Documentation Generator
  ├─ Policy-as-Code Service
  ├─ Model Registry Connector
  ├─ Data Lineage Connector
  ├─ CI/CD Gatekeeper
  └─ Monitoring & Incident Service

Data Layer
  ├─ AI System Registry
  ├─ Requirement-Control-Evidence Database
  ├─ Technical Documentation Repository
  ├─ Risk Register
  ├─ Audit Log Store
  ├─ Model & Dataset Registry
  └─ Evidence Lake

Integration Layer
  ├─ Git
  ├─ CI/CD
  ├─ MLOps
  ├─ Security scanners
  ├─ GRC
  ├─ Data catalog
  └─ Observability
```

---

## 27. Entregables que debe generar automáticamente

La plataforma debería generar estos documentos:

| Documento | Momento |
|---|---|
| AI System Card | Registro inicial |
| Regulatory Classification Report | Tras clasificación |
| Intended Purpose Statement | Diseño |
| Role Assessment | Diseño |
| Prohibited Practices Assessment | Intake |
| High-Risk Assessment | Clasificación |
| Data Governance Report | Diseño/datos |
| Dataset Cards | Datos |
| Model Cards | Modelo |
| Third-Party Model Due Diligence | Integración |
| Risk Management File | Durante todo el ciclo |
| Fundamental Rights Impact Assessment | Cuando aplique |
| DPIA Input Pack | Cuando haya datos personales |
| Human Oversight Plan | Diseño |
| Testing & Validation Report | Validación |
| Cybersecurity Assessment | Validación |
| Instructions for Use | Pre-despliegue |
| Technical Documentation File | Antes de puesta en servicio |
| Conformity Assessment Pack | Pre-producción |
| EU Declaration of Conformity Draft | Si aplica |
| Post-market Monitoring Plan | Pre-producción |
| Incident Report Pack | Incidentes |
| Change Impact Assessment | Cambios |
| Substantial Modification Assessment | Cambios relevantes |
| Decommissioning Report | Retirada |

---

## 28. Funcionalidad diferencial: documentación técnica generada desde el código

La parte más potente de la plataforma sería convertir el código en evidencia regulatoria.

### 28.1. Ejemplo de trazabilidad

```text
Obligación AI Act
  ↓
Requisito interno
  ↓
Control técnico
  ↓
Historia de usuario / ticket
  ↓
Pull request
  ↓
Commit
  ↓
Test ejecutado
  ↓
Resultado
  ↓
Evidencia
  ↓
Capítulo del expediente técnico
```

Ejemplo:

| Elemento | Ejemplo |
|---|---|
| Obligación | Art. 15 — Robustez y ciberseguridad |
| Requisito interno | El sistema debe resistir prompt injection |
| Control técnico | Input filtering + tool permission sandbox |
| Código | `/src/security/prompt_guard.py` |
| Pull request | PR-482 |
| Test | `test_prompt_injection_resistance.py` |
| Evidencia | Resultado de red teaming |
| Documento | Sección 12.3 del expediente técnico |

---

## 29. MVP recomendable

No se recomienda construir toda la plataforma de golpe. Es preferible plantear tres versiones evolutivas.

---

### 29.1. MVP 1 — Compliance registry + technical documentation generator

**Objetivo:** registrar sistemas de IA y generar documentación técnica básica.

Incluye:

- intake del caso de uso;
- clasificación preliminar;
- role assessment;
- screening de prácticas prohibidas;
- matriz de obligaciones;
- repositorio de evidencias;
- generación de expediente técnico;
- exportación Word/PDF/Markdown;
- trazabilidad básica con Git/Jira.

---

### 29.2. MVP 2 — AI Act-native SDLC

**Objetivo:** integrar cumplimiento en el ciclo de desarrollo.

Incluye:

- gates de desarrollo;
- integración CI/CD;
- documentación automática de componentes de código;
- risk register;
- model registry;
- dataset cards;
- test evidence;
- human oversight design;
- instructions for use;
- validación pre-producción.

---

### 29.3. MVP 3 — Conformity & post-market platform

**Objetivo:** preparar evaluación de conformidad y monitorización continua.

Incluye:

- conformity readiness;
- declaration of conformity draft;
- CE/registro workflow;
- post-market monitoring;
- serious incident workflow;
- drift monitoring;
- change/substantial modification assessment;
- regulatory update engine;
- auditor portal.

---

## 30. Riesgos de diseño que conviene evitar

| Riesgo | Por qué es peligroso |
|---|---|
| Convertir la plataforma en mero formulario legal | No genera evidencia técnica real |
| Documentar al final | Rompe trazabilidad y genera expedientes artificiales |
| No integrarse con Git/MLOps | La documentación queda desconectada del sistema real |
| Clasificar solo por autodeclaración | Riesgo de errores de rol y riesgo |
| No versionar finalidad prevista | Impide detectar modificaciones sustanciales |
| No vincular tests a requisitos | La validación no demuestra conformidad |
| No diseñar logs desde el inicio | Luego puede ser técnicamente inviable |
| No capturar decisiones humanas | La supervisión humana queda declarativa |
| No gestionar modelos terceros | Se pierde trazabilidad de capacidades, límites y obligaciones downstream |
| Prometer “full compliance” | Jurídicamente arriesgado si no hay revisión caso a caso |

---

## 31. Conclusión ejecutiva

La plataforma debería diseñarse como un **sistema operativo de cumplimiento para el ciclo de vida de la IA**.

Su propuesta de valor no sería simplemente “ayudar a cumplir el Reglamento de IA”, sino:

> **Desarrollar sistemas de IA de forma que cada decisión de diseño, dato, modelo, línea relevante de código, prueba, riesgo, control, intervención humana, release, incidente y cambio quede automáticamente vinculado a una obligación regulatoria, a una evidencia y a una sección del expediente técnico.**

La clave jurídica y técnica está en esta tríada:

```text
Sistema de IA
   ↔ Requisitos del Reglamento de IA
      ↔ Evidencias técnicas generadas durante el desarrollo
```

Con esa arquitectura, la plataforma no sustituye el criterio jurídico ni técnico, pero sí transforma el cumplimiento en un proceso **nativo, continuo, trazable y auditable**.

---

## 32. Fuentes oficiales de referencia

- Reglamento (UE) 2024/1689, Reglamento de Inteligencia Artificial: https://eur-lex.europa.eu/eli/reg/2024/1689/oj  
- Comisión Europea — AI Act: marco regulatorio: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai  
- Comisión Europea — Guidelines on AI system definition: https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-ai-system-definition-facilitate-first-ai-acts-rules-application  
- Comisión Europea — Draft guidelines on classification of high-risk AI systems: https://digital-strategy.ec.europa.eu/en/library/draft-commission-guidelines-classification-high-risk-ai-systems  
- Comisión Europea — GPAI obligations: https://digital-strategy.ec.europa.eu/en/faqs/guidelines-obligations-general-purpose-ai-providers  
- Comisión Europea — AI Act standardisation: https://digital-strategy.ec.europa.eu/en/policies/ai-act-standardisation  

---
