# Capa de control — Gates, evidencias y gobierno del desarrollo de sistemas de IA

**Versión:** 1.0  
**Fecha:** 11 de junio de 2026  
**Ámbito:** Plataforma AI Act-native para desarrollo de sistemas de IA  
**Capa:** Control / cumplimiento / evidencias / auditoría / release governance  

---

## 1. Propósito de la capa

La **Capa de control** es el sistema de gobierno de la plataforma. Su función es asegurar que ningún sistema de IA avance desde la idea hasta el despliegue sin haber superado los controles mínimos exigibles desde una perspectiva técnica, jurídica, de privacidad, seguridad, gestión de riesgos, documentación y cumplimiento del Reglamento de IA.

Esta capa convierte el desarrollo asistido por agentes y vibe coding en un proceso:

- gobernado;
- auditable;
- trazable;
- documentado;
- bloqueable;
- verificable;
- monitorizable.

La Capa de control debe ser el mecanismo que impida que la velocidad de desarrollo degrade la calidad regulatoria del sistema.

---

## 2. Principio rector

La Capa de control debe operar bajo el siguiente principio:

> **Nada se despliega si no puede explicarse, probarse, documentarse y auditarse.**

Esto implica que cada funcionalidad, modelo, dato, componente, release o cambio debe estar vinculado a:

- finalidad prevista;
- clasificación regulatoria;
- requisito aplicable;
- riesgo;
- control;
- prueba;
- evidencia;
- aprobación;
- documentación técnica;
- logs;
- monitorización.

---

## 3. Componentes principales de la capa

La Capa de control debe incluir los siguientes elementos:

1. Sistema de gates obligatorios.
2. Matriz requisito-control-evidencia.
3. Expediente técnico vivo.
4. Registro de riesgos.
5. Registro de decisiones.
6. Registro de aprobaciones.
7. Sistema de logs y auditoría.
8. Control de cambios.
9. Control de releases.
10. Bloqueo de despliegue.
11. Gestión de excepciones.
12. Monitorización post-despliegue.
13. Gestión de incidentes.
14. Evidencias exportables.
15. Panel de cumplimiento.

---

## 4. Sistema de gates obligatorios

Los gates son puntos de control que bloquean el avance si no existen evidencias suficientes.

### 4.1. Gate 0 — Idea válida

**Objetivo:** verificar que la idea puede entrar en la plataforma.

Bloquea si:

- la finalidad es manifiestamente ilícita;
- la petición es incompatible con políticas internas;
- la petición es insegura;
- la petición carece de contexto mínimo;
- la petición parece encajar en una práctica prohibida sin análisis adicional.

Evidencias mínimas:

- Idea Brief;
- solicitante;
- finalidad preliminar;
- unidad responsable;
- estado del proyecto.

### 4.2. Gate 1 — Intake y finalidad prevista

**Objetivo:** asegurar que existe una finalidad prevista clara.

Bloquea si:

- no se sabe para qué se diseña el sistema;
- no se han identificado usuarios;
- no se han identificado personas afectadas;
- no se conocen outputs esperados;
- no se conoce el contexto de uso;
- no se han delimitado usos excluidos.

Evidencias mínimas:

- AI System Intake Record;
- Intended Purpose Statement;
- User and Affected Persons Record;
- Use Limitations Record.

### 4.3. Gate 2 — Clasificación regulatoria

**Objetivo:** determinar obligaciones aplicables.

Bloquea si:

- no se ha determinado si existe sistema de IA;
- no se ha evaluado práctica prohibida;
- no se ha evaluado alto riesgo cuando hay indicios;
- no se ha identificado el rol regulatorio;
- no se ha evaluado si existen obligaciones de transparencia;
- no se ha analizado integración de GPAI cuando proceda.

Evidencias mínimas:

- Regulatory Classification Report;
- Role Assessment;
- Prohibited Practices Assessment;
- High-Risk Assessment;
- Applicable Obligations Map.

