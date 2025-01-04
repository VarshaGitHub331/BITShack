import { useState } from "react";

export default function Register({ formData, updateFormData, nextStep }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        className="bg-white px-4 py-6 rounded-lg shadow-md w-full max-w-md mx-4
        md:w-1/4"
      >
        <h2 className="text-md font-bold text-purple-500 text-center mb-6">
          Sign Up
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission
            nextStep(); // Call the next step if validation passes
          }}
        >
          <div className="mb-8">
            <label
              htmlFor="email"
              className="block text-gray-500 text-sm font-medium mb-2 text-left"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => {
                updateFormData("email", e.target.value);
              }}
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-gray-500 text-sm font-medium mb-2 text-left"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={formData.password}
              onChange={(e) => {
                updateFormData("password", e.target.value);
              }}
              placeholder="Enter your password"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
            />
          </div>
          <button
            type="submit" // Use type="submit" for form submission
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1"
          >
            Next
          </button>
        </form>
        <p className="text-gray-600 text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="#" className="text-purple-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
