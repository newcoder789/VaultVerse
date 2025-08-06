// src/components/RiskDashboard.jsx
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';

const RISK_COLORS = ['#8884d8', '#82ca9d', '#ff7300', '#ffbb28'];

const RiskScoreGauge = ({ score }) => (
  <div className="mt-4">
    <h4 className="text-sm font-medium">Risk Score</h4>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-purple-600 h-2.5 rounded-full"
        style={{ width: `${score}%` }}
      ></div>
    </div>
    <p className="text-sm text-gray-400 mt-1">Score: {score}/100</p>
  </div>
);

const RiskDashboard = ({ vault }) => {
  // Mock data for demonstration (replace with useRiskData hook)
  const riskData = {
    ltvBreakdown: [
      { name: 'Low Risk', value: 40 },
      { name: 'Medium Risk', value: 35 },
      { name: 'High Risk', value: 25 },
    ],
    priceHistory: [
      { date: '2025-01', floorPrice: 0.5, tokenPrice: 0.7 },
      { date: '2025-02', floorPrice: 0.6, tokenPrice: 0.65 },
      { date: '2025-03', floorPrice: 0.55, tokenPrice: 0.8 },
    ],
    overallScore: 75,
  };

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Risk Dashboard</h2>
      <div className="border rounded-lg p-4 bg-gray-800">
        <h3 className="font-bold mb-4 text-white">Risk Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-300">LTV Composition</h4>
            <PieChart width={300} height={200}>
              <Pie data={riskData.ltvBreakdown} dataKey="value" nameKey="name">
                {riskData.ltvBreakdown.map((entry, index) => (
                  <Cell key={index} fill={RISK_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-300">Price Volatility (30D)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={riskData.priceHistory}>
                <XAxis dataKey="date" stroke="#d1d5db" />
                <YAxis domain={['auto', 'auto']} stroke="#d1d5db" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="floorPrice"
                  stroke="#8884d8"
                  name="Floor Price"
                />
                <Line
                  type="monotone"
                  dataKey="tokenPrice"
                  stroke="#82ca9d"
                  name="This NFT"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <RiskScoreGauge score={riskData.overallScore} />
      </div>
    </div>
  );
};

export default RiskDashboard;