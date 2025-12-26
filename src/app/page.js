"use client";
import { Suspense, useEffect, useState } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import WalletContextProvider from "../components/WalletContextProvider";
import { useGrokProgram } from "../hooks/useGrokProgram";
import { PhaseConfig, SOCIALS } from "../utils/PhaseConfig";
import { useSearchParams } from 'next/navigation';

// --- Sub Components ---

const HeroSection = () => (
  <div className="relative w-full h-64 overflow-hidden border-b-4 border-yellow-500 bg-gray-900">
    <div className="absolute inset-0 flex items-center animate-marquee">
      <img src="/assets/banner.jpg" alt="Banner" className="h-full w-full object-cover opacity-80" />
      <img src="/assets/banner.jpg" alt="Banner Repeat" className="h-full w-full object-cover opacity-80" />
    </div>
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10">
      <h1 className="text-5xl md:text-7xl font-bold text-yellow-400 drop-shadow-lg tracking-widest uppercase text-center">
        GrokMultiverse
      </h1>
      <p className="text-yellow-200 mt-2 text-sm md:text-xl">Testnet Live | Farm Points | Earn Rewards</p>
    </div>
  </div>
);

const TaskCard = ({ title, points, action, isDone, loading }) => (
  <div className={`p-4 border-2 ${isDone ? 'border-green-500 bg-green-900/20' : 'border-yellow-500 bg-gray-900'} rounded-lg flex justify-between items-center mb-4`}>
    <div>
      <h3 className="font-bold text-lg text-white">{title}</h3>
      <span className="text-yellow-400 text-sm">+{points} Points</span>
    </div>
    <button 
      onClick={action} 
      disabled={isDone || loading}
      className={`px-4 py-2 rounded font-bold ${isDone ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black hover:bg-yellow-400'}`}
    >
      {isDone ? "Completed" : (loading ? "Processing..." : "Claim")}
    </button>
  </div>
);

// Dashboard Component that uses useSearchParams
function DashboardContent() {
  const { wallet, userAccount, initialize, claimTask, loading } = useGrokProgram();
  const searchParams = useSearchParams();
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
    const refs = Number(referrals);
    if (refs >= 50000) return "💎 Diamond";
    if (refs >= 10000) return "🥇 Gold";
    if (refs >= 1000) return "🥈 Silver";
    if (refs >= 500) return "🥉 Bronze";
    return "Newbie";
  };

  return (
    <div className="min-h-screen pb-20 bg-black text-yellow-500">
      <nav className="flex justify-between items-center p-4 bg-gray-900 border-b border-yellow-600">
        <div className="flex items-center gap-2">
            <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 rounded-full border border-yellow-400"/>
            <span className="font-bold text-xl hidden md:block">GROKMULTIVERSE</span>
        </div>
        <div className="flex gap-4 items-center">
            <a href={SOCIALS.x} target="_blank" rel="noreferrer" className="text-yellow-400 hover:text-white">X</a>
            <a href={SOCIALS.tg} target="_blank" rel="noreferrer" className="text-yellow-400 hover:text-white">TG</a>
            <WalletMultiButton />
        </div>
      </nav>

      <HeroSection />

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {wallet && userAccount && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-800 p-4 rounded border border-yellow-500 text-center">
                    <h3 className="text-gray-400 text-sm">My Points</h3>
                    <p className="text-3xl font-bold text-yellow-400">{userAccount.points.toString()}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded border border-yellow-500 text-center">
                    <h3 className="text-gray-400 text-sm">Referrals</h3>
                    <p className="text-3xl font-bold text-yellow-400">{userAccount.totalReferred.toString()}</p>
                    <span className="text-xs bg-yellow-900 text-yellow-200 px-2 py-1 rounded mt-1 inline-block">
                        {getBadge(userAccount.totalReferred)}
                    </span>
                </div>
                <div className="bg-gray-800 p-4 rounded border border-yellow-500 flex flex-col justify-center">
                   <p className="text-xs text-gray-400 mb-1">Your Referral Link:</p>
                   <code 
                     className="bg-black p-2 text-xs text-yellow-200 break-all rounded cursor-pointer border border-gray-700" 
                     onClick={() => copyToClipboard(refLink)}>
                     {refLink ? `${refLink.slice(0, 25)}...` : "Loading..."} (Copy)
                   </code>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700 mb-6">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-2">About GrokMultiverse</h2>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        GrokMultiverse is a multi-phase ecosystem designed to bridge AI-driven innovation and blockchain trading on Solana.
                    </p>
                </div>

                <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-4">Roadmap Status</h2>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center text-green-400">✓ Phase 1: Points Farming Live</li>
                        <li className={PhaseConfig.isTestnetNftMintComing ? "text-yellow-200 animate-pulse" : "text-gray-500"}>➜ Phase 2: Testnet NFT Mint</li>
                        <li className="text-gray-500">🔒 Phase 3: Mainnet NFT Mint</li>
                    </ul>
                </div>
            </div>

            <div>
                <div className="bg-gray-900 border border-yellow-500 p-6 rounded-xl">
                    <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
                        <span>⚡ Task Center</span>
                        <a href={SOCIALS.faucet} target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline">Faucet</a>
                    </h2>

                    {!wallet ? (
                        <div className="text-center py-10">
                            <WalletMultiButton />
                        </div>
                    ) : !userAccount ? (
                        <div className="text-center py-10">
                            <button onClick={initialize} disabled={loading} className="bg-yellow-500 text-black font-bold px-6 py-3 rounded hover:bg-yellow-400">
                                {loading ? "Creating..." : "Initialize Account (+200)"}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <TaskCard 
                                title="Follow on X" 
                                points="100" 
                                isDone={userAccount.xFollowed} 
                                loading={loading}
                                action={() => {
                                    window.open(SOCIALS.x, '_blank');
                                    setTimeout(() => claimTask('x'), 5000);
                                }}
                            />
                            <TaskCard 
                                title="Join Telegram" 
                                points="100" 
                                isDone={userAccount.tgJoined} 
                                loading={loading}
                                action={() => {
                                    window.open(SOCIALS.tg, '_blank');
                                    setTimeout(() => claimTask('tg'), 5000);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}

// Wrapper with Suspense to fix Prerender Error
export default function Page() {
  return (
    <WalletContextProvider>
      <Suspense fallback={<div className="min-h-screen bg-black text-yellow-500 flex items-center justify-center">Loading GrokMultiverse...</div>}>
        <DashboardContent />
      </Suspense>
    </WalletContextProvider>
  );
  }
  
