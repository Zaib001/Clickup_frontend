import { motion } from "framer-motion";

export default function SummaryCard({ label, value, index = 0 }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="text-xl font-bold text-gray-700">${parseFloat(value).toFixed(2)}</h3>
    </motion.div>
  );
}
