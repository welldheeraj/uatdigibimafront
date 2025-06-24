"use client";

import Image from "next/image";

export default function Main() {
  return (
    <div className="min-h-screen bg-[#D3F0FF] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 md:p-12 max-w-6xl w-full flex flex-col md:flex-row items-center gap-8">
        {/* Left Section */}
        <div className="flex-1 space-y-6">
          <h2 className="text-[#2F4A7E] text-xl md:text-2xl font-semibold">
            <span className="font-bold">At DigiBima,</span> we understand the complexities of the insurance industry.
          </h2>
          <p className="text-[#2F4A7E] text-lg">
            Our software is built on years of expertise and is designed to adapt to your evolving needs.
          </p>

          <button className="bg-gradient-to-r from-[#1782FF] to-[#3A5DFF] text-white font-medium px-6 py-2 rounded-full shadow">
            Connect with us
          </button>

          <p>
            <span className="text-green-600 font-medium">Get in touch with us,</span> we'll be pleased to assist you!
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1 grid grid-cols-2 gap-6">
          {[
            { label: "Car", src: "/car.jpg" },
            { label: "Bike", src: "/bike.jpg" },
            { label: "Health", src: "/health.jpg" },
            { label: "Commercial", src: "/commercial.jpg" },
          ].map(({ label, src }, index) => (
            <div key={index} className="text-center border-2 border-blue-300 rounded-xl overflow-hidden shadow-sm">
              <Image
                src={src}
                alt={label}
                width={200}
                height={120}
                className="w-full h-[120px] object-cover"
              />
              <div className="py-2 font-medium text-lg">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
