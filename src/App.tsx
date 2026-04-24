import { useMemo } from "react";
import { InlineMath } from "react-katex";
import { SectionBlock } from "./components/SectionBlock";
import { SummaryImageCard } from "./components/SummaryImageCard";
import { ScenarioLab } from "./components/ScenarioLab";
import { FormulaBlock } from "./components/FormulaBlock";
import { advancedNotes, lessonModules, scenarios } from "./content/lesson-content";
import type { SectionImageSpec } from "./types";
import { HOTELLING_HERO_IMAGE_PUBLIC_PATH, imageManifest } from "./content/image-manifest";

const sections = [
  { id: "hero", label: "Inicio" },
  { id: "panorama", label: "Panorama del tema" },
  { id: "modelo-lineal", label: "Modelo lineal y supuestos" },
  { id: "consumidor-indiferente", label: "Consumidor indiferente" },
  { id: "demandas-ganancias", label: "Demandas y ganancias" },
  { id: "reacciones-equilibrio", label: "Funciones de reacción y equilibrio" },
  { id: "escenarios", label: "Laboratorio de decisiones" },
  { id: "resumen", label: "Qué cambia entre escenarios" },
  { id: "extensiones", label: "Rutas opcionales" },
];

export default function App() {
  const images = useMemo(
    () =>
      imageManifest.reduce<Record<string, SectionImageSpec>>((accumulator: Record<string, SectionImageSpec>, image: SectionImageSpec) => {
        accumulator[image.sectionId] = image;
        return accumulator;
      }, {}),
    [],
  );

  const comparisonRows = scenarios.map((scenario) => ({
    id: scenario.id,
    title: scenario.shortLabel,
    ...scenario.equilibrium,
  }));

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="topbar__brand" href="#hero" aria-label="Volver al inicio">
          <span>
            <strong>Modelo de Hotelling</strong>
            <small>Guía para resolver la tarea paso a paso</small>
          </span>
        </a>
        <nav aria-label="Navegación principal">
          <ul className="topbar__nav">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <section id="hero" className="hero">
          <div className="hero__copy">
            <h1>Competencia espacial explicada con mapa, fórmulas y decisiones.</h1>
            <p className="hero__lead">
              Una ruta didáctica para entender el ejercicio de Hotelling paso a paso: primero la intuición,
              después la frontera del mercado y al final el equilibrio de Nash.
            </p>
          </div>

          <div className="hero__visual">
            <div className="hero-card">
              <div className="hero-card__header">
                <p className="hero-card__title">Mapa de decisión</p>
                <span>costo total</span>
              </div>
              <div className="hero-card__graphic">
                <img
                  src={HOTELLING_HERO_IMAGE_PUBLIC_PATH}
                  alt="Lámina completa del costo total con pasos, fórmula y mapa de decisión entre A y B."
                  className="hero-card__image"
                  loading="eager"
                />
              </div>
            </div>

            <div className="hero__signal" aria-hidden="true">
              <span>
                <InlineMath math={"q_A = x^*"} />
              </span>
              <span>
                <InlineMath math={"q_B = L - x^*"} />
              </span>
            </div>
          </div>
        </section>

        {lessonModules.map((module) => (
          <SectionBlock key={module.id} module={module} image={images[module.id]} />
        ))}

        <ScenarioLab scenarios={scenarios} images={images} />

        <section id="resumen" className="section-block">
          <div className="section-block__header">
            <p className="eyebrow">Comparación final</p>
            <h2>Qué cambia entre escenarios</h2>
            <p className="section-block__goal">
              El cuadro final ayuda a distinguir cuándo domina la simetría y cuándo aparece una ventaja por costos.
            </p>
          </div>

          <div className="comparison-table">
            <div className="comparison-row comparison-row--head">
              <span>Escenario</span>
              <span>pA</span>
              <span>pB</span>
              <span>x*</span>
              <span>qA</span>
              <span>qB</span>
              <span>πA</span>
              <span>πB</span>
            </div>
            {comparisonRows.map((row) => (
              <div key={row.id} className="comparison-row">
                <span>{row.title}</span>
                <span>{row.pA}</span>
                <span>{row.pB}</span>
                <span>{row.xStar}</span>
                <span>{row.qA}</span>
                <span>{row.qB}</span>
                <span>{row.piA}</span>
                <span>{row.piB}</span>
              </div>
            ))}
          </div>

          <div className="formula-grid">
            <FormulaBlock math={"\\text{Escenario 1: simetría pura}"} />
            <FormulaBlock math={"\\text{Escenario 2: ventaja de costos para A}"} />
            <FormulaBlock math={"\\text{Escenario 3: simetría con ubicaciones interiores}"} />
          </div>

          <SummaryImageCard
            spec={images.resumen}
            description="El cierre ayuda a distinguir cuándo domina la simetría y cuándo aparece una ventaja por costos."
            takeaways={[
              {
                title: "Simetría",
                text: "Cuando costos y posiciones están balanceados, el mercado se reparte por igual.",
              },
              {
                title: "Ventaja",
                text: "Si una empresa produce más barato, la frontera se mueve y el equilibrio se inclina a su favor.",
              },
            ]}
          />
        </section>

        <section id="extensiones" className="section-block">
          <div className="section-block__header">
            <p className="eyebrow">Extensiones avanzadas</p>
            <h2>Rutas opcionales para conectar con el pizarrón</h2>
            <p className="section-block__goal">
              Estas secciones no forman parte del trayecto obligatorio. Se dejan como apoyo cuando el profesor use otra convención o mencione tres empresas.
            </p>
          </div>

          <div className="extension-grid">
            <article className="extension-card">
              <p className="extension-card__tag">Extensión 1</p>
              <h3>{advancedNotes.cuadratico.title}</h3>
              <p>{advancedNotes.cuadratico.summary}</p>
              <div className="formula-grid">
                {advancedNotes.cuadratico.formulas.map((formula) => (
                  <FormulaBlock key={formula} math={formula} />
                ))}
              </div>
              <ul className="extension-list">
                {advancedNotes.cuadratico.observations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <SummaryImageCard
                spec={images[advancedNotes.cuadratico.summaryImageId]}
                description={advancedNotes.cuadratico.summary}
                takeaways={advancedNotes.cuadratico.observations.slice(0, 2).map((item, index) => ({
                  title: index === 0 ? "Cambio de escala" : "Cuidado metodológico",
                  text: item,
                }))}
              />
            </article>

            <article className="extension-card">
              <p className="extension-card__tag">Extensión 2</p>
              <h3>{advancedNotes.tresEmpresas.title}</h3>
              <p>{advancedNotes.tresEmpresas.summary}</p>
              <div className="formula-grid">
                {advancedNotes.tresEmpresas.formulas.map((formula) => (
                  <FormulaBlock key={formula} math={formula} />
                ))}
              </div>
              <ul className="extension-list">
                {advancedNotes.tresEmpresas.observations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <SummaryImageCard
                spec={images[advancedNotes.tresEmpresas.summaryImageId]}
                description={advancedNotes.tresEmpresas.summary}
                takeaways={advancedNotes.tresEmpresas.observations.slice(0, 2).map((item, index) => ({
                  title: index === 0 ? "Posición central" : "Lectura del resultado",
                  text: item,
                }))}
              />
            </article>
          </div>
        </section>
        <footer className="site-footer" aria-label="Créditos del material">
          <p>Material elaborado por el prof. Morales Mendoza Raul</p>
        </footer>
      </main>
    </div>
  );
}
