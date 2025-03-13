"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FaLock,
  FaShieldAlt,
  FaDatabase,
  FaCloud,
  FaUserShield,
  FaBookOpen,
} from "react-icons/fa";

const SecurityPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="bg-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white">
            Our Commitment to Security
          </h1>
          <p className="text-lg text-gray-300 mt-4">
            Protecting your data is our top priority. Learn about the measures
            we take to ensure your information is safe.
          </p>
        </div>
      </header>

      {/* Security Practices Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <motion.h2
              className="text-3xl font-semibold text-gray-800"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Security Practices
            </motion.h2>
            <p className="text-base text-gray-600 mt-4">
              Here are some of the key practices we use to protect your data:
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center mb-4">
                <FaLock className="text-4xl text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Encryption
              </h3>
              <p className="text-gray-600 mt-2">
                We use industry-standard encryption to protect your data both at
                rest and in transit.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center mb-4">
                <FaShieldAlt className="text-4xl text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Regular Audits
              </h3>
              <p className="text-gray-600 mt-2">
                Regular security audits help us identify and address potential
                vulnerabilities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center mb-4">
                <FaDatabase className="text-4xl text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Data Backup
              </h3>
              <p className="text-gray-600 mt-2">
                Regular backups ensure that your data can be restored in case of
                any unexpected issues.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center mb-4">
                <FaCloud className="text-4xl text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Secure Infrastructure
              </h3>
              <p className="text-gray-600 mt-2">
                We use secure servers and infrastructure to safeguard your data
                from unauthorized access.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center mb-4">
                <FaUserShield className="text-4xl text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Access Controls
              </h3>
              <p className="text-gray-600 mt-2">
                Strict access controls ensure that only authorized personnel can
                access sensitive information.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center mb-4">
                <FaBookOpen className="text-4xl text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                User Education
              </h3>
              <p className="text-gray-600 mt-2">
                We provide resources to educate our users about best practices
                for maintaining their own security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gray-800 text-white text-center">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-semibold"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Have Questions?
          </motion.h2>
          <p className="text-lg mt-4">
            If you have any questions or need more information about our
            security practices, feel free to reach out.
          </p>
          <motion.button
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-full text-lg shadow-md transform hover:scale-105 transition-all duration-300 mt-6"
            whileHover={{ scale: 1.05 }}
          >
            Contact Us
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default SecurityPage;
