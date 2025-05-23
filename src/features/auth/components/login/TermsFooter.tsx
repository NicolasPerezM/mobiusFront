"use client"

export const TermsFooter = () => (
  <div className="mt-8 text-xs text-muted-foreground text-center">
    Al registrarte, aceptas nuestros{" "}
    <a href="/terms" className="text-primary hover:underline">
      Terminos y Condiciones
    </a>{" "}
    y{" "}
    <a href="/privacy" className="text-primary hover:underline">
      Politica de Privacidad
    </a>
    .
  </div>
)
