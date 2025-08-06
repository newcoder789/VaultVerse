import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from "recharts";
import Header from "./Header";
import Footer from "./Footer";
import { createActor as createCoreActor, canisterId as coreCanisterId } from "../../../declarations/core_protocol_canister/index.js";
import { useAuth } from "@nfid/identitykit/react";

const COLORS = ["#a855f7", "#ec4899", "#8b5cf6"];

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loansTaken, setLoansTaken] = useState(0);
  const [loansGiven, setLoansGiven] = useState(0);
  const [loanActivity, setLoanActivity] = useState([]);
  const [loanDistribution, setLoanDistribution] = useState([]);
  const [loanStats, setLoanStats] = useState([]);
  const [riskStats, setRiskStats] = useState({});
  const [activeLoan, setActiveLoan] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const actor = createCoreActor(coreCanisterId);
        // Replace with real canister calls:
        // Example: get user stats, loan stats, risk, etc.
        const [wallet, taken, given, activity, distribution, stats, risk, active] = await Promise.all([
          actor.get_wallet_balance(user?.principal),
          actor.get_total_loans_taken(user?.principal),
          actor.get_total_loans_given(user?.principal),
          actor.get_loan_activity(user?.principal),
          actor.get_loan_distribution(user?.principal),
          actor.get_loan_stats(user?.principal),
          actor.get_risk_stats(user?.principal),
          actor.get_active_loan(user?.principal),
        ]);
        setWalletBalance(wallet);
        setLoansTaken(taken);
        setLoansGiven(given);
        setLoanActivity(activity);
        setLoanDistribution(distribution);
        setLoanStats(stats);
        setRiskStats(risk);
        setActiveLoan(active);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    if (user?.principal) fetchData();
  }, [user]);

  if (loading) return <div className="text-center text-white py-20">Loading dashboard...</div>;
  if (error) return <div className="text-center text-red-400 py-20">{error}</div>;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#0e0e2c] via-[#1a1039] to-[#150622] p-8 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500">
          Dashboard Overview
        </h1>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1e1e3f] p-6 rounded-2xl shadow-md text-center">
            <h2 className="text-lg font-semibold text-purple-300">Wallet Balance</h2>
            <p className="text-2xl font-bold mt-2">ICP {walletBalance}</p>
          </div>
          <div className="bg-[#1e1e3f] p-6 rounded-2xl shadow-md text-center">
            <h2 className="text-lg font-semibold text-pink-300">Total Loans Taken</h2>
            <p className="text-2xl font-bold mt-2">ICP {loansTaken}</p>
          </div>
          <div className="bg-[#1e1e3f] p-6 rounded-2xl shadow-md text-center">
            <h2 className="text-lg font-semibold text-indigo-300">Total Loans Given</h2>
            <p className="text-2xl font-bold mt-2">ICP {loansGiven}</p>
          </div>
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-[#1e1e3f] p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-purple-200">Loan Activity Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={loanActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f5e" />
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip contentStyle={{ backgroundColor: "#1f1f3d", borderColor: "#8b5cf6" }} />
                <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} activeDot={{ r: 6 }} isAnimationActive={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-[#1e1e3f] p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-pink-200">Loan Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={loanDistribution} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                  {loanDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: "#fff" }} />
                <Tooltip contentStyle={{ backgroundColor: "#1f1f3d", borderColor: "#ec4899" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Loan Stats */}
        <div className="bg-[#1e1e3f] mt-12 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-indigo-200">Loan Stats by Type</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={loanStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#a855f7" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Risk Engine */}
        <div className="bg-[#1e1e3f] mt-12 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-indigo-200">Risk Engine Insights</h2>
          <ul className="space-y-2">
            <li className="flex justify-between text-sm">
              <span className="text-gray-300">Credit Score:</span>
              <span className="text-white font-bold">{riskStats.creditScore}</span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-gray-300">Risk Level:</span>
              <span className="text-yellow-400 font-bold flex items-center gap-1">{riskStats.riskLevel} <span className="h-2 w-2 bg-yellow-400 rounded-full inline-block" /></span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-gray-300">Liquidation Threshold:</span>
              <span className="text-white font-bold">{riskStats.liquidationThreshold}</span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-gray-300">Default Probability:</span>
              <span className="text-red-400 font-bold">{riskStats.defaultProbability}</span>
            </li>
          </ul>
        </div>
        {/* Active Loan Summary */}
        <div className="bg-[#1e1e3f] mt-12 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-purple-200">Active Loan Summary</h2>
          {activeLoan ? (
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-400">Amount Borrowed:</span>
                <span className="font-semibold text-white">ICP {activeLoan.amount}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Due Date:</span>
                <span className="font-semibold text-white">{activeLoan.dueDate}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Daily Interest:</span>
                <span className="font-semibold text-white">{activeLoan.dailyInterest} ICP</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Remaining Balance:</span>
                <span className="font-semibold text-white">ICP {activeLoan.remainingBalance}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Countdown to Liquidation:</span>
                <span className="font-semibold text-red-400">{activeLoan.countdown}</span>
              </li>
            </ul>
          ) : (
            <div className="text-gray-400">No active loan found.</div>
          )}
          <button className="mt-6 w-full bg-pink-600 hover:bg-pink-700 transition px-6 py-2 rounded-full text-white font-bold">
            Repay Now
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
