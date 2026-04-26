import { formatNumber } from "../utils/formatters";

interface StreetDiagramProps {
  L: number;
  a: number;
  b: number;
  xStar: number;
}

export function StreetDiagram({ L, a, b, xStar }: StreetDiagramProps) {
  const boundedXStar = Math.min(Math.max(xStar, 0), L);
  const scale = (value: number) => 80 + (value / L) * 640;

  return (
    <svg
      className="street-diagram"
      viewBox="0 0 800 180"
      role="img"
      aria-label="Diagrama de calle con dos empresas y consumidor indiferente"
    >
      <defs>
        <linearGradient id="street-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#efe8d8" />
          <stop offset="100%" stopColor="#f8f3ea" />
        </linearGradient>
      </defs>
      <rect x="60" y="86" width="680" height="10" rx="5" fill="url(#street-gradient)" />
      <rect x="60" y="74" width={scale(boundedXStar) - 60} height="34" rx="17" fill="rgba(198, 167, 94, 0.18)" />
      <rect
        x={scale(boundedXStar)}
        y="74"
        width={740 - scale(boundedXStar)}
        height="34"
        rx="17"
        fill="rgba(28, 42, 58, 0.12)"
      />
      <line x1={scale(boundedXStar)} y1="50" x2={scale(boundedXStar)} y2="132" stroke="#6e1f28" strokeWidth="3" strokeDasharray="6 6" />
      <circle cx={scale(a)} cy="91" r="14" fill="#1c2a3a" />
      <circle cx={scale(b)} cy="91" r="14" fill="#0b0b0b" />
      <circle cx={scale(boundedXStar)} cy="91" r="11" fill="#c6a75e" stroke="#6e1f28" strokeWidth="3" />
      <text x={scale(a)} y="55" textAnchor="middle" className="street-label">
        Empresa A
      </text>
      <text x={scale(b)} y="55" textAnchor="middle" className="street-label">
        Empresa B
      </text>
      <text x={scale(boundedXStar)} y="150" textAnchor="middle" className="street-highlight">
        x* = {formatNumber(boundedXStar)}
      </text>
      <text x="72" y="28" className="street-caption">
        Mercado de A
      </text>
      <text x="664" y="28" className="street-caption">
        Mercado de B
      </text>
      <text x="62" y="170" className="street-scale">
        0
      </text>
      <text x="738" y="170" textAnchor="end" className="street-scale">
        {formatNumber(L)}
      </text>
    </svg>
  );
}
