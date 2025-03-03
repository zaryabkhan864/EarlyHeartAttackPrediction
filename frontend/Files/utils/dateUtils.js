/**
 * Date utility functions
 */

// Format date as YYYY-MM-DD
export const formatDate = (date) => {
    if (!date) return '';

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

// Format date as MM/DD/YYYY
export const formatDateSlash = (date) => {
    if (!date) return '';

    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();

    return `${month}/${day}/${year}`;
};

// Format time as HH:MM AM/PM
export const formatTime = (date) => {
    if (!date) return '';

    const d = new Date(date);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    return `${hours}:${minutes} ${ampm}`;
};

// Format date and time
export const formatDateTime = (date) => {
    if (!date) return '';
    return `${formatDateSlash(date)} ${formatTime(date)}`;
};

// Get relative time (e.g., "5 minutes ago")
export const getRelativeTime = (date) => {
    if (!date) return '';

    const now = new Date();
    const d = new Date(date);
    const diff = now - d;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return days === 1 ? 'Yesterday' : `${days} days ago`;
    } else if (hours > 0) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
        return 'Just now';
    }
};

// Check if a date is today
export const isToday = (date) => {
    if (!date) return false;

    const d = new Date(date);
    const today = new Date();

    return d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
};

// Get date range for the past N days
export const getDateRangeForPastDays = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return {
        startDate,
        endDate
    };
};

// Get formatted date for N days ago
export const getDaysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return formatDate(date);
};

// Create an array of dates between start and end
export const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        dates.push(formatDate(new Date(currentDate)));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

// Group data by date
export const groupByDate = (data, dateField = 'timestamp') => {
    return data.reduce((groups, item) => {
        const date = formatDate(item[dateField]);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(item);
        return groups;
    }, {});
};