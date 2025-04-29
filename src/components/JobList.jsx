import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import SummaryCard from "./SummaryCard";
import { FaMoneyBillWave, FaChartLine, FaStopwatch } from "react-icons/fa";

export default function JobList() {
  const [data, setData] = useState({ jobs: [], summary: null });
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("https://clickupbackend.onrender.com/api/jobs");
      setData(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) return <p className="text-gray-500">Loading jobs...</p>;

  const summaryItems = [
    {
      label: "Total Payment",
      value: data.summary.totalPayment,
      icon: <FaMoneyBillWave size={22} className="text-blue-500" />,
    },
    {
      label: "Total Profit212",
      value: data.summary.totalProfit,
      icon: <FaChartLine size={22} className="text-green-500" />,
    },
    {
      label: "Profit / Hour",
      value: data.summary.totalProfitPerHour,
      icon: <FaStopwatch size={22} className="text-purple-500" />,
    },
  ];

  return (
    <div className="space-y-8 px-4 md:px-8 py-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">📋 All Jobs</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryItems.map((item, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-full">{item.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <h3 className="text-xl font-bold text-gray-700">${item.value.toFixed(2)}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Job List */}
      <div className="mt-6">
        <motion.ul
          className="grid gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {data.jobs.map((job, idx) => {
            const profit = job.payment - (job.fuelCost + job.miscCost + job.wageCost);
            const hours = job.drivingTime + job.worksiteTime;
            const profitPerHour = hours ? (profit / hours).toFixed(2) : 0;

            return (
              <motion.li
                key={idx}
                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-base font-semibold text-gray-800 mb-1">
                      💵 Payment: ${job.payment.toFixed(2)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Profit: ${profit.toFixed(2)} | Profit/hr: ${profitPerHour}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </div>
  );
}
