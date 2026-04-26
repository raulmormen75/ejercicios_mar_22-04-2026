import { useEffect, useMemo } from "react";
import { InlineMath } from "react-katex";
import { SectionBlock } from "./components/SectionBlock";
import { SummaryImageCard } from "./components/SummaryImageCard";
import { ScenarioLab } from "./components/ScenarioLab";
import { FormulaBlock } from "./components/FormulaBlock";
import { advancedNotes, lessonModules, scenarios } from "./content/lesson-content";
import type { SectionImageSpec } from "./types";
import { HOTELLING_HERO_IMAGE_PUBLIC_PATH, imageManifest } from "./content/image-manifest";
import { formatNumber } from "./utils/formatters";

const sections = [
  { id: "hero", label: "Inicio" },
  { id: "panorama", label: "Panorama del tema" },
  { id: "modelo-lineal", label: "Modelo lineal y supuestos" },
  { id: "consumidor-indiferente", label: "Consumidor indiferente" },
  { id: "demandas-ganancias", label: "Demandas y ganancias" },
  { id: "reacciones-equilibrio", label: "Funciones de reacción y equilibrio" },
  { id: "escenarios", label: "Guía de escenarios" },
  { id: "resumen", label: "Qué cambia entre escenarios" },
  { id: "extensiones", label: "Anexos opcionales" },
];

const formatLatexNumber = (value: number) => formatNumber(value).replaceAll(",", "{,}");

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

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);

      if (!id) {
        return;
      }

      document.getElementById(id)?.scrollIntoView({ block: "start" });
    };

    const timers = [0, 120, 420, 900].map((delay) => window.setTimeout(scrollToHash, delay));
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

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
              <span>
                <InlineMath math="p_A" />
              </span>
              <span>
                <InlineMath math="p_B" />
              </span>
              <span>
                <InlineMath math="x^*" />
              </span>
              <span>
                <InlineMath math="q_A" />
              </span>
              <span>
                <InlineMath math="q_B" />
              </span>
              <span>
                <InlineMath math="\\pi_A" />
              </span>
              <span>
                <InlineMath math="\\pi_B" />
              </span>
            </div>
            {comparisonRows.map((row) => (
              <div key={row.id} className="comparison-row">
                <span>{row.title}</span>
                <span>
                  <InlineMath math={formatLatexNumber(row.pA)} />
                </span>
                <span>
                  <InlineMath math={formatLatexNumber(row.pB)} />
                </span>
                <span>
                  <InlineMath math={formatLatexNumber(row.xStar)} />
                </span>
                <span>
                  <InlineMath math={formatLatexNumber(row.qA)} />
                </span>
                <span>
                  <InlineMath math={formatLatexNumber(row.qB)} />
                </span>
                <span>
                  <InlineMath math={formatLatexNumber(row.piA)} />
                </span>
                <span>
                  <InlineMath math={formatLatexNumber(row.piB)} />
                </span>
              </div>
            ))}
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

        <section id="extensiones" className="section-block section-block--secondary annex-section">
          <div className="section-block__header">
            <p className="eyebrow">Anexos opcionales</p>
            <h2>Anexos opcionales</h2>
            <p className="section-block__goal">
              Estos anexos no son necesarios para resolver la tarea. Se dejan como consulta por si el profesor usa otra convención o menciona el caso con tres empresas.
            </p>
          </div>

          <div className="extension-grid">
            <details className="extension-card">
              <summary>
                <span className="extension-card__tag">Anexo 1</span>
                <strong>{advancedNotes.cuadratico.title}</strong>
                <small>Consulta opcional</small>
              </summary>
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
            </details>

            <details className="extension-card">
              <summary>
                <span className="extension-card__tag">Anexo 2</span>
                <strong>{advancedNotes.tresEmpresas.title}</strong>
                <small>Consulta opcional</small>
              </summary>
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
            </details>
          </div>
        </section>
        <footer className="site-footer" aria-label="Créditos del material">
          <p>Material elaborado por el prof. Morales Mendoza Raul</p>
        </footer>
      </main>
    </div>
  );
}
