import {  ShieldCheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import Navbar from '../components/navbar/navbar';

export default function HealthPassport() {
  const [showFullSignature, setShowFullSignature] = useState(false);
  
  // Mock data - replace with actual blockchain data
  const passportData = {
    name: "John Doe",
    dob: "1985-03-15",
    nationality: "United States",
    passportId: "STLMED-X3B9-7T2K-5J1M",
    issueDate: "2024-02-15",
    expiryDate: "2025-02-15",
    vaccinations: [
      { name: "COVID-19", date: "2023-12-01", dose: "Booster" },
      { name: "Influenza", date: "2024-01-10", dose: "Annual" }
    ],
    recentTests: [
      { type: "HIV", result: "Negative", date: "2024-02-10" }
    ],
    qrData: "stellar:medpass/verify/X3B97T2K5J1M",
    signature: "ed25519:1d8a...c3f2",
    status: "Valid"
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
           <Navbar />
  <div className="min-h-screen bg-slate-900 text-white p-8 py-20">
     
      <div className="max-w-4xl mx-auto">
        {/* Passport Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">StellarMed Health Passport</h1>
            <p className="text-emerald-400">Powered by Stellar Blockchain</p>
          </div>
          <div className={`flex items-center px-4 py-2 rounded-lg ${
            passportData.status === 'Valid' ? 'bg-emerald-800' : 'bg-red-800'
          }`}>
            <ShieldCheckIcon className="w-6 h-6 mr-2" />
            <span>{passportData.status}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800 rounded-xl p-8 shadow-xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6 border-b border-emerald-500 pb-2">
                Holder Information
              </h2>
              <div className="space-y-4">
                <InfoRow label="Full Name" value={passportData.name} />
                <InfoRow label="Date of Birth" value={passportData.dob} />
                <InfoRow label="Nationality" value={passportData.nationality} />
                <InfoRow label="Passport ID" value={passportData.passportId} />
                <InfoRow label="Issued On" value={passportData.issueDate} />
                <InfoRow label="Expires On" value={passportData.expiryDate} />
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-6 border-b border-emerald-500 pb-2">
                Medical Records
              </h2>
              <div className="space-y-6">
                <VaccinationSection vaccinations={passportData.vaccinations} />
                <TestResultsSection tests={passportData.recentTests} />
              </div>
            </div>

            {/* Verification Section */}
            <div className="border-l border-slate-700 pl-8">
              <div className="sticky top-8">
                <h2 className="text-2xl font-bold mb-6 border-b border-emerald-500 pb-2">
                  Verification
                </h2>
                
                {/* QR Code */}
                <div className="bg-white p-4 rounded-lg mb-8">
                  <QRCodeSVG 
                    value={passportData.qrData}
                    size={256}
                    level="H"
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-gray-400 text-sm mb-8">
                  Authorities can scan this QR code to verify the authenticity of this passport
                </p>

                {/* Digital Signature */}
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Blockchain Signature</span>
                    <button 
                      onClick={() => copyToClipboard(passportData.signature)}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      <ClipboardDocumentIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="font-mono text-sm break-all bg-slate-800 p-3 rounded">
                    {showFullSignature ? passportData.signature : `${passportData.signature.slice(0, 24)}...`}
                    <button
                      onClick={() => setShowFullSignature(!showFullSignature)}
                      className="text-emerald-400 ml-2 hover:text-emerald-300"
                    >
                      {showFullSignature ? 'Show less' : 'Show more'}
                    </button>
                  </div>
                </div>

                {/* Verification Instructions */}
                <div className="mt-8 p-4 bg-slate-700 rounded-lg">
                  <h3 className="font-bold mb-2">Verification Steps</h3>
                  <ol className="list-decimal list-inside text-sm space-y-2">
                    <li>Scan QR code with authorized device</li>
                    <li>Verify signature matches blockchain records</li>
                    <li>Check certificate revocation status</li>
                    <li>Confirm timestamp validity window</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-6 text-sm text-gray-400 text-center">
          This document is cryptographically signed and stored on the Stellar blockchain.
          Any tampering will invalidate the passport.
        </div>
      </div>
    </div>
    </div>
  
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between border-b border-slate-700 py-2">
    <span className="text-gray-400">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

interface Vaccination {
  name: string;
  date: string;
  dose: string;
}

const VaccinationSection = ({ vaccinations }: { vaccinations: Vaccination[] }) => (
  <div>
    <h3 className="font-bold mb-3">Vaccinations</h3>
    {vaccinations.map((vax, index) => (
      <div key={index} className="bg-slate-700 p-3 rounded-lg mb-3">
        <div className="flex justify-between">
          <span>{vax.name}</span>
          <span className="text-emerald-400">{vax.dose}</span>
        </div>
        <div className="text-sm text-gray-400">{vax.date}</div>
      </div>
    ))}
  </div>
);

interface MedicalTest {
  type: string;
  result: string;
  date: string;
}

const TestResultsSection = ({ tests }: { tests: MedicalTest[] }) => (
  <div>
    <h3 className="font-bold mb-3">Recent Medical Tests</h3>
    {tests.map((test, index) => (
      <div key={index} className="bg-slate-700 p-3 rounded-lg mb-3">
        <div className="flex justify-between">
          <span>{test.type}</span>
          <span className={test.result === 'Negative' ? 'text-emerald-400' : 'text-red-400'}>
            {test.result}
          </span>
        </div>
        <div className="text-sm text-gray-400">{test.date}</div>
      </div>
    ))}
  </div>
);