import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import SummaryCard from "../components/SummaryCard";
import JobModal from "../components/JobModal";

import { FaMoneyBillWave, FaChartLine, FaStopwatch } from "react-icons/fa";

export default function Dashboard() {
  const [data, setData] = useState({ jobs: [], summary: null });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("https://clickupbackend.onrender.com/api/jobs");
      setData(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const summaryItems = [
    {
      label: "Total Payment",
      value: data?.summary?.totalPayment || 0,
      icon: <FaMoneyBillWave size={24} className="text-gray-500" />,
    },
    {
      label: "Total Profit",
      value: data?.summary?.totalProfit || 0,
      icon: <FaChartLine size={24} className="text-gray-500" />,
    },
    {
      label: "Profit / Hour",
      value: data?.summary?.totalProfitPerHour || 0,
      icon: <FaStopwatch size={24} className="text-gray-500" />,
    },
  ];

  const recentJobs = data?.jobs?.slice(0, 5);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 to-gray-200 relative">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800">📊 Dashboard</h1>
          <motion.button
            onClick={toggleModal}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow hover:opacity-90 transition"
          >
            + Add New Job
          </motion.button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-full">{item.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    ${item.value.toFixed(2)}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Jobs List */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">🕓 Recent Jobs</h2>
          <ul className="space-y-3">
            {recentJobs?.length > 0 ? (
              recentJobs.map((job, i) => {
                const profit =
                  job.payment - (job.fuelCost + job.miscCost + job.wageCost);
                return (
                  <motion.li
                    key={job._id || i}
                    className="flex justify-between items-center text-sm text-gray-700 bg-gray-100 px-4 py-3 rounded-lg hover:bg-gray-200 transition"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div>
                      <span className="font-medium text-gray-600">
                        💵 Payment: ${job.payment.toFixed(2)}
                      </span>
                      <br />
                      <span className="text-gray-500">
                        Profit: ${profit.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </motion.li>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm">No recent jobs found.</p>
            )}
          </ul>
        </div>
      </div>

      {/* Modal Render */}
      {showModal && (
        <JobModal onClose={toggleModal} onSuccess={fetchDashboard} />
      )}
    </div>
  );
}
