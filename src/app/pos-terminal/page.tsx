'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const TastyStation = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Menu');
  const [orderItems, setOrderItems] = useState([
    { name: 'Pasta with Roast Beef', quantity: 2, price: 20 },
    { name: 'Shrimp Rice Bowl', quantity: 2, price: 12 },
    { name: 'Apple Stuffed Pancake', quantity: 1, price: 35 },
    { name: 'Vegetable Shrimp', quantity: 1, price: 10 },
  ]);

  const menuItems = [
    { id: 1, name: 'Grilled Salmon Steak', category: 'Lunch', price: 15, img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=250&fit=crop' },
    { id: 2, name: 'Tofu Poke Bowl', category: 'Salad', price: 7, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop' },
    { id: 3, name: 'Pasta with Roast Beef', category: 'Pasta', price: 10, img: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=250&fit=crop' },
    { id: 4, name: 'Beef Steak', category: 'Beef', price: 30, img: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400&h=250&fit=crop' },
    { id: 5, name: 'Shrimp Rice Bowl', category: 'Rice', price: 6, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=250&fit=crop' },
    { id: 6, name: 'Apple Stuffed Pancake', category: 'Dessert', price: 35, img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=250&fit=crop' },
    { id: 7, name: 'Chicken Quinoa & Herbs', category: 'Chicken', price: 12, img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=250&fit=crop' },
    { id: 8, name: 'Vegetable Shrimp', category: 'Salad', price: 10, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop' },
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = 4;
  const donation = 1;
  const total = subtotal + tax + donation;

  const addToOrder = (item: any) => {
    setOrderItems(prev => {
      const existing = prev.findIndex(i => i.name === item.name);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing].quantity += 1;
        return updated;
      } else {
        return [...prev, { name: item.name, quantity: 1, price: item.price }];
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0A8C7F] p-4 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-white border-b flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A8C7F] rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl">🍽️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Tasty Station</h1>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search menu, orders and more"
                className="w-full bg-gray-100 border border-gray-200 rounded-full py-3 px-5 pl-12 focus:outline-none focus:border-[#0A8C7F]"
              />
              <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-200">
              🛎️
            </div>
            <div className="flex items-center gap-3">
              <Image
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Ibrahim Kadri"
                width={40}
                height={40}
                className="rounded-2xl"
              />
              <div>
                <p className="font-semibold text-sm">Ibrahim Kadri</p>
                <p className="text-xs text-gray-500 -mt-1">Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex h-[calc(100vh-85px)]">
          
          {/* Main Menu Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Order Line Tabs */}
            <div className="px-8 pt-6 pb-4 border-b flex gap-2 flex-wrap">
              <button className="px-6 py-2 bg-[#0A8C7F] text-white rounded-full text-sm font-medium">All (78)</button>
              <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">Dine in (04)</button>
              <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">Wait List (03)</button>
              <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">Take Away (12)</button>
              <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">Served (69)</button>
            </div>

            {/* Menu Area */}
            <div className="flex-1 p-8 overflow-auto">
              <h2 className="text-3xl font-semibold mb-6">Foodies Menu</h2>

              {/* Categories */}
              <div className="flex gap-3 mb-8 overflow-x-auto pb-4">
                {['All Menu', 'Special', 'Soups', 'Desserts', 'Chickens'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-7 py-3 rounded-2xl whitespace-nowrap text-sm font-medium transition-all ${
                      selectedCategory === cat 
                        ? 'bg-[#0A8C7F] text-white shadow-md' 
                        : 'bg-white border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {menuItems.map(item => (
                  <div 
                    key={item.id} 
                    className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => addToOrder(item)}
                  >
                    <div className="relative h-52 bg-gray-100">
                      <Image 
                        src={item.img} 
                        alt={item.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-base line-clamp-2 min-h-[48px]">{item.name}</h3>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-[#0A8C7F] font-bold text-2xl">${item.price}.00</p>
                        <button className="bg-[#0A8C7F] text-white w-9 h-9 rounded-2xl flex items-center justify-center text-xl hover:bg-[#08796e] transition-colors shadow-md">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar (Right) */}
          <div className="w-96 bg-gray-50 border-l p-6 overflow-auto">
            <div className="bg-white rounded-3xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Table No</p>
                  <p className="text-3xl font-bold text-gray-800">#04</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order #</p>
                  <p className="font-semibold text-lg">#F0030</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">2 People • Dine In</p>
            </div>

            <h3 className="font-semibold text-lg mb-4">Ordered Items ({orderItems.length})</h3>
            
            <div className="space-y-4 mb-8">
              {orderItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-white p-4 rounded-2xl">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#0A8C7F]">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-3xl p-6 space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Donation for Palestine</span>
                <span className="text-emerald-600">${donation.toFixed(2)}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Payable</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex gap-3 mb-6">
              <button className="flex-1 py-4 bg-white border-2 border-gray-300 rounded-2xl font-medium hover:bg-gray-50">Cash</button>
              <button className="flex-1 py-4 bg-[#0A8C7F] text-white rounded-2xl font-medium">Card</button>
              <button className="flex-1 py-4 bg-white border-2 border-gray-300 rounded-2xl font-medium hover:bg-gray-50">Scan</button>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-4 border-2 border-gray-300 rounded-2xl font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                🖨️ Print
              </button>
              <button className="flex-1 py-4 bg-[#0A8C7F] text-white rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-[#08796e]">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TastyStation;
