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

  const liveResults = clampResults(
    computeInteractiveResults(activeScenario.params, prices),
    activeScenario.params.L,
  );

  return (
    <section id="escenarios" className="scenario-lab">
      <div className="section-block__header">
        <p className="eyebrow">Escenarios resueltos</p>
        <h2>Laboratorio de comparación</h2>
        <p className="section-block__goal">
          Recorre cada caso y observa cómo cambian la frontera, la demanda y las ganancias cuando cambian los costos o la ubicación.
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
          <div className="scenario-panel__copy">
            <p className="scenario-panel__lead">{activeScenario.whyItChanges}</p>
            <ul className="metric-list">
              <li>
                <span>Precio de A</span>
                <strong>{activeScenario.equilibrium.pA}</strong>
              </li>
              <li>
                <span>Precio de B</span>
                <strong>{activeScenario.equilibrium.pB}</strong>
              </li>
              <li>
                <span>x*</span>
                <strong>{activeScenario.equilibrium.xStar}</strong>
              </li>
              <li>
                <span>Ganancia de A</span>
                <strong>{activeScenario.equilibrium.piA}</strong>
              </li>
              <li>
                <span>Ganancia de B</span>
                <strong>{activeScenario.equilibrium.piB}</strong>
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

      <SummaryImageCard spec={images[activeScenario.id]} takeaways={[
        {
          title: "Lectura rápida",
          text: activeScenario.whyItChanges,
        },
        {
          title: "Verificación",
          text: activeScenario.verificationNote,
        },
      ]} />
    </section>
  );
}
