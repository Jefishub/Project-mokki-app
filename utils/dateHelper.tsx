const weekdays = ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"]

export default function DateToString(typeString: Date, selectedDate: Date) {
    const weekday = weekdays[typeString.getDay()];
    return `${weekday} ${selectedDate.getUTCDate()}.${selectedDate.getUTCMonth() + 1}.${selectedDate.getUTCFullYear()}`
};