### 4.4. Gate 3 — Datos y modelos

**Objetivo:** asegurar que los datos y modelos están identificados y gobernados.

Bloquea si:

- existen datos sin origen documentado;
- existen datos personales sin evaluación;
- existen categorías especiales no justificadas;
- no hay linaje mínimo;
- el modelo no tiene ficha;
- el proveedor del modelo no está evaluado;
- la licencia no permite el uso previsto;
- no se conocen limitaciones del modelo.

Evidencias mínimas:

- Dataset Card;
- Data Lineage Record;
- Data Quality Report;
- Privacy Assessment;
- Model Card;
- Third-Party Model Assessment.

### 4.5. Gate 4 — Arquitectura y diseño

**Objetivo:** validar que el sistema puede cumplir desde diseño.

Bloquea si:

- no hay arquitectura documentada;
- no hay flujos de datos;
- no hay logging previsto;
- no hay control de acceso;
- no hay segregación de entornos;
- no hay mecanismo de supervisión humana cuando proceda;
- no hay estrategia de fallback o rollback;
- no hay diseño de monitorización.

Evidencias mínimas:

- AI System Architecture Record;
- Component Map;
- Data Flow Record;
- Logging Design;
- Human Oversight Design Card;
- Monitoring Design.

### 4.6. Gate 5 — Desarrollo

**Objetivo:** asegurar que el desarrollo es trazable.

Bloquea si:

- la tarea no cumple Definition of Ready;
- el código no está vinculado a requisito;
- el cambio no está vinculado a finalidad prevista;
- se introduce dependencia no aprobada;
- se elimina control existente;
- se modifica un modelo sin evaluación;
- se modifica un dato sin evaluación;
- no se generan tests.

Evidencias mínimas:

- Functional Requirement Record;
- Code Component Record;
- Pull Request Summary;
- Dependency Assessment;
- Test Plan;
- Documentation Update Record.

### 4.7. Gate 6 — Testing y validación

**Objetivo:** comprobar que la funcionalidad cumple los criterios definidos.

Bloquea si:

- faltan pruebas;
- hay pruebas críticas fallidas;
- no se ha probado robustez cuando procede;
- no se ha probado seguridad;
- no se ha probado logging;
- no se ha probado supervisión humana;
- no se han documentado resultados;
- existen vulnerabilidades críticas.

Evidencias mínimas:

- Testing & Validation Report;
- Security Assessment;
- Robustness Report;
- Bias Assessment cuando proceda;
- Human Oversight Validation;
- Test Evidence Record.

### 4.8. Gate 7 — Documentación técnica

**Objetivo:** asegurar que el expediente técnico está actualizado.

Bloquea si:

- faltan secciones obligatorias;
- la documentación no refleja la versión actual;
- no hay matriz requisito-control-evidencia;
- no existen instrucciones de uso;
- no se han documentado limitaciones;
- no se han documentado riesgos residuales;
- no se ha actualizado historial de cambios.

Evidencias mínimas:

- Technical Documentation File;
- Instructions for Use;
- Requirement-Control-Evidence Matrix;
- Release Documentation Pack;
- Version History.

### 4.9. Gate 8 — Conformidad y aprobación

**Objetivo:** verificar preparación para puesta en servicio o comercialización.

Bloquea si:

- hay obligaciones sin evidencia;
- hay riesgos residuales no aceptados;
- falta aprobación de responsables;
- falta plan de monitorización;
- falta proceso de incidentes;
- falta declaración o paquete de conformidad cuando proceda.

Evidencias mínimas:

- Conformity Readiness Report;
- Residual Risk Acceptance Record;
- Approval Record;
- Post-Market Monitoring Plan;
- Incident Management Procedure.

### 4.10. Gate 9 — Despliegue

**Objetivo:** controlar salida a producción.

Bloquea si:

- no se han superado gates anteriores;
- no hay entorno productivo validado;
- no hay logging activo;
- no hay monitorización activa;
- no hay rollback;
- no hay owner operativo;
- no hay soporte;
- no hay instrucciones para usuarios o deployers.

