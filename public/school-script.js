"use strict";

window.ROSA_SCHOOL_SCRIPT = (() => {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));

  const normalize = (value) => String(value ?? "").toLocaleLowerCase("es-ES");

  // Usamos <i> para evitar que reglas antiguas de burbujas sobre <span>
  // vuelvan a deformar las letras.
  const glyph = (letter, className = "") => {
    const ch = normalize(letter);
    return '<i class="rosa-school-letter ' + esc(className) + '" aria-label="' + esc(ch) + '">' + esc(ch) + '</i>';
  };

  const word = (text, className = "") => {
    const chars = [...normalize(text)];
    return '<span class="rosa-school-word ' + esc(className) + '">' + chars.map((ch) =>
      ch === " "
        ? '<i class="rosa-school-space" aria-hidden="true"></i>'
        : glyph(ch)
    ).join("") + '</span>';
  };

  return Object.freeze({ glyph, word });
})();
