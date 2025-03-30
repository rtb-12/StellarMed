import { useState } from 'react';
import { ShieldCheckIcon, UserGroupIcon, DocumentCheckIcon, Cog6ToothIcon, ClockIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/navbar/navbar';

interface SettingRowProps {
    label: string;
    value: string;
  }
  
export default function AdminDashboard() {
  // Mock data - replace with actual contract data
  const [admins] = useState([
    { address: 'GA3S...E5RS', weight: 1, active: true, approvals: 2 },
    { address: 'GCDE...CKDU', weight: 1, active: true, approvals: 1 }
  ]);

  const [pendingActions] = useState([
    { type: 'Add Admin', target: 'GCAP...BK3D', approvalsNeeded: 1 },
    { type: 'Upgrade Contract', status: 'Time-locked', daysLeft: 2 }
  ]);

  const [providers] = useState([
    { id: 'HOSP-001', address: 'GDLE...XPQE', credentials: 'Medical License #1234', active: true },
    { id: 'CLIN-002', address: 'GAP2...3V6N', credentials: 'WHO Certified', active: false }
  ]);

  return (
  <div>
    <Navbar />
      <div className="min-h-screen bg-slate-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <ShieldCheckIcon className="w-8 h-8 text-emerald-400 mr-2" />
              Governance Dashboard
            </h1>
            <p className="text-emerald-300">Connected as: GA3S...E5RS (Admin)</p>
          </div>
          <div className="bg-emerald-900 px-4 py-2 rounded-lg">
            Required Approvals: 2/3
          </div>
        </div>

        {/* Governance Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Admin Management */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2" />
              Admin Management
            </h2>
            
            <div className="space-y-4">
              {admins.map((admin, index) => (
                <div key={index} className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-mono">{admin.address}</p>
                      <div className="flex items-center mt-2">
                        <span className={`w-2 h-2 rounded-full mr-2 ${admin.active ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span className="text-sm">{admin.active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm">
                      Revoke
                    </button>
                  </div>
                  <div className="mt-3 text-sm text-emerald-300">
                    Approvals: {admin.approvals}/3
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg flex items-center justify-center">
              + Propose New Admin
            </button>
          </div>

          {/* Pending Actions */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              Pending Actions
            </h2>

            <div className="space-y-4">
              {pendingActions.map((action, index) => (
                <div key={index} className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{action.type}</p>
                      <p className="text-sm text-gray-400">{action.target}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 text-sm">
                        {action.approvalsNeeded ? `Needs ${action.approvalsNeeded} more approvals` : action.status}
                      </p>
                      {action.daysLeft && (
                        <p className="text-xs text-gray-400">{action.daysLeft} days remaining</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-2 rounded-lg text-sm">
                      Approve
                    </button>
                    <button className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Providers Section */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <DocumentCheckIcon className="w-5 h-5 mr-2" />
            Healthcare Providers
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="pb-3 text-left">Provider ID</th>
                  <th className="pb-3 text-left">Credentials</th>
                  <th className="pb-3 text-left">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((provider, index) => (
                  <tr key={index} className="border-b border-slate-700">
                    <td className="py-4 font-mono">{provider.id}</td>
                    <td className="py-4">{provider.credentials}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${provider.active ? 'bg-emerald-800 text-emerald-400' : 'bg-red-800 text-red-400'}`}>
                        {provider.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg mr-2">
                        Edit
                      </button>
                      <button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg">
                        {provider.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contract Settings */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Cog6ToothIcon className="w-5 h-5 mr-2" />
            Protocol Settings
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="font-bold mb-3">Governance Parameters</h3>
              <div className="space-y-2">
                <SettingRow label="Required Approvals" value="2/3" />
                <SettingRow label="Upgrade Time-lock" value="48 hours" />
                <SettingRow label="Emergency Freeze" value="Inactive" />
              </div>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="font-bold mb-3">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded-lg">
                  Propose Contract Upgrade
                </button>
                <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg">
                  Emergency Freeze Protocol
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}


const SettingRow = ({ label, value }: SettingRowProps) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-600">
    <span className="text-gray-400">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

