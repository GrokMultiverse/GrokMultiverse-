"use client";
import { useState, useEffect } from 'react';
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import WalletContextProvider from "../../components/WalletContextProvider";
import { PhaseConfig } from "../../utils/PhaseConfig";

function AdminDashboard() {
  const wallet = useAnchorWallet();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (wallet && wallet.publicKey.toString() === PhaseConfig.adminWallet) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [wallet]);

  if (!wallet) {
    return <div className="min-h-screen bg-black text-yellow-500 flex items-center justify-center font-mono">PLEASE CONNECT WALLET</div>;
  }

  if (!isAdmin) {
    return <div className="min-h-screen bg-black text-red-500 flex items-center justify-center font-mono text-2xl">ACCESS DENIED: NOT AN ADMIN</div>;
  }

  return (
    <div className="min-h-screen bg-black text-yellow-500 p-8 font-mono">
      <h1 className="text-4xl font-black mb-8 border-b-2 border-yellow-500 pb-2">GROK ADMIN PANEL</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-yellow-500/50 p-6 rounded-xl bg-gray-900">
          <h2 className="text-xl font-bold mb-4 uppercase">Phase Control</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-black p-3 rounded">
              <span>Points Farming</span>
              <span className="text-green-500 font-bold">ACTIVE</span>
            </div>
            <div className="flex justify-between items-center bg-black p-3 rounded opacity-50">
              <span>NFT Mint</span>
              <span className="text-gray-500">LOCKED (Edit PhaseConfig.js to unlock)</span>
            </div>
          </div>
        </div>

        <div className="border border-yellow-500/50 p-6 rounded-xl bg-gray-900">
          <h2 className="text-xl font-bold mb-4 uppercase">System Stats</h2>
          <div className="space-y-2">
            <p>Admin: <span className="text-xs text-gray-400">{wallet.publicKey.toString()}</span></p>
            <p>Total Registered Users: <span className="text-white">FETCHING...</span></p>
            <p>Network: <span className="text-blue-400">Solana Devnet</span></p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500 rounded">
        <p className="text-xs italic text-yellow-200">
          Note: Current phase updates require manual edits in PhaseConfig.js via GitHub for security. 
          Dynamic on-chain phase switching coming in Phase 2.
        </p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <WalletContextProvider>
      <AdminDashboard />
    </WalletContextProvider>
  );
    }
    
