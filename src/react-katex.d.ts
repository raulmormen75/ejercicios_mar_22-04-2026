declare module "react-katex" {
  import type { ReactNode } from "react";

  export interface KatexProps {
    math: string;
    errorColor?: string;
    renderError?: (error: Error) => ReactNode;
  }

  export function BlockMath(props: KatexProps): ReactNode;
  export function InlineMath(props: KatexProps): ReactNode;
}
