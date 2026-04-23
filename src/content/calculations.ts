import type { LinearParams, LinearResults } from "../types";

const round = (value: number) => Math.round(value * 100) / 100;

export function computeLinearEquilibrium(params: LinearParams): LinearResults {
  const A = params.t * (params.a + params.b) + params.cA;
  const B = params.t * (2 * params.L - params.a - params.b) + params.cB;

  const pA = (2 * A + B) / 3;
  const pB = (A + 2 * B) / 3;
  const xStar = (params.a + params.b) / 2 + (pB - pA) / (2 * params.t);
  const qA = xStar;
  const qB = params.L - xStar;
  const piA = (pA - params.cA) * qA;
  const piB = (pB - params.cB) * qB;

  return {
    pA: round(pA),
    pB: round(pB),
    xStar: round(xStar),
    qA: round(qA),
    qB: round(qB),
    piA: round(piA),
    piB: round(piB),
  };
}

export function computeInteractiveResults(
  params: LinearParams,
  prices: Pick<LinearResults, "pA" | "pB">,
): LinearResults {
  const xStar = (params.a + params.b) / 2 + (prices.pB - prices.pA) / (2 * params.t);
  const qA = xStar;
  const qB = params.L - xStar;

  return {
    pA: round(prices.pA),
    pB: round(prices.pB),
    xStar: round(xStar),
    qA: round(qA),
    qB: round(qB),
    piA: round((prices.pA - params.cA) * qA),
    piB: round((prices.pB - params.cB) * qB),
  };
}

export function reactionPriceA(params: LinearParams, pB: number) {
  return round((params.t * (params.a + params.b) + pB + params.cA) / 2);
}

export function reactionPriceB(params: LinearParams, pA: number) {
  return round((params.t * (2 * params.L - params.a - params.b) + pA + params.cB) / 2);
}

export function clampResults(results: LinearResults, L: number): LinearResults {
  const xStar = Math.min(Math.max(results.xStar, 0), L);
  const qA = Math.min(Math.max(results.qA, 0), L);
  const qB = Math.min(Math.max(results.qB, 0), L);

  return {
    ...results,
    xStar: round(xStar),
    qA: round(qA),
    qB: round(qB),
    piA: round(results.piA),
    piB: round(results.piB),
  };
}