Evidencias mínimas:

- Deployment Plan;
- Production Readiness Report;
- Logging Activation Record;
- Monitoring Activation Record;
- Rollback Plan;
- Operational Owner Record.

### 4.11. Gate 10 — Cambio y reevaluación

**Objetivo:** controlar modificaciones posteriores.

Bloquea si:

- se modifica finalidad sin reevaluación;
- se cambia modelo sin evaluación;
- se cambian datos sin evaluación;
- se cambia contexto de uso sin evaluación;
- se reduce supervisión humana;
- se altera nivel de autonomía;
- no se ha evaluado modificación sustancial;
- no se han actualizado pruebas y documentación.

Evidencias mínimas:

- Change Impact Assessment;
- Substantial Modification Assessment;
- Updated Risk Register;
- Updated Technical Documentation;
- Regression Test Report;
- Release Approval Record.

---

## 5. Matriz requisito-control-evidencia

La matriz requisito-control-evidencia es el elemento central de la Capa de control.

### 5.1. Finalidad

Permite demostrar que cada obligación aplicable está vinculada a:

- un requisito interno;
- un control;
- una evidencia;
- un responsable;
- un estado;
- una fecha;
- un artefacto verificable.

### 5.2. Estructura mínima

| Campo | Descripción |
|---|---|
| ID obligación | Identificador normativo |
| Fuente | Reglamento, política interna, estándar o guía |
| Obligación | Descripción de la obligación |
| Aplicabilidad | Cuándo aplica |
| Sistema afectado | Sistema de IA |
| Requisito interno | Traducción operativa |
| Control | Medida técnica, organizativa o documental |
| Evidencia | Documento, test, log, commit, aprobación |
| Responsable | Owner del control |
| Estado | Pendiente, en curso, validado, no aplica |
| Justificación de no aplicabilidad | Cuando proceda |
| Gate asociado | Gate que lo controla |
| Fecha de validación | Fecha |
| Revisor | Persona o rol que valida |
| Enlace a evidencia | Referencia al artefacto |

### 5.3. Ejemplo

| ID obligación | Requisito interno | Control | Evidencia |
|---|---|---|---|
| RIA-ART11-001 | El sistema debe tener documentación técnica actualizada | Generador automático de expediente técnico | Technical Documentation File v1.2 |
| RIA-ART12-001 | El sistema debe registrar eventos relevantes | Logging estructurado de inferencias | Log Schema + pruebas de logging |
| RIA-ART14-001 | Debe existir supervisión humana efectiva | Workflow de revisión y override | Human Oversight Design Card |
| RIA-ART15-001 | Debe probarse robustez y ciberseguridad | Test suite de robustez y seguridad | Testing & Security Report |

---

## 6. Expediente técnico vivo

### 6.1. Concepto

El expediente técnico no debe ser un documento estático generado al final del proyecto. Debe ser un expediente vivo que se actualiza a medida que se crea el sistema.

### 6.2. Secciones mínimas

1. Descripción general del sistema.
2. Finalidad prevista.
3. Rol regulatorio.
4. Clasificación de riesgo.
5. Arquitectura.
6. Componentes.
7. Modelos.
8. Datos.
9. Desarrollo.
10. Riesgos.
11. Controles.
12. Supervisión humana.
13. Logs.
14. Transparencia e instrucciones de uso.
15. Pruebas.
16. Ciberseguridad.
17. Cambios.
18. Evaluación de conformidad.
19. Monitorización.
20. Incidentes.

### 6.3. Reglas

- Toda sección debe tener propietario.
- Toda afirmación relevante debe tener evidencia.
- Toda versión debe quedar congelada en cada release.
- Toda modificación debe quedar vinculada a cambio, commit o decisión.
- Toda ausencia de información debe figurar como gap documental.

---

## 7. Registro de riesgos

