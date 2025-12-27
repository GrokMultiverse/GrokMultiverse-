"use client";
import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { PhaseConfig, SOCIALS } from "../utils/PhaseConfig";
import { useGrokProgram } from "../hooks/useGrokProgram";

// Wallet Button Dynamic Loading - keeping SSR false as before
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

// --- Sub Component: Scrolling Banner (Fixed) ---
const ScrollingBanner = () => (
  <div className="relative w-full h-10 bg-yellow-500 overflow-hidden flex items-center border-y border-yellow-600 shadow-lg">
    <div className="whitespace-nowrap flex animate-marquee text-black font-extrabold text-[10px] md:text-xs uppercase tracking-[0.2em]">
      <span className="mx-8">🚀 GROKMULTIVERSE TESTNET IS LIVE</span>
      <span className="mx-8">💎 FARM POINTS FOR AIRDROP</span>
      <span className="mx-8">🔥 PHASE 2: NFT MINTING COMING SOON</span>
      <span className="mx-8">🚀 GROKMULTIVERSE TESTNET IS LIVE</span>
      <span className="mx-8">💎 FARM POINTS FOR AIRDROP</span>
      <span className="mx-8">🔥 PHASE 2: NFT MINTING COMING SOON</span>
    </div>
  </div>
);

// --- Sub Component: Task Card (No changes in logic) ---
const TaskCard = ({ title, points, action, isDone, loading }) => (
  <div className={`p-4 border-2 ${isDone ? 'border-green-500 bg-green-900/10' : 'border-yellow-500/30 bg-gray-900/80'} rounded-2xl flex justify-between items-center mb-4 transition-all hover:scale-[1.01]`}>
    <div>
      <h3 className="font-bold text-sm text-white">{title}</h3>
      <span className="text-yellow-400 text-[10px] font-mono">+{points} PTS</span>
    </div>
    <button 
      onClick={action} 
      disabled={isDone || loading}
      className={`px-4 py-2 rounded-xl text-xs font-black transition ${isDone ? 'bg-green-600 text-white shadow-inner' : 'bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95'}`}
    >
      {isDone ? "DONE" : (loading ? "..." : "CLAIM")}
    </button>
  </div>
);

