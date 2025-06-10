export function getGenderedInterpretationText(level, gender) {
    const firstLetter = level ? level[0].toUpperCase() : "U";
    let baseWord;
    switch (firstLetter) {
        case "E": baseWord = "Extrovertid"; break;
        case "I": baseWord = "Introvertid"; break;
        case "N": baseWord = "Camaleónic"; break;
        default:  return "Indefinido";
    }
    const suffix = (gender && gender.toUpperCase() === "F") ? "a" : "o";
    return baseWord + suffix;
}

export function triggerGoldenGlow(element) {
    if (!element) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        console.log("Movimiento reducido preferido, omitiendo animación de brillo.");
        return;
    }
    element.classList.add('highlight-glow');
    setTimeout(() => {
        element.classList.remove('highlight-glow');
    }, 2000);
}
