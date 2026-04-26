import { useEffect, useState } from "react";
import { FormulaBlock } from "./FormulaBlock";
import { ScenarioCharts } from "./ScenarioCharts";
import { SummaryImageCard } from "./SummaryImageCard";
import {
  clampResults,
  computeInteractiveResults,
} from "../content/calculations";
import type { FormulaStep, ScenarioDefinition, SectionImageSpec } from "../types";
import { formatNumber, formatSignedNumber } from "../utils/formatters";

interface ScenarioLabProps {
  scenarios: ScenarioDefinition[];
  images: Record<string, SectionImageSpec>;
}

function describeChange(label: string, current: number, equilibrium: number, unit: string) {
  const delta = current - equilibrium;

  if (delta === 0) {
    return `${label} queda igual que en la solución original.`;
  }

  return `${label} ${delta > 0 ? "sube" : "baja"} ${formatNumber(Math.abs(delta))} ${unit} frente a la solución original.`;
}

function getStepTitle(step: FormulaStep, index: number) {
  return step.label || `Paso ${index + 1}`;
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
  const adjustPrice = (key: "pA" | "pB", amount: number) => {
    const bounds = priceBounds[key];

    setPrices((current) => ({
      ...current,
      [key]: Math.min(Math.max(current[key] + amount, bounds.min), bounds.max),
    }));
  };
  const liveInterpretation = [
    describeChange("La demanda de A", liveResults.qA, activeScenario.equilibrium.qA, "consumidores"),
    describeChange("La ganancia de A", liveResults.piA, activeScenario.equilibrium.piA, "unidades"),
    describeChange("La ganancia de B", liveResults.piB, activeScenario.equilibrium.piB, "unidades"),
  ].join(" ");
  const solutionSteps = activeScenario.solutionSteps;
  const equilibriumInterpretation = activeScenario.equilibriumInterpretation;

  return (
    <section id="escenarios" className="scenario-lab">
      <div className="section-block__header">
        <p className="eyebrow">Guía paso a paso</p>
        <h2>Resolvamos los tres escenarios</h2>
        <p className="section-block__goal">
          Aquí vas de la mano: primero lees el planteamiento, luego sustituyes los datos en la fórmula
          y al final revisas qué significa el resultado. El simulador queda como apoyo para experimentar.
        </p>
      </div>

      <div className="scenario-guide" aria-label="Datos rápidos del escenario">
        <article>
          <span>🎯</span>
          <strong>Caso activo</strong>
          <p>{activeScenario.shortLabel}</p>
        </article>
        <article>
          <span>💰</span>
          <strong>Precios de equilibrio</strong>
          <p>
            A: {formatNumber(activeScenario.equilibrium.pA)} · B:{" "}
            {formatNumber(activeScenario.equilibrium.pB)}
          </p>
        </article>
        <article>
          <span>📍</span>
          <strong>Frontera x*</strong>
          <p>{formatNumber(activeScenario.equilibrium.xStar)} en equilibrio.</p>
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

      <article className="step-card" aria-label="Planteamiento del escenario">
        <p className="step-card__title">📌 Planteamiento</p>
        <p>{activeScenario.statement}</p>
      </article>

      <div className="scenario-results-row" aria-label="Solución paso a paso">
        {solutionSteps.map((step, index) => {
          return (
            <article className="step-card" key={`${activeScenario.id}-step-${index}`}>
              <p className="step-card__title">{getStepTitle(step, index)}</p>
              {step.math ? <FormulaBlock math={step.math} /> : null}
              <p>{step.description}</p>
            </article>
          );
        })}
      </div>

      <div className="scenario-results-row" aria-label="Resultado e interpretación">
        <article className="step-card">
          <p className="step-card__title">✅ Resultado final</p>
          <p>
            En la solución del ejercicio, A atiende {formatNumber(activeScenario.equilibrium.qA)} consumidores
            y B atiende {formatNumber(activeScenario.equilibrium.qB)}. La frontera queda en x* ={" "}
            {formatNumber(activeScenario.equilibrium.xStar)}.
          </p>
          <ul className="metric-list metric-list--compact">
            <li>
              <span>Frontera x*</span>
              <strong>{formatNumber(activeScenario.equilibrium.xStar)}</strong>
              <small>Punto de indiferencia</small>
            </li>
            <li>
              <span>Demanda A</span>
              <strong>{formatNumber(activeScenario.equilibrium.qA)}</strong>
              <small>Mercado de A</small>
            </li>
            <li>
              <span>Demanda B</span>
              <strong>{formatNumber(activeScenario.equilibrium.qB)}</strong>
              <small>Mercado de B</small>
            </li>
            <li>
              <span>Ganancia de A</span>
              <strong>{formatNumber(activeScenario.equilibrium.piA)}</strong>
              <small>Resultado de equilibrio</small>
            </li>
            <li>
              <span>Ganancia de B</span>
              <strong>{formatNumber(activeScenario.equilibrium.piB)}</strong>
              <small>Resultado de equilibrio</small>
            </li>
          </ul>
        </article>

        <article className="step-card">
          <p className="step-card__title">🔎 ¿Qué significa?</p>
          <p>{equilibriumInterpretation}</p>
          <p>{activeScenario.whyItChanges}</p>
        </article>
      </div>

      <article className="scenario-panel" aria-label="Simulador de precios">
        <div className="scenario-panel__toolbar">
          <span>🎛️ Prueba cambios</span>
          <button type="button" className="tiny-button" onClick={resetPrices}>
            Volver al equilibrio
          </button>
        </div>
        <div className="scenario-panel__copy">
          <p className="scenario-panel__lead">
            Mueve un precio a la vez y compara el resultado actual con la solución original.
          </p>
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
              <span>Frontera actual</span>
              <strong>{formatNumber(liveResults.xStar)}</strong>
              <small>Consumidor indiferente</small>
            </li>
          </ul>
        </div>

        <div className="slider-grid">
          <div className="slider-control">
            <div className="slider-control__heading">
              <span>Precio actual de A: {formatNumber(prices.pA)}</span>
              <div className="slider-actions" aria-label="Ajustes rápidos del precio de A">
                <button type="button" onClick={() => adjustPrice("pA", -1)} aria-label="Bajar precio de A">
                  −
                </button>
                <button type="button" onClick={() => adjustPrice("pA", 1)} aria-label="Subir precio de A">
                  +
                </button>
              </div>
            </div>
            <label className="sr-only" htmlFor={`${activeScenario.id}-price-a`}>
              Precio actual de A
            </label>
            <input
              id={`${activeScenario.id}-price-a`}
              aria-label="Precio actual de A"
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
              Baja el precio para atraer más mercado; súbelo para revisar si la ganancia compensa
              vender menos.
            </small>
          </div>
          <div className="slider-control">
            <div className="slider-control__heading">
              <span>Precio actual de B: {formatNumber(prices.pB)}</span>
              <div className="slider-actions" aria-label="Ajustes rápidos del precio de B">
                <button type="button" onClick={() => adjustPrice("pB", -1)} aria-label="Bajar precio de B">
                  −
                </button>
                <button type="button" onClick={() => adjustPrice("pB", 1)} aria-label="Subir precio de B">
                  +
                </button>
              </div>
            </div>
            <label className="sr-only" htmlFor={`${activeScenario.id}-price-b`}>
              Precio actual de B
            </label>
            <input
              id={`${activeScenario.id}-price-b`}
              aria-label="Precio actual de B"
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
          </div>
        </div>

        <article className="step-card">
          <p className="step-card__title">Lectura del movimiento</p>
          <p>{liveInterpretation}</p>
        </article>
      </article>

      <ScenarioCharts
        params={activeScenario.params}
        equilibrium={activeScenario.equilibrium}
        liveResults={liveResults}
        title="Gráfica dinámica del escenario"
        description="Demanda, ganancia y precio cambian al mover los controles."
        className="scenario-charts--wide"
        valueFormatter={(value) => formatNumber(value)}
      />

      <SummaryImageCard
        spec={images[activeScenario.id]}
        description={activeScenario.whyItChanges}
        takeaways={[
          {
            title: "Resultado de equilibrio",
            text: equilibriumInterpretation,
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
