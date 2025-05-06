import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaMoneyBill,
  FaGasPump,
  FaTools,
  FaUserClock,
  FaRoad,
  FaStopwatch,
} from "react-icons/fa";

const fieldConfig = [
  { name: "payment", placeholder: "Payment", icon: <FaMoneyBill /> },
  { name: "fuelCost", placeholder: "Fuel Cost", icon: <FaGasPump /> },
  { name: "miscCost", placeholder: "Misc Cost", icon: <FaTools /> },
  { name: "wageCost", placeholder: "Wage Cost", icon: <FaUserClock /> },
  { name: "drivingTime", placeholder: "Driving Time", icon: <FaRoad /> },
  { name: "worksiteTime", placeholder: "Worksite Time", icon: <FaStopwatch /> },
];

const initialState = {
  payment: "",
  fuelCost: "",
  miscCost: "",
  wageCost: "",
  drivingTime: "",
  worksiteTime: "",
};

export default function JobModal({ onClose, onSuccess, jobToEdit }) {
  const isEditing = Boolean(jobToEdit);
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && jobToEdit) {
      setForm({
        payment: jobToEdit.payment,
        fuelCost: jobToEdit.fuelCost,
        miscCost: jobToEdit.miscCost,
        wageCost: jobToEdit.wageCost,
        drivingTime: jobToEdit.drivingTime,
        worksiteTime: jobToEdit.worksiteTime,
      });
    }
  }, [jobToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmptyField = Object.values(form).some((val) => val === "");
    if (hasEmptyField) return toast.error("All fields are required");

    const payload = {
      ...form,
      payment: Number(form.payment),
      fuelCost: Number(form.fuelCost),
      miscCost: Number(form.miscCost),
      wageCost: Number(form.wageCost),
      drivingTime: Number(form.drivingTime),
      worksiteTime: Number(form.worksiteTime),
    };

    setLoading(true);
    try {
      if (isEditing) {
        await axios.put(
          `https://clickupbackend.onrender.com/api/jobs/${jobToEdit._id}`,
          payload
        );
        toast.success("Job updated successfully!");
      } else {
        await axios.post("https://clickupbackend.onrender.com/api/jobs", payload);
        toast.success("Job added successfully!");
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-xl w-full max-w-2xl p-6 relative shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✖
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {isEditing ? "Edit Job" : "Add New Job"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldConfig.map(({ name, placeholder, icon }) => (
              <div key={name} className="relative">
                <div className="absolute top-3 left-3 text-gray-400">
                  {icon}
                </div>
                <input
                  type="number"
                  name={name}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  className="pl-10 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-3 rounded-lg text-white font-medium ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : isEditing ? "Update Job" : "Submit"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
