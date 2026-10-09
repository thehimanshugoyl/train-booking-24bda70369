"use client";

import React, { useState } from "react";

interface ECateringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ECateringModal({ isOpen, onClose }: ECateringModalProps) {
  const [pnrNumber, setPnrNumber] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orderedItem, setOrderedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  const menuItems = [
    { id: 1, name: "Special IRCTC Maharaja Veg Thali", brand: "IRCTC Pantry", price: 240, rating: "4.8", veg: true, category: "thali", image: "🍱" },
    { id: 2, name: "Paneer Butter Masala Combo + 3 Parathas", brand: "Haldiram's", price: 280, rating: "4.9", veg: true, category: "meals", image: "🍛" },
    { id: 3, name: "Hyderabadi Dum Biryani + Raita", brand: "Behrouz Biryani", price: 320, rating: "4.7", veg: false, category: "biryani", image: "🍚" },
    { id: 4, name: "Masala Dosa with Sambar & Chutneys", brand: "Saravana Bhavan", price: 160, rating: "4.8", veg: true, category: "breakfast", image: "🥞" },
    { id: 5, name: "Medium Peppy Paneer Pizza", brand: "Domino's Pizza", price: 349, rating: "4.6", veg: true, category: "snacks", image: "🍕" },
    { id: 6, name: "Pure Jain Satvik Deluxe Meal (No Onion/Garlic)", brand: "Govinda's", price: 260, rating: "4.9", veg: true, category: "jain", image: "🥗" },
  ];

  const filteredItems = selectedCategory === "all"
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  const handleOrder = (name: string) => {
    setOrderedItem(name);
    setTimeout(() => {
      alert(`🎉 Order Confirmed: ${name} will be delivered fresh & hot to your seat at the next station!`);
      setOrderedItem(null);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-gray-900 border border-zinc-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-6 text-white flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Official IRCTC e-Catering Partner
              </span>
            </div>
            <h3 className="text-2xl font-extrabold flex items-center gap-2">
              <span>🍱 Food On Track — Delivered to Your Seat</span>
            </h3>
            <p className="text-xs text-orange-100 mt-0.5">
              Order fresh food from certified restaurant partners delivered right to your train berth
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* PNR verification bar */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          <div className="flex gap-2 w-full sm:w-auto flex-1">
            <input
              type="text"
              maxLength={10}
              value={pnrNumber}
              onChange={(e) => setPnrNumber(e.target.value)}
              placeholder="Enter 10-digit PNR for berth auto-dispatch"
              className="flex-1 bg-gray-900 border border-zinc-700 rounded-xl px-3 py-2 text-white text-xs font-mono"
            />
            <button className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition">
              Verify PNR
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
            {["all", "thali", "jain", "biryani", "snacks"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-white text-black font-bold"
                    : "bg-zinc-800 text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 p-4 rounded-2xl flex gap-4 transition shadow-md"
            >
              <div className="text-4xl bg-zinc-900 w-16 h-16 rounded-xl flex items-center justify-center shrink-0 border border-zinc-800">
                {item.image}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold border border-emerald-500/40 text-emerald-400 bg-emerald-950/40">
                      {item.veg ? "🟢 PURE VEG" : "🔴 NON-VEG"}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">{item.brand}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="font-extrabold text-amber-400 text-base">₹{item.price}</span>
                    <span className="text-gray-400">★ {item.rating}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOrder(item.name)}
                  disabled={orderedItem === item.name}
                  className="mt-3 w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer shadow-md"
                >
                  {orderedItem === item.name ? "Placing Order..." : "Order to Seat →"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center text-xs text-gray-400 shrink-0">
          <span>🛡️ FSSAI Certified hygiene & 100% contactless seat delivery</span>
          <button
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-1.5 rounded-xl text-xs font-semibold"
          >
            Close Menu
          </button>
        </div>
      </div>
    </div>
  );
}