// --- Sub Component: Syncing Leaderboard (Fix for False data) ---
const Leaderboard = () => (
  <div className="mt-8 p-6 border border-yellow-500/20 rounded-3xl bg-gray-900/30 backdrop-blur-sm">
    <h2 className="text-xl font-black text-yellow-400 mb-4 border-b border-yellow-500/10 pb-2 flex items-center gap-2 italic uppercase">
      🏆 TOP FARMERS
    </h2>
    <div className="text-center py-6 border-2 border-dashed border-gray-800 rounded-2xl">
       <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
       <p className="text-gray-400 text-[10px] italic tracking-widest uppercase">Syncing Leaderboard Data...</p>
       <p className="text-[9px] text-gray-600 mt-2 italic">*Real-time ranking unlocks in Phase 2*</p>
    </div>
  </div>
);

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
      alert("Referral Link Copied!");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-yellow-500 font-sans pb-10 selection:bg-yellow-500/20">
      {/* Navbar - Fixed Position */}
      <nav className="flex justify-between items-center p-4 bg-black/80 sticky top-0 z-50 border-b border-yellow-500/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-black text-xs shadow-[0_0_15px_rgba(255,215,0,0.3)]">G</div>
            <span className="font-black text-sm tracking-tighter uppercase italic">GROKMULTIVERSE</span>
        </div>
        <WalletMultiButton />
      </nav>

      <ScrollingBanner />

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {/* Stats Grid - Kept Original Logic */}
        {wallet && userAccount && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-900/50 p-4 rounded-2xl border border-yellow-500/20 shadow-xl text-center">
                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-1">My Points</p>
                    <p className="text-3xl font-black text-yellow-400">{userAccount.points.toString()}</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-2xl border border-yellow-500/20 shadow-xl text-center">
                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-1">Referrals</p>
                    <p className="text-3xl font-black text-yellow-400">{userAccount.totalReferred.toString()}</p>
                </div>
                <div className="col-span-2 md:col-span-1 bg-gray-900/50 p-4 rounded-2xl border border-yellow-500/20">
                   <p className="text-[9px] text-gray-500 mb-1 font-bold uppercase tracking-widest">Share Link (Earn +50)</p>
                   <div className="bg-black p-2 text-[9px] text-yellow-200 break-all rounded border border-gray-800 cursor-pointer overflow-hidden font-mono shadow-inner" onClick={() => copyToClipboard(refLink)}>
                     {refLink ? `${refLink.slice(0, 30)}...` : "Loading Link..."}
                   </div>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                {/* About Section - Fixed Text (No AI) */}
                <section className="bg-gray-900/30 p-8 rounded-[2.5rem] border border-gray-800 shadow-inner">
                    <h2 className="text-2xl font-black text-yellow-400 mb-4 italic">THE MULTIVERSE AWAITS</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                       GrokMultiverse is an elite NFT ecosystem bridging high-frequency trading innovation and blockchain technology. 
                       Participate in our Testnet phase, farm points through social tasks, and climb the tiers from Bronze to Diamond. 
                       Your points are your gateway to the upcoming Airdrop.
                    </p>
                </section>

                {/* Faucet Section - New Improvement */}
                <div className="p-8 bg-blue-900/10 border border-blue-500/30 rounded-[2.5rem] shadow-xl">
                    <h3 className="text-blue-400 font-black text-sm mb-3 italic uppercase tracking-wider">Official Solana Faucet</h3>
                    <p className="text-gray-500 text-[11px] mb-5 leading-relaxed">
                       To claim tasks, you need Devnet SOL (Transaction Fee). Visit the official Solana faucet to fund your wallet for free.
                    </p>
                    <a href="https://faucet.solana.com/" target="_blank" rel="noreferrer" className="inline-block w-full text-center bg-blue-600 text-white text-[11px] py-4 rounded-2xl font-black hover:bg-blue-500 transition shadow-lg shadow-blue-900/20 active:scale-95 uppercase tracking-tighter">
                        GET FREE DEVNET SOL
                    </a>
                </div>
            </div>

            {/* Task Center - Original Logic Protected */}
            <div>
                <div className="bg-gray-900 border-2 border-yellow-500 p-8 rounded-[2.5rem] shadow-2xl shadow-yellow-500/5">
                    <h2 className="text-xl font-black mb-6 italic tracking-[0.2em] text-center border-b border-yellow-500/10 pb-4 uppercase">TASK CENTER</h2>
                    
                    {!wallet ? (
                        <div className="text-center py-10">
                            <p className="text-gray-600 text-[10px] mb-6 uppercase tracking-widest font-bold animate-pulse">Connect wallet to begin farming</p>
                            <WalletMultiButton />
                        </div>
                    ) : !userAccount ? (
                        <div className="text-center py-10">
                            <button onClick={initialize} disabled={loading} className="bg-yellow-500 text-black font-black px-10 py-5 rounded-2xl w-full shadow-lg shadow-yellow-500/20 active:scale-95 transition tracking-widest uppercase text-xs">
                                {loading ? "PROCESSING..." : "INITIALIZE ACCOUNT (+200)"}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
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
                                title="Join Telegram Group" 
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
                
                <Leaderboard />
            </div>
        </div>
      </main>
      
      <footer className="mt-20 text-center text-[9px] text-gray-700 uppercase tracking-[0.3em] font-bold">
        © 2025 GrokMultiverse | Secure Blockchain Trading
      </footer>
    </div>
  );
};

export default function DashboardContent() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <DashboardMain />
    </Suspense>
  );
  }
        
