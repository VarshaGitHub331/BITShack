import React from "react";

export default function Footer() {
  return (
    <footer className="bg-purple-500 text-white py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-right">
            <p className="text-sm">
              &copy; 2025 Medisure. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
