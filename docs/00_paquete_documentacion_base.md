# Paquete completo — Plataforma AI Act-native para desarrollo de sistemas de IA con vibe coding regulado

Este paquete contiene la documentación base para construir, mediante vibe coding, una plataforma de desarrollo de sistemas de IA que integre cumplimiento nativo del Reglamento de IA.

## Documentos incluidos

1. `propuesta_plataforma_ai_act_native.md`  
   Documento matriz con la propuesta completa de plataforma, módulos, arquitectura, flujos, gates, documentación técnica, riesgos, controles, MVP y diseño técnico de alto nivel.

2. `01_capa_experiencia_vibe_coding_regulado.md`  
   Diseño de la capa de experiencia: interfaz conversacional, flujos de usuario, pantallas, modos de interacción y UX de cumplimiento.

3. `02_capa_agentes_orquestacion_ai_act_native.md`  
   Diseño de la capa de agentes: agentes especializados, instrucciones permanentes, responsabilidades, salidas esperadas y coordinación entre agentes.

4. `03_capa_control_gates_evidencias_gobierno.md`  
   Diseño de la capa de control: gates, matriz requisito-control-evidencia, expediente técnico vivo, logs, auditoría, release governance, incidentes y monitorización.

## Prompt recomendado para iniciar el desarrollo

Usa este prompt en la herramienta de vibe coding:

```text
Quiero construir una plataforma AI Act-native para desarrollar sistemas de IA mediante vibe coding regulado.

Antes de empezar, lee y utiliza como fuente principal estos documentos Markdown del proyecto:

1. propuesta_plataforma_ai_act_native.md
2. 01_capa_experiencia_vibe_coding_regulado.md
3. 02_capa_agentes_orquestacion_ai_act_native.md
4. 03_capa_control_gates_evidencias_gobierno.md

El objetivo es crear una aplicación que permita a los usuarios diseñar, desarrollar, documentar, validar y monitorizar sistemas de IA cumpliendo de forma nativa con el Reglamento de IA.

La plataforma debe permitir que el usuario describa en lenguaje natural lo que quiere construir, pero cada petición debe transformarse en:

- finalidad prevista;
- clasificación regulatoria;
- rol regulatorio;
- requisitos aplicables;
- riesgos;
- controles;
- datos y modelos afectados;
- pruebas;
- evidencias;
- documentación técnica;
- gates de aprobación.

No quiero una simple app de generación de código. Quiero una plataforma de desarrollo gobernado, donde el vibe coding esté controlado por agentes, gates, documentación viva y trazabilidad regulatoria.

Empieza construyendo un MVP funcional con estas partes:

1. Registro de sistemas de IA.
2. Intake conversacional del caso de uso.
3. Motor básico de clasificación regulatoria.
4. Registro de finalidad prevista.
5. Registro de datos y modelos.
6. Registro de riesgos.
7. Matriz requisito-control-evidencia.
8. Panel de gates.
9. Generador de documentación técnica en Markdown.
10. Flujo básico de aprobación de release.

Diseña primero la arquitectura de carpetas, entidades, componentes, pantallas y flujo de usuario. Después implementa paso a paso el MVP, priorizando claridad, trazabilidad y extensibilidad.

La lógica de la aplicación debe seguir esta secuencia:

Idea del usuario → finalidad prevista → clasificación regulatoria → obligaciones aplicables → arquitectura → datos y modelos → riesgos → controles → código → pruebas → documentación técnica → evaluación de conformidad → despliegue controlado → monitorización continua.

No avances directamente a producción ni generes funcionalidades aisladas sin conectarlas con el expediente del sistema de IA.

Cada funcionalidad que implementes debe quedar vinculada a un requisito, un riesgo, un control, una prueba y una evidencia documental.
```

## Enfoque de construcción recomendado

La construcción debería realizarse por fases:

1. **MVP 1 — Registro y documentación**
   - Registro de sistemas de IA.
   - Intake del caso de uso.
   - Finalidad prevista.
   - Clasificación preliminar.
   - Matriz de obligaciones.
   - Generador de documentación técnica.

2. **MVP 2 — Desarrollo gobernado**
   - Capa de agentes.
   - Backlog regulado.
   - Registro de datos y modelos.
   - Registro de riesgos.
   - Gates de desarrollo.
   - Evidencias vinculadas a tareas.

3. **MVP 3 — Conformidad y operación**
   - Evaluación de conformidad.
   - Release governance.
   - Monitorización post-despliegue.
   - Gestión de incidentes.
   - Evaluación de cambios y modificaciones sustanciales.

## Principio rector

La plataforma debe permitir creatividad en la construcción, pero disciplina en la validación.

El usuario puede construir con lenguaje natural; la plataforma debe convertir cada intención en diseño, código, prueba, control y evidencia.
