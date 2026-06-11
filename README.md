# Plataforma AI Act-native — desarrollo de sistemas de IA con vibe coding regulado

Aplicación web que implementa el MVP de la plataforma descrita en los documentos de diseño de `/docs`:
una plataforma de desarrollo **gobernado** de sistemas de IA donde cada intención del usuario se convierte en
finalidad prevista, clasificación regulatoria, obligaciones, riesgos, controles, evidencias, documentación técnica
y gates de aprobación, conforme al Reglamento (UE) 2024/1689 (Reglamento de IA).

> **Principio rector:** el usuario construye con lenguaje natural; la plataforma convierte cada intención en
> diseño, código, prueba, control y evidencia. *Nada se despliega si no puede explicarse, probarse, documentarse y auditarse.*

## Funcionalidades del MVP

1. **Registro de sistemas de IA** — registro maestro con ficha, owner, unidad, estado del ciclo de vida y versión.
2. **Intake conversacional** — un agente guiado transforma la idea en un *AI System Intake Record*, analiza la
   descripción en lenguaje natural para sugerir ámbitos del Anexo III y obligaciones de transparencia, y ejecuta
   el screening de prácticas prohibidas (Art. 5) con bloqueo duro.
3. **Motor de clasificación regulatoria** — árbol de decisión versionado: ¿es sistema de IA? → ¿práctica prohibida? →
   ¿alto riesgo (Anexo III)? → ¿transparencia (Art. 50)? → ¿GPAI? → rol regulatorio. Emite motivación trazable y
   activa automáticamente las obligaciones aplicables.
4. **Registro de finalidad prevista** — *Intended Purpose Statement* versionado; cambiar la finalidad de un sistema
   desplegado marca el cambio como pendiente de evaluación de modificación sustancial (Gate 10).
5. **Registro de datos y modelos** — dataset cards (origen, datos personales, privacidad, calidad, linaje) y model
   cards (proveedor, licencia, limitaciones, GPAI); las fichas incompletas bloquean el Gate 3.
6. **Registro de riesgos** — taxonomía, severidad/probabilidad, controles, riesgo residual y decisión; los riesgos
   críticos abiertos bloquean el Gate 6 y los altos sin decisión bloquean el Gate 8.
7. **Matriz requisito-control-evidencia** — compliance as code: cada obligación con fuente normativa, requisito
   interno, control, evidencia esperada, gate asociado, estado, responsable y evidencias vinculadas.
8. **Panel de gates (Gate 0–10)** — checks automáticos en vivo sobre el expediente + aprobación humana registrada;
   los gates no son eludibles y se re-bloquean si el expediente deja de cumplir.
9. **Generador de documentación técnica** — expediente técnico vivo en Markdown (20 secciones, alineado con el
   Anexo IV), con los huecos marcados explícitamente como *gaps documentales*; exportable, junto con el Audit Pack.
10. **Flujo de aprobación de release** — release governance con estados (borrador, bloqueada, aprobada con
    condiciones, aprobada, desplegada, revertida); la decisión valida los gates G0–G9 y queda auditada.

Todo queda registrado en un **log de auditoría** por sistema (compliance log) y persiste en `localStorage`.

## Ejecución

```bash
npm install
npm run dev      # desarrollo
npm run build    # producción
```

## Estructura

```
docs/                      Documentos de diseño (fuente de la implementación)
src/
  domain/
    constants.js           Contenido regulatorio: niveles, Anexo III, Art. 5, catálogo de obligaciones, gates
    classification.js      Motor de clasificación regulatoria + análisis de la descripción
    gates.js               Motor de evaluación de gates (checks automáticos)
    docGenerator.js        Generador del expediente técnico en Markdown
    intakeScript.js        Guion del intake conversacional
  store/usePlatformStore.js  Estado global (Zustand) con auditoría y persistencia
  components/              Dashboard, intake conversacional, detalle del sistema y pestañas
```