### 7.1. Finalidad

El registro de riesgos debe documentar la gestión de riesgos durante todo el ciclo de vida.

### 7.2. Estructura mínima

| Campo | Descripción |
|---|---|
| ID riesgo | Identificador |
| Categoría | Derechos, seguridad, privacidad, robustez, etc. |
| Descripción | Riesgo identificado |
| Causa | Origen del riesgo |
| Evento | Qué puede ocurrir |
| Consecuencia | Impacto |
| Personas afectadas | Colectivos o usuarios |
| Severidad | Baja, media, alta, crítica |
| Probabilidad | Baja, media, alta |
| Riesgo inherente | Nivel inicial |
| Controles | Medidas mitigadoras |
| Pruebas | Evidencias de eficacia |
| Riesgo residual | Nivel tras controles |
| Decisión | Aceptar, mitigar, transferir, evitar |
| Responsable | Owner |
| Fecha de revisión | Fecha |
| Estado | Abierto, mitigado, aceptado, cerrado |

---

## 8. Registro de decisiones

### 8.1. Finalidad

Debe capturar decisiones relevantes que afecten al sistema.

### 8.2. Decisiones que deben registrarse

- clasificación regulatoria;
- selección de modelo;
- selección de datos;
- aceptación de riesgo residual;
- exclusión de un requisito;
- aprobación de release;
- aprobación de excepción;
- cambio de finalidad;
- modificación sustancial;
- retirada del sistema;
- notificación de incidente.

### 8.3. Estructura

```text
Decision ID:
Fecha:
Sistema:
Versión:
Decisión:
Alternativas consideradas:
Justificación:
Evidencias:
Riesgos:
Aprobador:
Condiciones:
Fecha de revisión:
```

---

## 9. Sistema de logs y auditoría

### 9.1. Tipos de logs

| Tipo | Finalidad |
|---|---|
| Development logs | Evidenciar desarrollo y cambios |
| Compliance logs | Registrar decisiones y gates |
| Data logs | Linaje y transformaciones |
| Model logs | Versiones y cambios de modelo |
| Inference logs | Inputs, outputs y contexto de inferencia |
| Human oversight logs | Intervención humana |
| Security logs | Accesos, ataques, anomalías |
| Monitoring logs | Drift, rendimiento, errores |
| Incident logs | Incidentes y acciones correctivas |

### 9.2. Requisitos

Los logs deben ser:

- completos;
- proporcionales;
- seguros;
- interpretables;
- exportables;
- protegidos frente a alteración;
- sujetos a control de acceso;
- compatibles con protección de datos;
- vinculados a versión;
- sujetos a política de conservación.

---

## 10. Control de cambios

Todo cambio debe pasar por evaluación de impacto.

### 10.1. Cambios que activan reevaluación

- cambio de finalidad;
- cambio de modelo;
- cambio de proveedor;
- cambio de dataset;
- cambio de fuente documental;
- cambio de usuarios;
- cambio de personas afectadas;
- cambio de contexto;
- cambio de autonomía;
- cambio de interfaz;
- cambio de supervisión humana;
- cambio de umbrales;
- cambio de arquitectura;
- cambio de país o sector de uso.

### 10.2. Resultado de la evaluación

La plataforma debe determinar si el cambio:

- no afecta a cumplimiento;
- requiere pruebas adicionales;
- requiere actualizar documentación;
- requiere revisar riesgos;
- requiere revisar clasificación;
- requiere aprobación adicional;
- puede constituir modificación sustancial;
- bloquea release.

---

## 11. Gestión de excepciones

La plataforma puede permitir excepciones solo bajo control estricto.

### 11.1. Reglas

- Toda excepción debe tener justificación.
- Toda excepción debe tener responsable.
- Toda excepción debe tener fecha de expiración.
- Toda excepción debe tener riesgo aceptado.
- Las excepciones no pueden permitir prácticas prohibidas.
- Las excepciones no pueden eliminar controles críticos sin aprobación formal.
- Las excepciones deben aparecer en el expediente.

