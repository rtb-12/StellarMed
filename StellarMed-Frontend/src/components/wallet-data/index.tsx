import { useState } from "react";
import { useIsMounted } from "../../hooks";
import ConnectButton from "../connect-button";
import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export function WalletData() {
  const mounted = useIsMounted();
  const [publicKey, setPublicKey] = useState<string | null>(
    localStorage.getItem('stellarMed_publicKey')
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Handle successful connection
  const handleConnect = (connectedPublicKey: string) => {
    setPublicKey(connectedPublicKey);
  };

  // Handle disconnection
  const handleDisconnect = () => {
    setPublicKey(null);
    setIsDropdownOpen(false);
  };

  // Format public key for display
  const formatPublicKey = (key: string): string => {
    if (!key) return '';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  return (
    <div className="relative">
      {mounted && publicKey ? (
        <div>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center px-4 py-2 bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition"
          >
            <UserCircleIcon className="h-5 w-5 mr-2 text-emerald-400" />
            <span className="mr-1">{formatPublicKey(publicKey)}</span>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-700 rounded-lg shadow-lg p-4 z-10">
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Address</span>
                  <span 
                    className="text-sm text-emerald-400 hover:text-emerald-300 cursor-pointer" 
                    onClick={() => navigator.clipboard.writeText(publicKey)}
                    title="Copy to clipboard"
                  >
                    {formatPublicKey(publicKey)}
                  </span>
                </div>
                
                <div className="pt-2 border-t border-slate-600">
                  <a 
                    href={`https://testnet.steexp.com/account/${publicKey}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-emerald-400 hover:text-emerald-300 mb-2"
                  >
                    View on Explorer
                  </a>
                  
                  <button
                    onClick={handleDisconnect}
                    className="w-full mt-1 py-2 bg-red-900 hover:bg-red-800 text-white rounded text-sm transition"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <ConnectButton 
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      )}
    </div>
  );
}