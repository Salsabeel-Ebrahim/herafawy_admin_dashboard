// Demo data for parts the backend does not provide yet (service requests + chart).
export const REQUESTS = [
  { id: 'HR-2048', service: 'Paint an apartment', customer: 'Sara Ahmed', area: '6th of October', price: 4500, status: 'new' },
  { id: 'HR-2047', service: 'Fix a pipe leak', customer: 'Mariam Ali', area: 'Dokki', price: 650, status: 'in_progress' },
  { id: 'HR-2046', service: 'Replace light switches', customer: 'Omar Khaled', area: 'Haram', price: 400, status: 'completed' },
  { id: 'HR-2045', service: 'Paint a room', customer: 'Nour Mohamed', area: 'Sheikh Zayed', price: 1800, status: 'in_progress' },
  { id: 'HR-2044', service: 'Repair a wooden door', customer: 'Ali Hassan', area: 'Mohandessin', price: 900, status: 'cancelled' },
];

export const CHART = {
  7: {
    labels: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'],
    created: [98, 115, 72, 90, 50, 65, 40],
    completed: [85, 78, 50, 58, 45, 38, 25],
  },
  30: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    created: [520, 610, 580, 690],
    completed: [430, 500, 470, 560],
  },
};
