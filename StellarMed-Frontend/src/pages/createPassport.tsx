import { useState } from 'react';
import { DocumentArrowUpIcon, FolderPlusIcon, CalendarDaysIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/navbar/navbar';

export default function CreatePassport() {
  const [currentStep, setCurrentStep] = useState(1);
  const [kycFile, setKycFile] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('pending');

  const handleKycUpload = (e) => {
    const file = e.target.files[0];
    if (file) setKycFile(file);
  };

  const handleHealthRecordsUpload = (e) => {
    const files = Array.from(e.target.files);
    setHealthRecords(files);
  };

  const handleSubmit = () => {
    // API call would go here
    setVerificationStatus('in_review');
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />  
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Progress Steps */}
        <div className="relative pt-8">
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="relative flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${currentStep >= step ? 'bg-emerald-500' : 'bg-slate-700'}
                  ${currentStep > step ? 'bg-emerald-300' : ''}`}>
                  {currentStep > step ? (
                    <CheckBadgeIcon className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-sm">{step}</span>
                  )}
                </div>
                <div className={`text-xs mt-2 ${currentStep >= step ? 'text-emerald-400' : 'text-gray-400'}`}>
                  {['KYC Verification', 'Health Records', 'Appointment', 'Status'][step - 1]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-slate-800 rounded-xl p-8 shadow-xl">
          {currentStep === 1 && (
            <div className="text-center">
              <DocumentArrowUpIcon className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Identity Verification</h2>
              <p className="text-gray-300 mb-6">Upload government-issued ID for KYC verification</p>
              <label className="cursor-pointer">
                <input type="file" onChange={handleKycUpload} className="hidden" accept=".pdf,.jpg,.png" />
                <div className="border-2 border-dashed border-emerald-500 rounded-lg p-8 hover:bg-slate-700 transition">
                  <p className="text-emerald-400">{kycFile ? kycFile.name : 'Click to upload document'}</p>
                  <p className="text-sm text-gray-400 mt-2">Supported formats: PDF, JPG, PNG</p>
                </div>
              </label>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <FolderPlusIcon className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Health Records Upload</h2>
              <p className="text-gray-300 mb-6">Upload your medical records and vaccination history</p>
              <label className="cursor-pointer">
                <input type="file" onChange={handleHealthRecordsUpload} multiple className="hidden" />
                <div className="border-2 border-dashed border-emerald-500 rounded-lg p-8 hover:bg-slate-700 transition">
                  <p className="text-emerald-400">
                    {healthRecords.length > 0 
                      ? `${healthRecords.length} files selected` 
                      : 'Click to upload files'}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">You can upload multiple files</p>
                </div>
              </label>
              {healthRecords.length > 0 && (
                <div className="mt-4 text-left">
                  <p className="text-sm text-gray-300">Selected files:</p>
                  <ul className="list-disc pl-5">
                    {healthRecords.map((file, index) => (
                      <li key={index} className="text-sm text-gray-400">{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center">
              <CalendarDaysIcon className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Schedule Verification Appointment</h2>
              <div className="space-y-6 max-w-sm mx-auto">
                <div className="text-left">
                  <label className="block text-sm text-gray-300 mb-2">Select Hospital</label>
                  <select 
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                    className="w-full bg-slate-700 rounded-lg p-3 text-white"
                  >
                    <option value="">Choose hospital</option>
                    <option value="general">City General Hospital</option>
                    <option value="central">Central Medical Center</option>
                    <option value="community">Community Health Clinic</option>
                  </select>
                </div>
                <div className="text-left">
                  <label className="block text-sm text-gray-300 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-slate-700 rounded-lg p-3 text-white"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center">
              <CheckBadgeIcon className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Verification Status</h2>
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-slate-700">
                <span className={`mr-2 animate-pulse ${
                  verificationStatus === 'pending' ? 'text-yellow-400' : 
                  verificationStatus === 'in_review' ? 'text-blue-400' : 
                  'text-emerald-400'}`}>
                  {verificationStatus === 'pending' ? 'Pending Submission' : 
                   verificationStatus === 'in_review' ? 'Under Review' : 
                   'Verified'}
                </span>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
              </div>
              <p className="mt-6 text-gray-300">
                {verificationStatus === 'in_review' 
                  ? 'Your documents are being verified. Please attend your scheduled appointment.'
                  : 'Your health passport will be activated after verification'}
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 && currentStep < 4 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 text-gray-300 hover:text-white"
              >
                Back
              </button>
            )}
            {currentStep < 3 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={(currentStep === 1 && !kycFile) || (currentStep === 2 && healthRecords.length === 0)}
                className="ml-auto px-6 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 disabled:opacity-50"
              >
                Next
              </button>
            )}
            {currentStep === 3 && (
              <button
                onClick={handleSubmit}
                disabled={!selectedHospital || !appointmentDate}
                className="ml-auto px-6 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 disabled:opacity-50"
              >
                Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}