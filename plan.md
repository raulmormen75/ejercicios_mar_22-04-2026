# Plan operativo

## Dirección editorial

- Idioma: español de México.
- Superficie: app didáctica web de marca personal de Raul.
- Tono: profesional, claro, sobrio y explicativo.
- Identidad visual: marfil claro `#F2F2EE`, negro profundo `#0B0B0B`, grafito `#2E2E2E`, azul noche `#1C2A3A`, acentos controlados en dorado `#C6A75E` y rojo vino `#6E1F28`.
- Regla de contenido: explicar con limpieza y sin mezclar el modelo lineal con el cuadrático dentro del flujo principal.

## Hito 1. Base didáctica y visual

- Objetivo: abrir con una vista breve que explique qué estudia el modelo de Hotelling y por qué importan precio y distancia.
- Pantallas o bloques a revisar: portada, introducción y nota metodológica.

Criterios de aceptación:
- el modelo lineal queda definido como ruta principal;
- la nota sobre costo lineal contra costo cuadrático aparece antes del desarrollo matemático;
- la interfaz usa la paleta de Raul sin saturación visual;
- el texto inicial se puede leer rápido y sin párrafos pesados.

## Hito 2. Desarrollo matemático guiado

- Objetivo: ordenar el recorrido en consumidor indiferente, demandas, ganancias, funciones de reacción y equilibrio.
- Pantallas o bloques a revisar: desarrollo paso a paso y resumen de fórmulas.

Criterios de aceptación:
- cada bloque resuelve una sola idea;
- las fórmulas siguen el orden de `Tarea.txt`;
- la explicación acompaña la matemática y no la repite;
- no hay saltos entre una ecuación y la siguiente.

## Hito 3. Escenarios resueltos

- Objetivo: mostrar tres escenarios principales con resultados numéricos consistentes.
- Pantallas o bloques a revisar: escenario 1, escenario 2, escenario 3 y comparativo final.

Criterios de aceptación:
- escenario 1 muestra `p_A = 210`, `p_B = 210`, `x* = 50`, `q_A = 50`, `q_B = 50`, `pi_A = 10000`, `pi_B = 10000`;
- escenario 2 muestra `p_A = 84`, `p_B = 88`, `x* = 32`, `q_A = 32`, `q_B = 28`, `pi_A = 2048`, `pi_B = 1568`;
- escenario 3 muestra `p_A = 100`, `p_B = 100`, `x* = 50`, `q_A = 50`, `q_B = 50`, `pi_A = 5000`, `pi_B = 5000`;
- cada escenario incluye una interpretación breve y entendible.

## Hito 4. Extensiones secundarias

- Objetivo: dejar el anexo cuadrático y el caso de tres empresas como contenido complementario.
- Pantallas o bloques a revisar: anexo cuadrático y referencia del pizarrón.

Criterios de aceptación:
- el anexo está etiquetado como secundario;
- la app no confunde resultados lineales con cuadráticos;
- el caso de tres empresas no rompe el flujo principal;
- si alguna extensión genera ruido, se oculta antes de entrega.

## Hito 5. Cierre y verificación

- Objetivo: validar navegación, legibilidad, resultados y arranque de la app antes de cerrar.

Criterios de aceptación:
- la app corre en modo desarrollo sin error de arranque;
- no hay errores visibles en consola;
- la navegación entre bloques funciona en escritorio y móvil;
- los smoke tests mínimos pasan completos.

## Smoke tests mínimos

1. Abrir la app y confirmar que la vista inicial presenta el modelo lineal como ruta principal.
2. Entrar al desarrollo matemático y verificar que el consumidor indiferente aparece antes de demandas y ganancias.
3. Revisar el escenario 1 y confirmar los siete valores esperados.
4. Revisar el escenario 2 y confirmar los siete valores esperados.
5. Revisar el escenario 3 y confirmar los siete valores esperados.
6. Entrar al anexo cuadrático y confirmar que se presenta como extensión, no como flujo base.
7. Probar la vista móvil y revisar que fórmulas, tarjetas y botones no se recorten.

## Regla de parada

- Si falla cualquier resultado numérico, la entrega se detiene y se corrige antes de continuar.
- Si la interfaz mezcla lineal y cuadrático en un mismo recorrido, la entrega se detiene y se simplifica.
- Si no existe una forma real de correr la app, no se marca como lista para revisión final.
