import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";

const user = {
  name: "Shivam",
};

const dummyPets = [
  { id: 1, name: "Buddy", age: "2 years", image: "https://via.placeholder.com/100" },
  { id: 2, name: "Luna", age: "3 years", image: "" },
  { id: 3, name: "Rocky", age: "1 year", image: "https://via.placeholder.com/100" },
];

const dummyTips = [
  "Ensure your pet gets regular exercise to stay healthy!",
  "Always provide fresh water for your pets.",
  "Visit the vet at least once a year for checkups.",
];

const HomePage = () => {
  const [showTips, setShowTips] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-pink-100 p-6 relative">
      {/* Fixed Navbar (user info on top left) */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
        <h2 className="text-xl font-bold">Hello, {user.name}! Welcome back</h2>
        <div className="w-10 h-10 flex items-center justify-center bg-pink-500 text-white font-bold rounded-full">
          {user.name.charAt(0)}
        </div>
      </div>

      {/* Right-side Tips Panel */}
      <motion.div
        className="fixed top-0 right-0 h-screen w-72 bg-white shadow-lg p-4 z-50 flex flex-col"
        initial={{ x: showTips ? 0 : 300 }}
        animate={{ x: showTips ? 0 : 300 }}
        transition={{ duration: 0.5 }}
      >
        {/* Toggle Button in the vertical center */}
        <button
          onClick={() => setShowTips(!showTips)}
          className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-white rounded-l-md px-2 py-2 shadow-lg"
        >
          {showTips ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Tips & Articles</h3>
        </div>
        <ul className="text-gray-700 text-sm space-y-2">
          {dummyTips.map((tip, index) => (
            <li key={index} className="border-b pb-2">{tip}</li>
          ))}
        </ul>
      </motion.div>

      {/* Main Content: Vertical layout for pets */}
      <div className="mt-20 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Pets</h2>
        <div className="flex flex-col gap-4">
          {dummyPets.map((pet) => (
            <motion.div
              key={pet.id}
              className="p-4 bg-white rounded-lg shadow-lg flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/pet/${pet.id}`)}
            >
              <img
                src={pet.image || "https://via.placeholder.com/100"}
                alt={pet.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{pet.name}</h3>
                <p className="text-sm text-gray-600">{pet.age}</p>
              </div>
            </motion.div>
          ))}
          {/* Add Pet Button */}
          <motion.div
            className="p-4 bg-pink-500 text-white rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-pink-600"
            whileHover={{ scale: 1.05 }}
          >
            <FaPlus size={20} />
            <span>Add Pet</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
