export function dayOrNight (
    iconName: string,
    dateTimeString: string
): string {
    const hours = new Date(dateTimeString).getHours();

    const isDay = hours >= 6 && hours < 18

    return isDay ? iconName.replace(/.$/, 'd') : iconName.replace(/.$/, 'n');
}