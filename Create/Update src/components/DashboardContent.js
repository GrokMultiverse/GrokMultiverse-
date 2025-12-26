"use client";
import { useEffect, useState } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import WalletContextProvider from "./WalletContextProvider";
import { useGrokProgram } from "../hooks/useGrokProgram";
import { PhaseConfig, SOCIALS } from "../utils/PhaseConfig";
import { useSearchParams } from 'next/navigation';

// --- Internal Components ---
const HeroSection = () => (
  <div className="relative w-full h-64 overflow-hidden border-b-4 border-yellow-500 bg-gray-900">
    <div className="absolute inset-0 flex items-center animate-marquee">
      <img src="/assets/banner.jpg" alt="Banner" className="h-full w-full object-cover opacity-80" />
      <img src="/assets/banner.jpg" alt="Banner Repeat" className="h-full w-full object-cover opacity-80" />
    </div>
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 p-4 text-center">
      <h1 className="text-4xl md:text-7xl font-bold text-yellow-400 drop-shadow-lg tracking-widest uppercase">
        GrokMultiverse
      </h1>
      <p className="text-yellow-200 mt-2 text-sm md:text-xl font-semibold">Testnet Live | Farm Points | Secure Airdrop</p>
    </div>
  </div>
);

const TaskCard = ({ title, points, action, isDone, loading }) => (
  <div className={`p-4 border-2 ${isDone ? 'border-green-500 bg-green-900/20' : 'border-yellow-500 bg-gray-900'} rounded-lg flex justify-between items-center mb-4 transition-all hover:scale-[1.02]`}>
    <div>
      <h3 className="font-bold text-lg text-white">{title}</h3>
      <span className="text-yellow-400 text-sm">+{points} Points</span>
    </div>
    <button 
      onClick={action} 
      disabled={isDone || loading}
      className={`px-4 py-2 rounded font-bold transition ${isDone ? 'bg-green-600 text-white cursor-default' : 'bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95'}`}
    >
      {isDone ? "Completed" : (loading ? "..." : "Claim")}
    </button>
  </div>
);

// --- Main Logic ---
const DashboardMain = () => {
  const { wallet, userAccount, initialize, claimTask, loading } = useGrokProgram();
  const [refLink, setRefLink] = useState("");

  useEffect(() => {
    if (wallet && typeof window !== 'undefined') {
      setRefLink(`${window.location.origin}?ref=${wallet.publicKey.toString()}`);
    }
  }, [wallet]);

  const copyToClipboard = (text) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      alert("Referral link copied!");
    }
  };

  const getBadge = (referrals) => {
    const refs = Number(referrals) || 0;
    if (refs >= 50000) return { name: "Diamond", color: "text-blue-400" };
    if (refs >= 10000) return { name: "Gold", color: "text-yellow-400" };
    return { name: "Newbie", color: "text-gray-500" };
  };

  const currentBadge = userAccount ? getBadge(userAccount.totalReferred) : null;

  return (
    <div className="min-h-screen bg-black text-yellow-500">
      <nav className="flex justify-between items-center p-4 bg-gray-900/90 sticky top-0 z-50 border-b border-yellow-600/50">
        <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 rounded-full border-2 border-yellow-500"/>
            <span className="font-black text-xl tracking-tighter hidden sm:block">GROKMULTIVERSE</span>
        </div>
        <div className="flex gap-3 items-center">
            <WalletMultiButton />
        </div>
      </nav>

      <HeroSection />

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {wallet && userAccount && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-900 p-6 rounded-2xl border-2 border-yellow-500/50 text-center">
                    <h3 className="text-gray-400 text-xs uppercase mb-2">My Points</h3>
                    <p className="text-4xl font-black text-yellow-400">{userAccount.points.toString()}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-2xl border-2 border-yellow-500/50 text-center">
                    <h3 className="text-gray-400 text-xs uppercase mb-2">Referrals</h3>
                    <p className="text-4xl font-black text-yellow-400">{userAccount.totalReferred.toString()}</p>
                    <span className={`text-xs font-bold ${currentBadge?.color}`}>{currentBadge?.name}</span>
                </div>
                <div className="bg-gray-900 p-6 rounded-2xl border-2 border-yellow-500/50 flex flex-col justify-center">
                   <p className="text-[10px] text-gray-400 mb-2 uppercase">Invite & Earn</p>
                   <div className="bg-black p-2 text-[10px] text-yellow-200 break-all rounded border border-gray-800 cursor-pointer" onClick={() => copyToClipboard(refLink)}>
                     {refLink ? `${refLink.slice(0, 30)}...` : "Loading..."}
                   </div>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
                <div className="bg-gray-900/40 p-8 rounded-3xl border border-gray-800">
                    <h2 className="text-2xl font-black text-yellow-400 mb-4">The Multiverse Awaits</h2>
                    <p className="text-gray-300 text-sm">Join the elite NFT ecosystem on Solana. Farm points, complete tasks, and climb the ranks for the upcoming airdrop.</p>
                </div>
            </div>

            <div className="lg:col-span-5">
                <div className="bg-gray-900 border-2 border-yellow-500 p-6 rounded-3xl">
                    <h2 className="text-2xl font-black mb-6 italic text-center">TASK CENTER</h2>
                    {!wallet ? (
                        <div className="text-center py-6">
                            <WalletMultiButton />
                        </div>
                    ) : !userAccount ? (
                        <div className="text-center">
                            <button onClick={initialize} disabled={loading} className="bg-yellow-500 text-black font-black px-8 py-4 rounded-full w-full">
                                {loading ? "INITIALIZING..." : "INITIALIZE ID (+200 PTS)"}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <TaskCard title="Follow X" points="100" isDone={userAccount.xFollowed} loading={loading} action={() => {window.open(SOCIALS.x, '_blank'); setTimeout(() => claimTask('x'), 5000)}} />
                            <TaskCard title="Join Telegram" points="100" isDone={userAccount.tgJoined} loading={loading} action={() => {window.open(SOCIALS.tg, '_blank'); setTimeout(() => claimTask('tg'), 5000)}} />
                        </div>
                    )}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default function DashboardContent() {
  return (
    <WalletContextProvider>
      <DashboardMain />
    </WalletContextProvider>
  );
  }
  
