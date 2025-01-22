import React from "react";

const LandingPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-purple-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-sm font-bold md:text-5xl mb-6">
            Healthcare Management Made Easy
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Streamline hospital management, enhance patient care, and access
            your health records in one place.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="#features"
              className="bg-white text-purple-500 px-6 py-3 rounded-lg font-semibold hover:bg-purple-100 shadow-lg"
            >
              Explore Features
            </a>
            <a
              href="#demo"
              className="bg-white text-purple-500 border border-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
            >
              Try the Demo
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-purple-500 mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Nearby Hospital Locator */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="mb-4">
                <span className="bg-purple-500 text-white rounded-full p-4">
                  🏥
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">
                Nearby Hospital Locator
              </h3>
              <p className="text-gray-600">
                Find nearby hospitals on an interactive map with contact and
                address details.
              </p>
            </div>
            {/* User Login & Health Data */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="mb-4">
                <span className="bg-purple-500 text-white rounded-full p-4">
                  🔒
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">
                User Login & Health Data
              </h3>
              <p className="text-gray-600">
                Securely store and manage your health details over time with
                ease.
              </p>
            </div>
            {/* Access Health Records */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="mb-4">
                <span className="bg-purple-500 text-white rounded-full p-4">
                  📂
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">Access Health Records</h3>
              <p className="text-gray-600">
                View medical history, prescriptions, lab results, and more.
              </p>
            </div>
            {/* Appointment Scheduling */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="mb-4">
                <span className="bg-purple-500 text-white rounded-full p-4">
                  📅
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">Appointment Scheduling</h3>
              <p className="text-gray-600">
                Book, reschedule, or cancel appointments with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section id="demo" className="bg-purple-100 py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-purple-500 mb-4">
            Ready to Revolutionize Healthcare?
          </h2>
          <p className="text-gray-700 mb-6">
            Join us in making healthcare smarter, faster, and more accessible
            for everyone.
          </p>
          <a
            href="#contact"
            className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 shadow-lg"
          >
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
