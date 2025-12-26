"use client";
import { Suspense, useEffect, useState } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import WalletContextProvider from "../components/WalletContextProvider";
import { useGrokProgram } from "../hooks/useGrokProgram";
import { PhaseConfig, SOCIALS } from "../utils/PhaseConfig";
import { useSearchParams } from 'next/navigation';

// --- Sub Components ---

// 1. Hero Section with Movable Banner
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

// 2. Task Card Component
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

// 3. Leaderboard Component
const Leaderboard = () => (
  <div className="mt-8 p-6 border border-yellow-500/30 rounded-xl bg-gray-900/50 backdrop-blur-sm">
    <h2 className="text-2xl font-bold text-yellow-400 mb-4 border-b border-yellow-500/50 pb-2 flex items-center gap-2">
      🏆 Points Leaderboard
    </h2>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-300">
        <thead>
          <tr className="text-yellow-500 uppercase border-b border-gray-800">
            <th className="py-3">Rank</th>
            <th>User Wallet</th>
            <th className="text-right">Points</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          <tr className="hover:bg-yellow-500/5 transition">
            <td className="py-3">🥇 1</td>
            <td className="font-mono text-xs">DzsN...ETYg</td>
            <td className="text-right text-yellow-400 font-bold">125,400</td>
          </tr>
          <tr className="hover:bg-yellow-500/5 transition">
            <td className="py-3">🥈 2</td>
            <td className="font-mono text-xs">8xPq...mN2v</td>
            <td className="text-right text-yellow-400 font-bold">98,200</td>
          </tr>
          <tr className="hover:bg-yellow-500/5 transition">
            <td className="py-3">🥉 3</td>
            <td className="font-mono text-xs">4fHk...R5tY</td>
            <td className="text-right text-yellow-400 font-bold">75,000</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="text-[10px] text-gray-500 mt-4 text-center italic">*Leaderboard updates every 24 hours from smart contract*</p>
  </div>
);

// --- Main Dashboard Logic ---

