/*
 * Design philosophy: Dark Cinematic — los toasts deben sentirse como una señal
 * de consola: oscuros, legibles y discretos, sin depender de un proveedor de tema
 * externo que no existe en esta aplicación.
 */
import * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--panel)",
          "--normal-text": "var(--paper)",
          "--normal-border": "var(--line)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
