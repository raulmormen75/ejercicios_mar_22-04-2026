import { useId } from "react";
import type { CSSProperties } from "react";
import type { LinearParams, LinearResults } from "../types";

type MetricKey = "qA" | "qB" | "piA" | "piB" | "pA" | "pB";

type ChartGroup = {
  id: "demand" | "profit" | "price";
  title: string;
  note: string;
  unitLabel: string;
  maxValue: number;
  rows: ChartRow[];
};

type ChartRow = {
  key: MetricKey;
  label: string;
  firm: "A" | "B";
  value: number;
  equilibrium: number;
};

export interface ScenarioChartsProps {
  params: LinearParams;
  equilibrium: LinearResults;
  liveResults: LinearResults;
  title?: string;
  description?: string;
  className?: string;
  showEquilibrium?: boolean;
  animationDurationMs?: number;
  valueFormatter?: (value: number, key: MetricKey) => string;
}

const SVG_WIDTH = 720;
const SVG_HEIGHT = 460;
const CHART_LEFT = 130;
const CHART_WIDTH = 430;
const BAR_HEIGHT = 20;
const GROUP_GAP = 134;
const GROUP_TOP = 72;
const ROW_GAP = 34;

const colorByFirm = {
  A: "var(--night)",
  B: "var(--wine)",
} as const;

const defaultFormatValue = (value: number) =>
  new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 }).format(value);

const clampRatio = (value: number, maxValue: number) => {
  if (!Number.isFinite(value) || !Number.isFinite(maxValue) || maxValue <= 0) {
    return 0;
  }

  return Math.min(Math.max(value / maxValue, 0), 1);
};

const getGroupMax = (values: number[], fallback: number) => {
  const maxValue = Math.max(...values.filter(Number.isFinite), fallback);
  return maxValue > 0 ? maxValue : 1;
};

const buildGroups = (
  params: LinearParams,
  equilibrium: LinearResults,
  liveResults: LinearResults,
  valueFormatter: (value: number, key: MetricKey) => string,
): ChartGroup[] => {
  const demandRows: ChartRow[] = [
    {
      key: "qA",
      label: "Demanda A",
      firm: "A",
      value: liveResults.qA,
      equilibrium: equilibrium.qA,
    },
    {
      key: "qB",
      label: "Demanda B",
      firm: "B",
      value: liveResults.qB,
      equilibrium: equilibrium.qB,
    },
  ];

  const profitRows: ChartRow[] = [
    {
      key: "piA",
      label: "Ganancia A",
      firm: "A",
      value: liveResults.piA,
      equilibrium: equilibrium.piA,
    },
    {
      key: "piB",
      label: "Ganancia B",
      firm: "B",
      value: liveResults.piB,
      equilibrium: equilibrium.piB,
    },
  ];

  const priceRows: ChartRow[] = [
    {
      key: "pA",
      label: "Precio A",
      firm: "A",
      value: liveResults.pA,
      equilibrium: equilibrium.pA,
    },
    {
      key: "pB",
      label: "Precio B",
      firm: "B",
      value: liveResults.pB,
      equilibrium: equilibrium.pB,
    },
  ];

  return [
    {
      id: "demand",
      title: "Demanda",
      note: "Participación de cada empresa sobre la calle del ejercicio.",
      unitLabel: `0 a ${valueFormatter(params.L, "qA")}`,
      maxValue: Math.max(params.L, getGroupMax(demandRows.flatMap((row) => [row.value, row.equilibrium]), 1)),
      rows: demandRows,
    },
    {
      id: "profit",
      title: "Ganancias",
      note: "Resultado económico con los precios actuales.",
      unitLabel: "π",
      maxValue: getGroupMax(profitRows.flatMap((row) => [row.value, row.equilibrium]), 1),
      rows: profitRows,
    },
    {
      id: "price",
      title: "Precios",
      note: "Comparación contra el equilibrio del escenario.",
      unitLabel: "p",
      maxValue: getGroupMax(priceRows.flatMap((row) => [row.value, row.equilibrium]), 1),
      rows: priceRows,
    },
  ];
};

const makeId = (baseId: string, suffix: string) => `${baseId.replace(/:/g, "")}-${suffix}`;

interface ChartRowsProps {
  group: ChartGroup;
  baseId: string;
  showEquilibrium: boolean;
  transitionStyle: CSSProperties;
  valueFormatter: (value: number, key: MetricKey) => string;
}

