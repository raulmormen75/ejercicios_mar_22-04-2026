import { useEffect, useState } from "react";
import { FormulaBlock } from "./FormulaBlock";
import { ScenarioCharts } from "./ScenarioCharts";
import { StreetDiagram } from "./StreetDiagram";
import { SummaryImageCard } from "./SummaryImageCard";
import {
  clampResults,
  computeInteractiveResults,
  reactionPriceA,
  reactionPriceB,
} from "../content/calculations";
import type { ScenarioDefinition, SectionImageSpec } from "../types";
import { formatNumber, formatSignedNumber } from "../utils/formatters";

interface ScenarioLabProps {
  scenarios: ScenarioDefinition[];
  images: Record<string, SectionImageSpec>;
}

function describeChange(label: string, current: number, equilibrium: number, unit: string) {
  const delta = current - equilibrium;

  if (delta === 0) {
    return `${label} se mantiene igual que en el equilibrio.`;
  }

  return `${label} ${delta > 0 ? "sube" : "baja"} ${formatNumber(Math.abs(delta))} ${unit} frente al equilibrio.`;
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
  const differenceFromEquilibrium = {
    pA: prices.pA - activeScenario.equilibrium.pA,
    pB: prices.pB - activeScenario.equilibrium.pB,
  };
  const priceBounds = {
    pA: {
      min: Math.max(activeScenario.params.cA, activeScenario.equilibrium.pA - 20),
      max: activeScenario.equilibrium.pA + 20,
      equilibrium: activeScenario.equilibrium.pA,
    },
    pB: {
      min: Math.max(activeScenario.params.cB, activeScenario.equilibrium.pB - 20),
      max: activeScenario.equilibrium.pB + 20,
      equilibrium: activeScenario.equilibrium.pB,
    },
  };
  const liveInterpretation = [
    describeChange("La demanda de A", liveResults.qA, activeScenario.equilibrium.qA, "consumidores"),
    describeChange("La ganancia de A", liveResults.piA, activeScenario.equilibrium.piA, "unidades"),
    describeChange("La ganancia de B", liveResults.piB, activeScenario.equilibrium.piB, "unidades"),
  ].join(" ");

  return (
    <section id="escenarios" className="scenario-lab">
      <div className="section-block__header">
        <p className="eyebrow">Escenarios resueltos</p>
        <h2>Laboratorio de decisiones</h2>
        <p className="section-block__goal">
          Usa este espacio como un simulador: mueve los precios, observa la frontera del mercado
          y revisa cómo cambian la demanda y las ganancias sin perderte en la fórmula.
        </p>
      </div>

      <div className="scenario-guide" aria-label="Instrucciones de uso del laboratorio">
        <article>
          <span>1</span>
          <strong>Elige un escenario.</strong>
          <p>Empieza por el caso base y cambia después a los otros dos para comparar qué se mueve.</p>
        </article>
        <article>
          <span>2</span>
          <strong>Mueve un precio a la vez.</strong>
          <p>Si sube A o B, la frontera x* se desplaza y cambia cuántos consumidores atiende cada empresa.</p>
        </article>
        <article>
          <span>3</span>
          <strong>Lee la gráfica y vuelve al equilibrio.</strong>
          <p>La gráfica muestra el cambio en vivo. El botón de reinicio regresa al resultado original.</p>
        </article>
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

      <ScenarioCharts
        params={activeScenario.params}
        equilibrium={activeScenario.equilibrium}
        liveResults={liveResults}
        title="Gráfica dinámica del escenario"
        description="Demanda, ganancia y precio cambian al mover los controles."
        className="scenario-charts--wide"
        valueFormatter={(value) => formatNumber(value)}
      />

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
                <strong>{formatNumber(prices.pA)}</strong>
                <small>
                  Equilibrio: {formatNumber(activeScenario.equilibrium.pA)} · cambio{" "}
                  {formatSignedNumber(differenceFromEquilibrium.pA)}
                </small>
              </li>
              <li>
                <span>Precio de B</span>
                <strong>{formatNumber(prices.pB)}</strong>
                <small>
                  Equilibrio: {formatNumber(activeScenario.equilibrium.pB)} · cambio{" "}
                  {formatSignedNumber(differenceFromEquilibrium.pB)}
                </small>
              </li>
              <li>
                <span>Frontera x*</span>
                <strong>{formatNumber(liveResults.xStar)}</strong>
                <small>Punto donde al consumidor le cuesta igual comprar en A o B</small>
              </li>
              <li>
                <span>Demanda A</span>
                <strong>{formatNumber(liveResults.qA)}</strong>
                <small>Consumidores que quedan del lado de A</small>
              </li>
              <li>
                <span>Demanda B</span>
                <strong>{formatNumber(liveResults.qB)}</strong>
                <small>Consumidores que quedan del lado de B</small>
              </li>
              <li>
                <span>Ganancia de A</span>
                <strong>{formatNumber(liveResults.piA)}</strong>
                <small>Resultado actual</small>
              </li>
              <li>
                <span>Ganancia de B</span>
                <strong>{formatNumber(liveResults.piB)}</strong>
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
              <span>Precio actual de A: {formatNumber(prices.pA)}</span>
              <input
                type="range"
                min={priceBounds.pA.min}
                max={priceBounds.pA.max}
                step="1"
                value={prices.pA}
                onChange={(event) =>
                  setPrices((current) => ({ ...current, pA: Number(event.target.value) }))
                }
              />
              <span className="slider-grid__range">
                Mín. {formatNumber(priceBounds.pA.min)} · equilibrio{" "}
                {formatNumber(priceBounds.pA.equilibrium)} · máx. {formatNumber(priceBounds.pA.max)}
              </span>
              <small>
                Baja el precio para atraer más mercado; súbelo para probar si la ganancia compensa
                perder consumidores.
              </small>
            </label>
            <label>
              <span>Precio actual de B: {formatNumber(prices.pB)}</span>
              <input
                type="range"
                min={priceBounds.pB.min}
                max={priceBounds.pB.max}
                step="1"
                value={prices.pB}
                onChange={(event) =>
                  setPrices((current) => ({ ...current, pB: Number(event.target.value) }))
                }
              />
              <span className="slider-grid__range">
                Mín. {formatNumber(priceBounds.pB.min)} · equilibrio{" "}
                {formatNumber(priceBounds.pB.equilibrium)} · máx. {formatNumber(priceBounds.pB.max)}
              </span>
              <small>
                Observa si B gana mercado al reducir precio o si conserva utilidad al cobrar más.
              </small>
            </label>
          </div>
        </div>

        <div className="scenario-side">
          <article className="step-card">
            <p className="step-card__title">Lectura rápida del resultado</p>
            <p>
              Con estos precios, A atiende {formatNumber(liveResults.qA)} consumidores y B atiende{" "}
              {formatNumber(liveResults.qB)}. La frontera queda en x* ={" "}
              {formatNumber(liveResults.xStar)}.
            </p>
            <FormulaBlock math={`x^*=${formatNumber(liveResults.xStar)}`} />
            <FormulaBlock
              math={`q_A=${formatNumber(liveResults.qA)},\\quad q_B=${formatNumber(liveResults.qB)}`}
            />
            <FormulaBlock
              math={`\\pi_A=${formatNumber(liveResults.piA)},\\quad \\pi_B=${formatNumber(
                liveResults.piB,
              )}`}
            />
          </article>

          <article className="step-card">
            <p className="step-card__title">Cómo interpretar el movimiento</p>
            <p>{liveInterpretation}</p>
            <FormulaBlock
              math={`R_A=${formatNumber(
                reactionPriceA(activeScenario.params, prices.pB),
              )},\\quad R_B=${formatNumber(reactionPriceB(activeScenario.params, prices.pA))}`}
            />
          </article>

          <article className="step-card">
            <p className="step-card__title">Equilibrio de referencia</p>
            <p>{activeScenario.verificationNote}</p>
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