### 11.2. Estructura

```text
Exception ID:
Sistema:
Versión:
Control exceptuado:
Justificación:
Riesgo asociado:
Medidas compensatorias:
Aprobador:
Fecha de inicio:
Fecha de expiración:
Condiciones:
Estado:
```

---

## 12. Bloqueo de despliegue

La Capa de control debe tener capacidad real de bloqueo técnico.

No basta con advertir. Debe poder impedir:

- merge a rama protegida;
- despliegue en producción;
- publicación de API;
- activación de modelo;
- conexión a datos reales;
- exposición a usuarios finales;
- cambio de configuración productiva;
- eliminación de logs;
- eliminación de supervisión humana.

### 12.1. Integraciones de bloqueo

Debe integrarse con:

- CI/CD;
- repositorio de código;
- feature flags;
- model registry;
- API gateway;
- entorno cloud;
- IAM;
- herramientas de MLOps;
- plataforma de observabilidad.

---

## 13. Release governance

Cada release debe tener un expediente de release.

### 13.1. Contenido mínimo

- versión;
- funcionalidades incluidas;
- cambios respecto de versión anterior;
- componentes modificados;
- modelos modificados;
- datos modificados;
- riesgos actualizados;
- pruebas ejecutadas;
- vulnerabilidades abiertas;
- documentación actualizada;
- gates superados;
- aprobaciones;
- plan de rollback;
- plan de monitorización.

### 13.2. Estados de release

| Estado | Significado |
|---|---|
| Draft | En preparación |
| In validation | En pruebas |
| Blocked | Bloqueado por gate |
| Conditionally approved | Aprobado con condiciones |
| Approved | Aprobado |
| Deployed | Desplegado |
| Rolled back | Revertido |
| Retired | Retirado |

---

## 14. Monitorización post-despliegue

La Capa de control debe verificar que el sistema sigue funcionando conforme a su finalidad prevista.

### 14.1. Indicadores mínimos

- rendimiento;
- precisión;
- tasa de error;
- drift;
- uso fuera de finalidad;
- número de overrides humanos;
- reclamaciones;
- incidentes;
- anomalías de seguridad;
- cambios en datos;
- cambios en modelo;
- degradación de servicio;
- alertas de sesgo;
- feedback de usuarios.

### 14.2. Alertas

Debe generar alertas cuando:

- el rendimiento cae por debajo de umbral;
- aumenta la tasa de error;
- se detecta drift;
- se produce uso no previsto;
- se produce incidente;
- se incrementan overrides humanos;
- hay feedback negativo recurrente;
- se detecta vulnerabilidad crítica;
- se actualiza un modelo de tercero;
- cambia la normativa aplicable.

---

## 15. Gestión de incidentes

### 15.1. Flujo

```text
Detección
  ↓
Registro
  ↓
Clasificación
  ↓
Evaluación de gravedad
  ↓
Contención
  ↓
Análisis causal
  ↓
Acción correctiva
  ↓
Evaluación de notificación
  ↓
Actualización de riesgos
  ↓
Actualización documental
  ↓
Cierre
```

### 15.2. Registro mínimo

```text
Incident ID:
Fecha:
Sistema:
Versión:
Descripción:
Detección:
Impacto:
Personas afectadas:
Datos afectados:
Modelo afectado:
Causa preliminar:
Gravedad:
Acciones inmediatas:
Acciones correctivas:
Necesidad de notificación:
Responsable:
Estado:
```

---

## 16. Evidencias exportables

La plataforma debe permitir exportar evidencias para:

- auditoría interna;
- revisión legal;
- revisión de privacidad;
- revisión de seguridad;
- evaluación de conformidad;
- organismos notificados;
- autoridades de vigilancia de mercado;
- clientes;
- deployers;
- comités internos.

### 16.1. Paquetes exportables

