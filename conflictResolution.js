function resolveConflicts(dataArray) {
    // Example rule: prefer the most recent data
    return dataArray.reduce((latest, current) => {
        return new Date(latest.timestamp) > new Date(current.timestamp) ? latest : current;
    });
}

// Example usage
const data = [
    { value: 'Data1', timestamp: '2023-10-01T10:00:00Z' },
    { value: 'Data2', timestamp: '2023-10-02T10:00:00Z' }
];

const resolvedData = resolveConflicts(data);
console.log('Resolved Data:', resolvedData); 