import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const initialState = {
  payment: "",
  fuelCost: "",
  miscCost: "",
  wageCost: "",
  drivingTime: "",
  worksiteTime: "",
};

export default function JobForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmptyField = Object.values(form).some(val => val === "");
    if (hasEmptyField) return toast.error("All fields are required");

    setLoading(true);
    try {
      const res = await axios.post("https://clickupbackend.onrender.com/api/jobs", {
        ...form,
        payment: Number(form.payment),
        fuelCost: Number(form.fuelCost),
        miscCost: Number(form.miscCost),
        wageCost: Number(form.wageCost),
        drivingTime: Number(form.drivingTime),
        worksiteTime: Number(form.worksiteTime),
      });

      toast.success("Job added successfully!");
      setForm(initialState);
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-gray-700">Add New Job</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            type="number"
            name={key}
            placeholder={key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, str => str.toUpperCase())}
            value={value}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full md:w-auto px-6 py-3 rounded-lg text-white font-medium transition ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Submitting..." : "Add Job"}
      </button>
    </form>
  );
}
