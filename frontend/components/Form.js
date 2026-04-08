import { useState } from "react";
import axios from "axios";

export default function Form() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: ""
  });

  const handleSubmit = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, form);
    alert("Enquiry sent!");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-5 mt-10 shadow">
      <input
        placeholder="Name"
        className="w-full mb-2 p-2 border"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Phone"
        className="w-full mb-2 p-2 border"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <input
        placeholder="Location"
        className="w-full mb-2 p-2 border"
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white w-full p-2"
      >
        Submit Enquiry
      </button>
    </div>
  );
}