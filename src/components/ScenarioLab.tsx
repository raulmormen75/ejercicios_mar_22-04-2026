import { useEffect, useState } from "react";
import { FormulaBlock } from "./FormulaBlock";
import { StreetDiagram } from "./StreetDiagram";
import { SummaryImageCard } from "./SummaryImageCard";
import {
  clampResults,
  computeInteractiveResults,
  reactionPriceA,
  reactionPriceB,
} from "../content/calculations";
import type { ScenarioDefinition, SectionImageSpec } from "../types";

interface ScenarioLabProps {
  scenarios: ScenarioDefinition[];
  images: Record<string, SectionImageSpec>;
}

export function ScenarioLab({ scenarios, images }: ScenarioLabProps) {
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioDefinition["id"]>("escenario-1");
  const activeScenario = scenarios.find((scenario) => scenario.id === activeScenarioId)!;
  const [prices, setPrices] = useState({
    pA: activeScenario.equilibrium.pA,
    pB: activeScenario.equilibrium.pB,
  });

  useEffect(() => {
    setPrices({
      pA: activeScenario.equilibrium.pA,
      pB: activeScenario.equilibrium.pB,
    });
  }, [activeScenario]);

  const resetPrices = () => {
    setPrices({
      pA: activeScenario.equilibrium.pA,
      pB: activeScenario.equilibrium.pB,
    });
  };

  const liveResults = clampResults(
    computeInteractiveResults(activeScenario.params, prices),
    activeScenario.params.L,
  );

  return (
    <section id="escenarios" className="scenario-lab">
      <div className="section-block__header">
        <p className="eyebrow">Escenarios resueltos</p>
        <h2>Laboratorio de decisiones</h2>
        <p className="section-block__goal">
          Mueve los precios y observa cómo cambian la frontera, la demanda y las ganancias.
          La idea no es memorizar el resultado, sino ver por qué se mueve.
        </p>
      </div>

      <div className="scenario-tabs" role="tablist" aria-label="Escenarios del modelo lineal">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            role="tab"
            aria-selected={scenario.id === activeScenario.id}
            className={`scenario-tab ${scenario.id === activeScenario.id ? "scenario-tab--active" : ""}`}
            onClick={() => setActiveScenarioId(scenario.id)}
          >
            <span>{scenario.shortLabel}</span>
            <strong>{scenario.title}</strong>
          </button>
        ))}
      </div>

      <div className="scenario-layout">
        <div className="scenario-panel">
          <div className="scenario-panel__toolbar">
            <span>Escenario activo</span>
            <button type="button" className="tiny-button" onClick={resetPrices}>
              Volver al equilibrio
            </button>
          </div>
          <div className="scenario-panel__copy">
            <p className="scenario-panel__lead">{activeScenario.whyItChanges}</p>
            <ul className="metric-list">
              <li>
                <span>Precio de A</span>
                <strong>{prices.pA}</strong>
                <small>Equilibrio: {activeScenario.equilibrium.pA}</small>
              </li>
              <li>
                <span>Precio de B</span>
                <strong>{prices.pB}</strong>
                <small>Equilibrio: {activeScenario.equilibrium.pB}</small>
              </li>
              <li>
                <span>x*</span>
                <strong>{liveResults.xStar}</strong>
                <small>Frontera actual</small>
              </li>
              <li>
                <span>Demanda A</span>
                <strong>{liveResults.qA}</strong>
                <small>qA = x*</small>
              </li>
              <li>
                <span>Demanda B</span>
                <strong>{liveResults.qB}</strong>
                <small>qB = L - x*</small>
              </li>
              <li>
                <span>Ganancia de A</span>
                <strong>{liveResults.piA}</strong>
                <small>Resultado actual</small>
              </li>
              <li>
                <span>Ganancia de B</span>
                <strong>{liveResults.piB}</strong>
                <small>Resultado actual</small>
              </li>
            </ul>
          </div>

          <StreetDiagram
            L={activeScenario.params.L}
            a={activeScenario.params.a}
            b={activeScenario.params.b}
            xStar={liveResults.xStar}
          />

          <div className="slider-grid">
            <label>
              <span>Precio actual de A: {prices.pA}</span>
              <input
                type="range"
                min={Math.max(activeScenario.params.cA, activeScenario.equilibrium.pA - 20)}
                max={activeScenario.equilibrium.pA + 20}
                step="1"
                value={prices.pA}
                onChange={(event) =>
                  setPrices((current) => ({ ...current, pA: Number(event.target.value) }))
                }
              />
            </label>
            <label>
              <span>Precio actual de B: {prices.pB}</span>
              <input
                type="range"
                min={Math.max(activeScenario.params.cB, activeScenario.equilibrium.pB - 20)}
                max={activeScenario.equilibrium.pB + 20}
                step="1"
                value={prices.pB}
                onChange={(event) =>
                  setPrices((current) => ({ ...current, pB: Number(event.target.value) }))
                }
              />
            </label>
          </div>
        </div>

        <div className="scenario-side">
          <article className="step-card">
            <p className="step-card__title">Resultado del escenario</p>
            <FormulaBlock math={`x^*=${liveResults.xStar}`} />
            <FormulaBlock math={`q_A=${liveResults.qA},\\quad q_B=${liveResults.qB}`} />
            <FormulaBlock math={`\\pi_A=${liveResults.piA},\\quad \\pi_B=${liveResults.piB}`} />
          </article>

          <article className="step-card">
            <p className="step-card__title">Comprobar igualdad de costos</p>
            <p>{activeScenario.verificationNote}</p>
            <FormulaBlock
              math={`R_A=${reactionPriceA(activeScenario.params, prices.pB)},\\quad R_B=${reactionPriceB(
                activeScenario.params,
                prices.pA,
              )}`}
            />
          </article>
        </div>
      </div>

      <SummaryImageCard
        spec={images[activeScenario.id]}
        description={activeScenario.whyItChanges}
        takeaways={[
          {
            title: "Lectura rápida",
            text: activeScenario.whyItChanges,
          },
          {
            title: "Verificación",
            text: activeScenario.verificationNote,
          },
        ]}
      />
    </section>
  );
}
