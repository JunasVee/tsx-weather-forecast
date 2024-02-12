export function mToKm(visibilityInNumbers: number): string {
    const visibilityInKm = visibilityInNumbers / 1000;
    return `${visibilityInKm.toFixed(0)}km`
}