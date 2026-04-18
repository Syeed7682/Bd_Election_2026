export const ELECTION_DATA = {
  summary: {
    totalSeats: 300,
    seatsDeclared: 300,
    voterTurnout: 53.67,
    gonovoteYes: 68.26,
    totalVoters: 127060000,
  },
  parties: [
    { name: 'BNP', seats: 212, color: '#1a7fd4', full: 'Bangladesh Nationalist Party' },
    { name: 'Jamaat', seats: 68, color: '#1db954', full: 'Bangladesh Jamaat-e-Islami' },
    { name: 'NCP', seats: 6, color: '#ff8c00', full: 'National Congress Party' },
    { name: 'IND', seats: 6, color: '#9b59b6', full: 'Independent Candidates' },
    { name: 'Others', seats: 8, color: '#8c7355', full: 'Other Minor Parties' },
  ],
  demographics: [
    { name: 'Male', value: 64630000, color: '#4472C4' },
    { name: 'Female', value: 62690000, color: '#ED7D31' },
    { name: 'Transgender', value: 1213, color: '#A9D18E' },
  ],
  divisions: [
    { name: 'Rajshahi', turnout: 66.16, literacy: 47.2, poverty: 16.2, bnp: 28, jamaat: 11 },
    { name: 'Khulna', turnout: 64.93, literacy: 52.9, poverty: 16.6, bnp: 11, jamaat: 25 },
    { name: 'Rangpur', turnout: 58.72, literacy: 46.0, poverty: 24.8, bnp: 14, jamaat: 16 },
    { name: 'Barishal', turnout: 50.05, literacy: 60.9, poverty: 26.9, bnp: 16, jamaat: 2 },
    { name: 'Mymensingh', turnout: 49.22, literacy: 38.95, poverty: 22.9, bnp: 18, jamaat: 3 },
    { name: 'Chittagong', turnout: 48.62, literacy: 51.0, poverty: 15.2, bnp: 49, jamaat: 3 },
    { name: 'Dhaka', turnout: 47.66, literacy: 50.8, poverty: 19.6, bnp: 58, jamaat: 8 },
    { name: 'Sylhet', turnout: 44.83, literacy: 40.8, poverty: 18.8, bnp: 18, jamaat: 0 },
  ],
  gonovote: [
    { name: 'Yes', value: 68.26, color: '#1db954' },
    { name: 'No', value: 31.74, color: '#e8394a' },
  ],
  mlMetrics: {
    regression: { r2: 0.31, rmse: 8.7, mae: 6.9 },
    classification: [
      { name: 'Logistic Regression', accuracy: 0.7800, f1: 0.7136, auc: 0.8399 },
      { name: 'Random Forest', accuracy: 0.7800, f1: 0.7337, auc: 0.8607 },
      { name: 'Decision Tree', accuracy: 0.6800, f1: 0.6922, auc: 0.6736 },
    ],
    featureImportance: [
      { name: 'Margin', importance: 0.31 },
      { name: 'Total Voters', importance: 0.24 },
      { name: 'Turnout %', importance: 0.19 },
      { name: 'Poverty Rate', importance: 0.12 },
      { name: 'Literacy Rate', importance: 0.08 },
    ]
  },
  clusters: [
    { id: 0, name: 'High Poverty', poverty: 32.4, literacy: 46.2, turnout: 54.1, party: 'BNP' },
    { id: 1, name: 'Moderate', poverty: 18.6, literacy: 50.1, turnout: 52.8, party: 'BNP' },
    { id: 2, name: 'Low Poverty', poverty: 10.8, literacy: 51.4, turnout: 56.3, party: 'Jamaat' },
  ],
  seatDistribution: [
    { id: 'rangpur', name: 'Rangpur', seats: 33, bnp: 14, jamaat: 16, others: 3, grid: { x: 3, y: 0 } },
    { id: 'rajshahi', name: 'Rajshahi', seats: 39, bnp: 28, jamaat: 11, others: 0, grid: { x: 1, y: 2 } },
    { id: 'mymensingh', name: 'Mymensingh', seats: 24, bnp: 18, jamaat: 3, others: 3, grid: { x: 4, y: 2 } },
    { id: 'sylhet', name: 'Sylhet', seats: 18, bnp: 18, jamaat: 0, others: 0, grid: { x: 7, y: 2 } },
    { id: 'dhaka', name: 'Dhaka', seats: 71, bnp: 58, jamaat: 8, others: 5, grid: { x: 4, y: 5 } },
    { id: 'khulna', name: 'Khulna', seats: 36, bnp: 11, jamaat: 25, others: 0, grid: { x: 1, y: 7 } },
    { id: 'barishal', name: 'Barishal', seats: 21, bnp: 16, jamaat: 2, others: 3, grid: { x: 4, y: 8 } },
    { id: 'chittagong', name: 'Chittagong', seats: 58, bnp: 49, jamaat: 3, others: 6, grid: { x: 7, y: 8 } },
  ]
};

