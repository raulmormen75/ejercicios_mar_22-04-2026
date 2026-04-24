import { useMemo, useState } from "react";
import type { SectionImageSpec, Takeaway } from "../types";

interface SummaryImageCardProps {
  spec: SectionImageSpec;
  takeaways: Takeaway[];
  description?: string;
}

function FallbackSketch({ spec }: { spec: SectionImageSpec }) {
  const lines = useMemo(() => spec.sketchLines.slice(0, 5), [spec.sketchLines]);

  return (
    <div className="summary-sketch" aria-hidden="true">
      <div className="summary-sketch__header">
        <span className="marker marker-blue">síntesis</span>
        <span className="marker marker-red">idea central</span>
        <span className="marker marker-green">verificación</span>
      </div>
      <div className="summary-sketch__body">
        {lines.map((line, index) => (
          <p key={line} className={`summary-sketch__line tone-${index % 5}`}>
            {line}
          </p>
        ))}
      </div>
      <div className="summary-sketch__footer">
        <span>plumón de color</span>
        <span>flechas</span>
        <span>idea central</span>
      </div>
    </div>
  );
}

export function SummaryImageCard({ spec, takeaways, description }: SummaryImageCardProps) {
  const [imageReady, setImageReady] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const imagePath = spec.status === "generated" && spec.generatedAssetPath ? spec.generatedAssetPath : spec.assetPath;
  const helperText = description ?? spec.caption;

  return (
    <div className="summary-card">
      <div className="summary-card__heading">
        <div>
          <p className="eyebrow">Síntesis visual del bloque</p>
          <h3>{spec.caption}</h3>
        </div>
        <button type="button" className="ghost-button summary-card__action" onClick={() => setZoomOpen(true)}>
          Ver imagen completa
        </button>
      </div>

      <div className="summary-card__visual">
        {!imageReady ? <FallbackSketch spec={spec} /> : null}
        {imagePath ? (
          <img
            src={imagePath}
            alt={spec.alt}
            className={`summary-card__image ${imageReady ? "" : "summary-card__image--hidden"}`}
            loading="lazy"
            onLoad={() => setImageReady(true)}
            onError={() => setImageReady(false)}
          />
        ) : null}
      </div>

      <div className="summary-card__footer">
        <div className="summary-card__memory">
          <p className="summary-card__label">Qué conviene retener</p>
          <p className="summary-card__caption">{helperText}</p>
        </div>
        <ul className="takeaway-list">
          {takeaways.slice(0, 2).map((takeaway) => (
            <li key={takeaway.title}>
              <strong>{takeaway.title}:</strong> {takeaway.text}
            </li>
          ))}
        </ul>
      </div>

      {zoomOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setZoomOpen(false)}>
          <div
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Imagen completa: ${spec.caption}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="ghost-button ghost-button--close" onClick={() => setZoomOpen(false)}>
              Cerrar imagen
            </button>
            {!imageReady ? <FallbackSketch spec={spec} /> : null}
            {imagePath ? (
              <img
                src={imagePath}
                alt={spec.alt}
                className={`summary-card__image summary-card__image--large ${imageReady ? "" : "summary-card__image--hidden"}`}
                onLoad={() => setImageReady(true)}
                onError={() => setImageReady(false)}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
