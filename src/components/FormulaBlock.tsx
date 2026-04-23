import { BlockMath } from "react-katex";

interface FormulaBlockProps {
  math: string;
  label?: string;
}

export function FormulaBlock({ math, label }: FormulaBlockProps) {
  return (
    <div className="formula-block">
      {label ? <p className="formula-label">{label}</p> : null}
      <BlockMath math={math} />
    </div>
  );
}
