/**
 * Mouvement réduit uniquement sur grand écran à pointeur fin.
 * Beaucoup de Samsung activent « Supprimer les animations » dans l’accessibilité :
 * Chrome annonce alors prefers-reduced-motion et l’invitation restait figée.
 * Sur téléphone, les animations de l’invitation restent jouées.
 */
export function prefersReducedMotion() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) return false;
  const handheld =
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(max-width: 900px)").matches;
  return !handheld;
}
