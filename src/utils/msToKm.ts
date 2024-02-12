export function msToKm(speedInMs: number): string {
    const speedInKm = speedInMs * 3.6;
    return `${speedInKm.toFixed(0)}km/h`
}