| Paquete | Contenido |
|---|---|
| Technical Documentation Pack | Expediente técnico |
| Compliance Pack | Matriz requisito-control-evidencia |
| Risk Pack | Registro de riesgos y decisiones |
| Security Pack | Evaluaciones y vulnerabilidades |
| Data Pack | Dataset cards y linaje |
| Model Pack | Model cards y evaluaciones |
| Release Pack | Evidencias de release |
| Incident Pack | Registro y acciones de incidentes |
| Audit Pack | Logs, decisiones y aprobaciones |

---

## 17. Panel de cumplimiento

La Capa de control debe ofrecer un dashboard con:

- sistemas por estado;
- sistemas por clasificación;
- gates bloqueados;
- obligaciones pendientes;
- riesgos críticos;
- documentación incompleta;
- releases pendientes;
- incidentes abiertos;
- excepciones activas;
- cambios sin evaluar;
- modelos de tercero críticos;
- sistemas con monitorización degradada.

---

## 18. Roles y aprobaciones

### 18.1. Roles mínimos

| Rol | Función |
|---|---|
| Business Owner | Responsable funcional |
| Product Owner | Responsable de producto |
| Technical Owner | Responsable técnico |
| Legal Owner | Responsable jurídico |
| Privacy Owner | Responsable privacidad |
| Security Owner | Responsable seguridad |
| Risk Owner | Responsable riesgos |
| Compliance Reviewer | Revisor cumplimiento |
| Release Approver | Aprobador de release |
| Auditor | Revisión independiente |

### 18.2. Regla de segregación

La plataforma debe evitar que una misma persona cree, valide y apruebe controles críticos sin revisión independiente cuando el riesgo sea alto.

---

## 19. Indicadores de eficacia de la Capa de control

| Indicador | Finalidad |
|---|---|
| Porcentaje de sistemas con expediente completo | Medir madurez documental |
| Porcentaje de requisitos con evidencia | Medir cumplimiento trazable |
| Porcentaje de riesgos con control probado | Medir eficacia real |
| Número de releases bloqueadas | Medir prevención |
| Tiempo medio de cierre de gaps | Medir eficiencia |
| Número de excepciones activas | Controlar deuda de cumplimiento |
| Incidentes por sistema desplegado | Medir calidad operativa |
| Cambios sin evaluación | Detectar fallos de gobierno |
| Sistemas con monitorización activa | Medir control post-despliegue |
| Evidencias exportables completas | Medir auditabilidad |

---

## 20. Riesgos específicos de esta capa

| Riesgo | Mitigación |
|---|---|
| Exceso de burocracia | Automatización y reutilización de evidencias |
| Bloqueos innecesarios | Gates proporcionales al riesgo |
| Falsa sensación de conformidad | Evidencias obligatorias y revisión humana |
| Controles solo documentales | Vinculación a pruebas y logs |
| Excepciones permanentes | Caducidad y revisión periódica |
| Falta de integración técnica | Bloqueo real en CI/CD y despliegue |
| Documentación desactualizada | Actualización automática por release |
| Riesgos aceptados sin criterio | Aprobaciones formales y trazabilidad |

---

## 21. Resultado esperado

La Capa de control debe asegurar que la plataforma no sea simplemente una herramienta de creación rápida de sistemas de IA, sino un entorno de desarrollo gobernado.

Su resultado esperado es que todo sistema de IA tenga:

1. finalidad prevista;
2. clasificación;
3. rol regulatorio;
4. obligaciones aplicables;
5. riesgos;
6. controles;
7. pruebas;
8. documentación técnica;
9. logs;
10. aprobaciones;
11. monitorización;
12. trazabilidad de cambios;
13. evidencias exportables.

La Capa de control representa la diferencia entre una plataforma de vibe coding y una plataforma empresarial de desarrollo de sistemas de IA conforme, trazable y auditable.

> **La creatividad ocurre en la experiencia; la inteligencia operativa vive en los agentes; la confianza se garantiza en la Capa de control.**
