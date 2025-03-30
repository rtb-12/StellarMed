import React, { useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import {
    isConnected,
    getAddress,
    isAllowed,
    setAllowed,
    getNetworkDetails
} from "@stellar/freighter-api";

interface ConnectButtonProps {
  label?: string;
  className?: string;
  onConnect?: (publicKey: string) => void;
  onDisconnect?: () => void;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({
  label = "Connect Wallet",
  className = '',
  onConnect,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
     
      const connectedResult = await isConnected();
      
      if (!connectedResult.isConnected) {
        alert('Please install Freighter wallet extension: https://www.freighter.app/');
        setIsConnecting(false);
        return;
      }
      
      
      const isAppAllowed = await isAllowed();
      
      
      if (!isAppAllowed.isAllowed) {
        const allowedResult = await setAllowed();
        if (!allowedResult.isAllowed) {
          alert('You need to allow this app to connect to your Freighter wallet');
          setIsConnecting(false);
          return;
        }
      }
      

      const addressObj = await getAddress();
      
      if (addressObj.error || !addressObj.address) {
        throw new Error(addressObj.error || 'Failed to get address');
      }
      
      const publicKey = addressObj.address;
      
     
      const networkDetails = await getNetworkDetails();
      console.log('Connected to network:', networkDetails.network);
      

      localStorage.setItem('stellarMed_publicKey', publicKey);
      localStorage.setItem('stellarMed_network', networkDetails.network);
      
     
      if (onConnect) {
        onConnect(publicKey);
      }
      
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      alert('Failed to connect wallet. Please make sure Freighter is installed and unlocked.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <button
      className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 ${className}`}
      onClick={connectWallet}
      disabled={isConnecting}
    >
      <UserCircleIcon className="h-5 w-5 mr-2" />
      {isConnecting ? "Connecting..." : label}
    </button>
  );
};

export default ConnectButton;