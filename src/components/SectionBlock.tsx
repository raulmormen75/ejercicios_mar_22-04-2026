import { FormulaBlock } from "./FormulaBlock";
import { SummaryImageCard } from "./SummaryImageCard";
import type { LessonModule, SectionImageSpec } from "../types";

interface SectionBlockProps {
  module: LessonModule;
  image: SectionImageSpec;
}

export function SectionBlock({ module, image }: SectionBlockProps) {
  return (
    <section id={module.id} className="section-block">
      <div className="section-block__header">
        <p className="eyebrow">{module.eyebrow}</p>
        <h2>{module.title}</h2>
        <p className="section-block__goal">{module.goal}</p>
      </div>

      {module.intuition ? <p className="section-block__intuition">{module.intuition}</p> : null}

      {module.assumptions?.length ? (
        <div className="assumption-card">
          <p className="assumption-card__title">Qué estamos suponiendo</p>
          <ul>
            {module.assumptions.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {module.formulas?.length ? (
        <div className="formula-grid">
          {module.formulas.map((formula) => (
            <FormulaBlock key={formula} math={formula} />
          ))}
        </div>
      ) : null}

      {module.steps?.length ? (
        <div className="step-list">
          {module.steps.map((step) => (
            <article key={step.label} className="step-card">
              <p className="step-card__title">{step.label}</p>
              {step.math ? <FormulaBlock math={step.math} /> : null}
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      ) : null}

      <SummaryImageCard spec={image} takeaways={module.takeaways} description={module.summaryCaption} />
    </section>
  );
}