function DashboardContent() {
  const { wallet, userAccount, initialize, claimTask, loading } = useGrokProgram();
  const searchParams = useSearchParams();
  const [refLink, setRefLink] = useState("");

  useEffect(() => {
    if (wallet && typeof window !== 'undefined') {
      // Create refer link with full wallet address
      setRefLink(`${window.location.origin}?ref=${wallet.publicKey.toString()}`);
    }
  }, [wallet]);

  const copyToClipboard = (text) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      alert("Referral link copied to clipboard!");
    }
  };

  // Badge Logic Based on Referrals
  const getBadge = (referrals) => {
    const refs = Number(referrals) || 0;
    if (refs >= 50000) return { name: "💎 Diamond", color: "text-blue-400" };
    if (refs >= 10000) return { name: "🥇 Gold", color: "text-yellow-400" };
    if (refs >= 1000) return { name: "🥈 Silver", color: "text-gray-300" };
    if (refs >= 500) return { name: "🥉 Bronze", color: "text-orange-400" };
    return { name: "Newbie", color: "text-gray-500" };
  };

  const currentBadge = userAccount ? getBadge(userAccount.totalReferred) : null;

  return (
    <div className="min-h-screen bg-black text-yellow-500 selection:bg-yellow-500 selection:text-black">
      {/* Header */}
      <nav className="flex justify-between items-center p-4 bg-gray-900/90 sticky top-0 z-50 border-b border-yellow-600/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Grok logo" className="w-10 h-10 rounded-full border-2 border-yellow-500 shadow-[0_0_10px_rgba(255,215,0,0.5)]"/>
            <span className="font-black text-xl tracking-tighter hidden sm:block">GROKMULTIVERSE</span>
        </div>
        <div className="flex gap-3 items-center">
            <a href={SOCIALS.x} target="_blank" rel="noreferrer" className="p-2 hover:bg-gray-800 rounded-full transition">𝕏</a>
            <a href={SOCIALS.tg} target="_blank" rel="noreferrer" className="p-2 hover:bg-gray-800 rounded-full transition">✈️</a>
            <WalletMultiButton />
        </div>
      </nav>

      <HeroSection />

      <main className="max-w-5xl mx-auto px-4 mt-8">
        
        {/* User Stats Display */}
        {wallet && userAccount && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-900 p-6 rounded-2xl border-2 border-yellow-500/50 text-center shadow-xl">
                    <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2">My Points</h3>
                    <p className="text-4xl font-black text-yellow-400">{userAccount.points.toString()}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-2xl border-2 border-yellow-500/50 text-center shadow-xl">
                    <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2">My Referrals</h3>
                    <p className="text-4xl font-black text-yellow-400">{userAccount.totalReferred.toString()}</p>
                    <span className={`text-xs font-bold px-3 py-1 bg-black rounded-full border border-gray-700 mt-2 inline-block ${currentBadge?.color}`}>
                        {currentBadge?.name} Badge
                    </span>
                </div>
                <div className="bg-gray-900 p-6 rounded-2xl border-2 border-yellow-500/50 shadow-xl flex flex-col justify-center">
                   <p className="text-xs text-gray-400 mb-2 font-bold uppercase">Invite & Earn (50 pts)</p>
                   <div 
                     className="bg-black p-3 text-[10px] text-yellow-200 break-all rounded-lg border border-gray-800 cursor-pointer hover:border-yellow-500 transition relative group"
                     onClick={() => copyToClipboard(refLink)}>
                     {refLink ? `${refLink.slice(0, 35)}...` : "Generating link..."}
                     <span className="absolute right-2 bottom-1 text-[8px] text-gray-500 uppercase">Click to Copy</span>
                   </div>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: About & Status */}
            <div className="lg:col-span-7 space-y-6">
                <section className="bg-gray-900/40 p-8 rounded-3xl border border-gray-800 shadow-inner">
                    <h2 className="text-3xl font-black text-yellow-400 mb-4">The Multiverse Awaits</h2>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                       GrokMultiverse is an elite NFT ecosystem bridging AI innovation and blockchain high-frequency trading. 
                       Participate in our Testnet phase, farm points through social tasks, and climb the tiers from Bronze to Diamond. 
                       Your points are your gateway to the upcoming Airdrop.
                    </p>
                </section>

                <div className="bg-gray-900/40 p-8 rounded-3xl border border-gray-800">
                    <h2 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
                        🚀 Project Roadmap (Phase 1-6)
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-green-400 font-bold bg-green-950/20 p-3 rounded-xl border border-green-900/50">
                            <span className="bg-green-500 text-black w-6 h-6 flex items-center justify-center rounded-full text-[10px]">1</span>
                            Points Farming Live (Devnet)
                        </div>
                        <div className={`flex items-center gap-4 p-3 rounded-xl border ${PhaseConfig.isTestnetNftMintComing ? 'text-yellow-200 border-yellow-500/50 animate-pulse' : 'text-gray-600 border-gray-900'}`}>
                            <span className="bg-gray-800 text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px]">2</span>
                            Testnet NFT Mint (Coming Soon)
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-900 text-gray-600">
                            <span className="bg-gray-800 text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px]">3</span>
                            Mainnet NFT Launch 🔒
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-900 text-gray-600">
                            <span className="bg-gray-800 text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px]">4</span>
                            Magic Eden NFT Trading 🔒
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-900 text-gray-600">
                            <span className="bg-gray-800 text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px]">5</span>
                            Tokenomics & Ticker Launch 🔒
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Tasks & Leaderboard */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-gray-900 border-2 border-yellow-500 p-6 rounded-3xl shadow-[0_10px_30px_rgba(255,215,0,0.1)]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black italic">TASK CENTER</h2>
                        <a href={SOCIALS.faucet} target="_blank" rel="noreferrer" className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-1 rounded border border-blue-800 hover:bg-blue-800 hover:text-white transition">Get Test SOL</a>
                    </div>

                    {!wallet ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-2xl">
                            <p className="text-gray-500 text-xs mb-4 uppercase tracking-tighter">Connect your Phantom or Solflare</p>
                            <WalletMultiButton />
                        </div>
                    ) : !userAccount ? (
                        <div className="text-center py-12 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
                            <p className="text-yellow-100 text-sm mb-6">Initialize your Multiverse ID to start farming</p>
                            <button 
                                onClick={initialize} 
                                disabled={loading} 
                                className="bg-yellow-500 text-black font-black px-8 py-4 rounded-full hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 transition-all active:scale-95"
                            >
                                {loading ? "INITIALIZING..." : "START FARMING (+200 PTS)"}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <TaskCard 
                                title="Follow Official X" 
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
                            <div className="p-4 bg-black/40 rounded-xl border border-gray-800 mt-6">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Referral Bonus</h4>
                                <p className="text-[11px] text-gray-400 italic">Verify referrals via Smart Contract. Points added automatically upon invitee initialization.</p>
                            </div>
                        </div>
                    )}
                </div>
                
                <Leaderboard />
            </div>
        </div>
      </main>

      {/* Mobile Footer Spacing */}
      <footer className="h-20 flex items-center justify-center text-[10px] text-gray-700 uppercase tracking-[0.2em]">
        © 2025 GrokMultiverse Ecosystem | Built on Solana Devnet
      </footer>
    </div>
  );
}

// Global Wrapper with Suspense Boundary for Client-Side Features
export default function Page() {
  return (
    <WalletContextProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-black flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-yellow-500 font-mono text-xs animate-pulse tracking-widest uppercase">Initializing Multiverse...</p>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </WalletContextProvider>
  );
  }
  
