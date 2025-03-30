import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GlobeAltIcon,
  LockClosedIcon,
  QrCodeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/navbar/navbar";
export default function HomePage() {
  const navigate = useNavigate();

  const handleCreatePassport = () => {
    navigate("/createPassport");
  };

  const handleLearnMore = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 pb-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Your Health Identity,
              <span className="text-emerald-400"> Secured on Stellar</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              StellarMed revolutionizes health record management through
              blockchain technology. Own, control, and share your medical data
              securely with decentralized smart contracts powered by Soroban on
              the Stellar network.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <button
                onClick={handleCreatePassport}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Create Health Passport
              </button>
              <button
                onClick={handleLearnMore}
                className="mt-3 sm:mt-0 sm:ml-3 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-emerald-100 bg-emerald-900 hover:bg-emerald-800"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-12 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Why StellarMed?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">
              Decentralized healthcare management built for the modern world
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-slate-700 rounded-lg px-6 pb-8 h-full">
                  <div className="-mt-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-500 text-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      {feature.name}
                    </h3>
                    <p className="mt-2 text-base text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-emerald-400 tracking-wider uppercase">
                StellarMed
              </h3>
              <p className="mt-4 text-sm text-gray-300">
                Powered by Stellar Blockchain
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-200 uppercase">
                Solutions
              </h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Patients
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Providers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Verifiers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-200 uppercase">
                Legal
              </h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-200 uppercase">
                Connect
              </h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-700 pt-8 text-center">
            <p className="text-base text-gray-300">
              &copy; {new Date().getFullYear()} StellarMed. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    name: "Blockchain Security",
    description:
      "Immutable health records stored on Stellar blockchain with Soroban smart contracts",
    icon: LockClosedIcon,
  },
  {
    name: "Global Verification",
    description:
      "Instant verification of health credentials via QR codes and access tokens",
    icon: QrCodeIcon,
  },
  {
    name: "Multi-Role System",
    description:
      "Comprehensive roles for patients, providers, administrators, and verifiers",
    icon: UserGroupIcon,
  },
];