function ChartRows({
  group,
  baseId,
  showEquilibrium,
  transitionStyle,
  valueFormatter,
}: ChartRowsProps) {
  return (
    <>
      {group.rows.map((row, index) => {
        const y = GROUP_TOP + index * ROW_GAP;
        const barWidth = Math.max(clampRatio(row.value, group.maxValue) * CHART_WIDTH, 2);
        const equilibriumX = CHART_LEFT + clampRatio(row.equilibrium, group.maxValue) * CHART_WIDTH;
        const rowId = makeId(baseId, `${group.id}-${row.key}`);

        return (
          <g key={row.key} aria-labelledby={rowId}>
            <title id={rowId}>
              {row.label}: {valueFormatter(row.value, row.key)}. Equilibrio:{" "}
              {valueFormatter(row.equilibrium, row.key)}.
            </title>
            <text x="0" y={y + 15} className="scenario-charts__row-label" fill="var(--night)">
              {row.label}
            </text>
            <rect
              x={CHART_LEFT}
              y={y}
              width={CHART_WIDTH}
              height={BAR_HEIGHT}
              rx="10"
              fill="rgba(28, 42, 58, 0.08)"
            />
            <rect
              className={`scenario-charts__bar scenario-charts__bar--${row.firm.toLowerCase()}`}
              x={CHART_LEFT}
              y={y}
              width={barWidth}
              height={BAR_HEIGHT}
              rx="10"
              fill={colorByFirm[row.firm]}
              style={transitionStyle}
            />
            {showEquilibrium ? (
              <g className="scenario-charts__equilibrium-marker" style={transitionStyle}>
                <line
                  x1={equilibriumX}
                  x2={equilibriumX}
                  y1={y - 5}
                  y2={y + BAR_HEIGHT + 5}
                  stroke="var(--gold)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx={equilibriumX} cy={y + BAR_HEIGHT / 2} r="4" fill="var(--gold)" />
              </g>
            ) : null}
            <text
              x={CHART_LEFT + CHART_WIDTH + 18}
              y={y + 15}
              className="scenario-charts__value"
              fill="var(--graphite)"
            >
              {valueFormatter(row.value, row.key)}
            </text>
          </g>
        );
      })}
    </>
  );
}

interface ChartGroupSvgProps extends ChartRowsProps {
  groupIndex: number;
}

function ChartGroupSvg(props: ChartGroupSvgProps) {
  const { group, groupIndex } = props;
  const translateY = groupIndex * GROUP_GAP;

  return (
    <g className={`scenario-charts__group scenario-charts__group--${group.id}`} transform={`translate(0 ${translateY})`}>
      <text x="0" y="22" className="scenario-charts__group-title" fill="var(--night)">
        {group.title}
      </text>
      <text x="0" y="44" className="scenario-charts__group-note" fill="var(--muted)">
        {group.note}
      </text>
      <line
        x1={CHART_LEFT}
        x2={CHART_LEFT + CHART_WIDTH}
        y1={GROUP_TOP + ROW_GAP + 35}
        y2={GROUP_TOP + ROW_GAP + 35}
        stroke="rgba(28, 42, 58, 0.14)"
        strokeDasharray="4 7"
      />
      <text
        x={CHART_LEFT}
        y={GROUP_TOP + ROW_GAP + 57}
        className="scenario-charts__axis-label"
        fill="var(--muted)"
      >
        0
      </text>
      <text
        x={CHART_LEFT + CHART_WIDTH}
        y={GROUP_TOP + ROW_GAP + 57}
        className="scenario-charts__axis-label scenario-charts__axis-label--end"
        fill="var(--muted)"
        textAnchor="end"
      >
        {group.unitLabel}
      </text>
      <ChartRows {...props} />
    </g>
  );
}

export function ScenarioCharts({
  params,
  equilibrium,
  liveResults,
  title = "Gráficas del escenario",
  description = "Comparación visual de demanda, ganancias y precios actuales contra el equilibrio del modelo.",
  className,
  showEquilibrium = true,
  animationDurationMs = 240,
  valueFormatter = defaultFormatValue,
}: ScenarioChartsProps) {
  const reactId = useId();
  const baseId = makeId(reactId, "scenario-charts");
  const titleId = makeId(baseId, "title");
  const descriptionId = makeId(baseId, "description");
  const groups = buildGroups(params, equilibrium, liveResults, valueFormatter);
  const transitionStyle: CSSProperties = {
    transition: `width ${animationDurationMs}ms ease, x ${animationDurationMs}ms ease, transform ${animationDurationMs}ms ease`,
  };

  return (
    <figure className={["scenario-charts", className].filter(Boolean).join(" ")}>
      <svg
        role="img"
        aria-labelledby={`${titleId} ${descriptionId}`}
        className="scenario-charts__svg"
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        width="100%"
        height="auto"
      >
        <title id={titleId}>{title}</title>
        <desc id={descriptionId}>{description}</desc>
        <rect width={SVG_WIDTH} height={SVG_HEIGHT} rx="28" fill="var(--surface-solid, #fffdf8)" />
        <rect
          x="1"
          y="1"
          width={SVG_WIDTH - 2}
          height={SVG_HEIGHT - 2}
          rx="27"
          fill="none"
          stroke="var(--line, rgba(28, 42, 58, 0.12))"
        />
        <g transform="translate(42 32)">
          <text x="0" y="0" className="scenario-charts__title" fill="var(--night)">
            {title}
          </text>
          <text x="0" y="24" className="scenario-charts__description" fill="var(--muted)">
            {description}
          </text>
          <g transform="translate(0 36)">
            {groups.map((group, groupIndex) => (
              <ChartGroupSvg
                key={group.id}
                group={group}
                groupIndex={groupIndex}
                baseId={baseId}
                showEquilibrium={showEquilibrium}
                transitionStyle={transitionStyle}
                valueFormatter={valueFormatter}
              />
            ))}
          </g>
          {showEquilibrium ? (
            <g className="scenario-charts__legend" transform="translate(0 406)">
              <circle cx="7" cy="0" r="5" fill="var(--gold)" />
              <text x="18" y="5" fill="var(--muted)">
                Marcador dorado: valor de equilibrio.
              </text>
            </g>
          ) : null}
        </g>
      </svg>
      <figcaption className="scenario-charts__caption">
        Las barras muestran el resultado actual. El marcador dorado indica el equilibrio del
        escenario cuando está habilitado.
      </figcaption>
    </figure>
  );
}

export default ScenarioCharts;
