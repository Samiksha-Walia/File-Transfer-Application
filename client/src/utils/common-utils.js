export const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();

    const isToday = d.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) {
        const hours = d.getHours();
        const minutes = d.getMinutes();
        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    }

    if (isYesterday) {
        return 'yesterday';
    }

    const day = `${d.getDate() < 10 ? '0' + d.getDate() : d.getDate()}`;
    const monthNumber = d.getMonth() + 1;
    const month = `${monthNumber < 10 ? '0' + monthNumber : monthNumber}`;
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
}

export const formatDateSeparator = (date) => {
    const d = new Date(date);
    const now = new Date();

    const isToday = d.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};