const weekdays = ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"]

export default function DateToString(selectedDate: Date) {
    const weekday = weekdays[selectedDate.getDay()];
    return `${weekday} ${selectedDate.getUTCDate()}.${selectedDate.getUTCMonth() + 1}.${selectedDate.getUTCFullYear()}`
};