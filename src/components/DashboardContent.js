"use client";
import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { PhaseConfig, SOCIALS } from "../utils/PhaseConfig";
import { useGrokProgram } from "../hooks/useGrokProgram";

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

// --- 1. Detail Hero Section with Logo & Banner Logic ---
const HeroSection = () => (
  <div className="relative w-full h-[320px] overflow-hidden border-b-4 border-yellow-500 bg-gray-900 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
    <div className="absolute inset-0 flex items-center animate-marquee">
      <img src="/assets/banner.jpg" alt="Banner" className="h-full min-w-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" />
      <img src="/assets/banner.jpg" alt="Banner Repeat" className="h-full min-w-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" />
    </div>
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black via-transparent to-black/60 z-10 p-4">
      <div className="relative group">
        <div className="absolute -inset-1 bg-yellow-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000"></div>
        <img src="/assets/logo.png" alt="Grok logo" className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-yellow-500 shadow-2xl mb-6 animate-pulse"/>
      </div>
      <h1 className="text-5xl md:text-8xl font-black text-yellow-400 drop-shadow-[0_5px_15px_rgba(0,0,0,1)] tracking-tighter uppercase italic">
        GrokMultiverse
      </h1>
      <div className="mt-4 flex gap-2">
        <span className="bg-yellow-500 text-black px-3 py-1 text-[10px] font-black uppercase rounded-sm">Testnet Phase 1</span>
        <span className="bg-white/10 text-white px-3 py-1 text-[10px] font-black uppercase rounded-sm backdrop-blur-md">Secure Ecosystem</span>
      </div>
    </div>
  </div>
);

// --- 2. Detailed 6-Phase Roadmap Section ---
const Roadmap = () => (
  <div className="bg-[#0f0f0f] p-8 rounded-[2rem] border border-yellow-500/10 mt-10 relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-all"></div>
    <h2 className="text-2xl font-black text-yellow-400 mb-8 flex items-center gap-3 italic uppercase tracking-widest">
      <span className="w-8 h-[2px] bg-yellow-500"></span> Roadmap Expansion
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
      {[
        { p: 1, t: "Points Farming Live (Devnet)", d: "Initialize ID and complete social tasks to earn rewards.", s: "active" },
        { p: 2, t: "Testnet NFT Minting", d: "Early adopters get exclusive access to mint free test NFTs.", s: "soon" },
        { p: 3, t: "Mainnet Infrastructure", d: "Migrating ecosystem to Solana Mainnet with high security.", s: "locked" },
        { p: 4, t: "Magic Eden Listing", d: "Trading starts on major marketplaces for Grok Multiverse NFTs.", s: "locked" },
        { p: 5, t: "Ticker & Token Launch", s: "locked", d: "Launching the native utility token for the ecosystem." },
        { p: 6, t: "The Multiverse Genesis", s: "locked", d: "Full scale high-frequency trading and NFT expansion." }
      ].map((item) => (
        <div key={item.p} className={`p-5 rounded-2xl border-2 transition-all duration-500 ${item.s === 'active' ? 'border-green-500 bg-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : item.s === 'soon' ? 'border-yellow-500 bg-yellow-500/5 animate-pulse' : 'border-gray-800 bg-gray-900/20 text-gray-600 opacity-60'}`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${item.s === 'active' ? 'bg-green-500 text-black' : 'bg-gray-800 text-white'}`}>PHASE 0{item.p}</span>
            {item.s === 'locked' && <span>🔒</span>}
          </div>
          <h3 className={`font-black text-sm uppercase ${item.s === 'active' ? 'text-white' : item.s === 'soon' ? 'text-yellow-400' : 'text-gray-500'}`}>{item.t}</h3>
          <p className="text-[10px] mt-1 text-gray-400 leading-tight">{item.d}</p>
        </div>
      ))}
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
      alert("Referral Link Copied to Clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-yellow-500 font-sans selection:bg-yellow-500 selection:text-black">
      {/* Header with detailed Social Icons */}
      <nav className="flex justify-between items-center px-6 py-4 bg-black/90 sticky top-0 z-[100] border-b border-yellow-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-4">
            <img src="/assets/logo.png" alt="Logo" className="w-12 h-12 rounded-full border-2 border-yellow-500 shadow-[0_0_10px_rgba(255,215,0,0.2)]"/>
            <div className="hidden sm:block">
               <span className="font-black text-2xl tracking-tighter block leading-none">GROKMULTIVERSE</span>
               <span className="text-[8px] uppercase tracking-[0.4em] text-gray-500">Secure Blockchain Network</span>
            </div>
        </div>
        <div className="flex gap-6 items-center">
            <div className="flex gap-4 border-r border-gray-800 pr-6 mr-2">
               <a href={SOCIALS.x} target="_blank" rel="noreferrer" className="hover:text-white transition-all transform hover:scale-125">
                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
               </a>
               <a href={SOCIALS.tg} target="_blank" rel="noreferrer" className="hover:text-white transition-all transform hover:scale-125">
                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
               </a>
            </div>
            <WalletMultiButton />
        </div>
      </nav>

      <HeroSection />

      <main className="max-w-7xl mx-auto px-6 mt-12 mb-20">
        {/* Statistics Grid */}
        {wallet && userAccount && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-[#0a0a0a] p-8 rounded-3xl border-2 border-yellow-500/20 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 group-hover:w-2 transition-all"></div>
              <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-4">Total G-Points</h3>
              <p className="text-5xl font-black text-yellow-400 drop-shadow-lg">{userAccount.points.toString()}</p>
            </div>
            <div className="bg-[#0a0a0a] p-8 rounded-3xl border-2 border-yellow-500/20 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 group-hover:w-2 transition-all"></div>
              <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-4">Network Referrals</h3>
              <p className="text-5xl font-black text-yellow-400 drop-shadow-lg">{userAccount.totalReferred.toString()}</p>
            </div>
            <div className="bg-[#0a0a0a] p-8 rounded-3xl border-2 border-yellow-500/20 shadow-2xl flex flex-col justify-center">
              <h3 className="text-[10px] text-yellow-500/50 mb-3 font-black uppercase italic tracking-[0.2em]">Referral Gateway (Earn 50 Pts)</h3>
              <div className="bg-black/50 p-4 text-[10px] text-yellow-100 break-all rounded-xl border border-gray-800 font-mono cursor-copy active:scale-95 transition" onClick={() => copyToClipboard(refLink)}>
                {refLink ? refLink : "Connect wallet to see link..."}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Content: About & Roadmap */}
            <div className="lg:col-span-7">
                <section className="bg-gray-900/20 p-10 rounded-[2.5rem] border border-gray-800 shadow-inner">
                    <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">The Multiverse <span className="text-yellow-500 italic">Ecosystem</span></h2>
                    <p className="text-gray-400 leading-relaxed text-base md:text-lg">
                       GrokMultiverse is an elite NFT ecosystem bridging high-frequency trading innovation and blockchain technology. 
                       Participate in our Testnet phase, farm points through social tasks, and climb the tiers from Bronze to Diamond. 
                       Your accumulated points are your verified gateway to the upcoming exclusive Airdrop.
                    </p>
                </section>
                <Roadmap />
            </div>

            {/* Right Content: Task Center & Faucet */}
            <div className="lg:col-span-5">
                <div className="bg-gray-900 border-t-4 border-yellow-500 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <h2 className="text-3xl font-black mb-8 italic text-center tracking-widest text-yellow-500 uppercase">Task Center</h2>
                    
                    {/* Solana Faucet Integration */}
                    <div className="mb-8 p-6 bg-blue-600/5 border-2 border-blue-500/20 rounded-2xl">
                        <h4 className="text-blue-400 font-black text-sm mb-2 uppercase italic tracking-wider">Official Solana Faucet</h4>
                        <p className="text-gray-500 text-xs mb-4">Claim free Testnet SOL to execute on-chain reward claims.</p>
                        <a href="https://faucet.solana.com/" target="_blank" rel="noreferrer" className="block text-center bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 uppercase text-xs">
                          Request Devnet SOL 
                        </a>
                    </div>

                    {!wallet ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-[2rem]">
                            <p className="text-gray-600 text-[10px] uppercase font-bold mb-6 tracking-[0.3em]">Authentication Required</p>
                            <WalletMultiButton />
                        </div>
                    ) : !userAccount ? (
                        <div className="text-center py-6">
                            <button onClick={initialize} disabled={loading} className="w-full bg-yellow-500 text-black font-black py-5 rounded-2xl hover:bg-yellow-400 shadow-[0_10px_20px_rgba(255,215,0,0.2)] active:scale-95 transition-all text-sm uppercase tracking-widest">
                                {loading ? "TRANSACTING..." : "INITIALIZE MULTIVERSE ID (+200)"}
                            </button>
                            <p className="mt-4 text-[9px] text-gray-600 font-bold uppercase italic">Initialisation requires ~0.002 Devnet SOL</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Detailed Task Items */}
                            <div className="p-5 border-2 border-yellow-500/10 bg-black/40 rounded-2xl flex justify-between items-center group hover:border-yellow-500/40 transition-all">
                                <div>
                                    <h3 className="font-black text-white text-sm uppercase italic">Follow Official 𝕏</h3>
                                    <span className="text-yellow-500 text-[10px] font-bold tracking-widest">+100 G-POINTS</span>
                                </div>
                                <button onClick={() => {window.open(SOCIALS.x, '_blank'); setTimeout(() => claimTask('x'), 5000)}} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${userAccount.xFollowed ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black hover:scale-105 shadow-lg shadow-yellow-500/20'}`}>
                                    {userAccount.xFollowed ? "VERIFIED" : "CLAIM"}
                                </button>
                            </div>
                            
                            <div className="p-5 border-2 border-yellow-500/10 bg-black/40 rounded-2xl flex justify-between items-center group hover:border-yellow-500/40 transition-all">
                                <div>
                                    <h3 className="font-black text-white text-sm uppercase italic">Join Telegram Hub</h3>
                                    <span className="text-yellow-500 text-[10px] font-bold tracking-widest">+100 G-POINTS</span>
                                </div>
                                <button onClick={() => {window.open(SOCIALS.tg, '_blank'); setTimeout(() => claimTask('tg'), 5000)}} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${userAccount.tgJoined ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black hover:scale-105 shadow-lg shadow-yellow-500/20'}`}>
                                    {userAccount.tgJoined ? "VERIFIED" : "CLAIM"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Real-time Syncing Footer */}
                <div className="mt-8 p-6 bg-gray-900/20 border border-gray-800 rounded-3xl text-center">
                   <div className="flex justify-center gap-1 mb-3">
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
                      <span className="text-[9px] text-green-500 font-black uppercase tracking-widest">Network Synchronized</span>
                   </div>
                   <p className="text-[10px] text-gray-500 italic">Leaderboard and Tier Ranking data is being verified via Solana Devnet. Global rankings unlock in Phase 2.</p>
                </div>
            </div>
        </div>
      </main>

      <footer className="border-t border-gray-900 py-10 text-center">
        <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.5em]">
            © 2025 GrokMultiverse Genesis | Powering Blockchain Futures
        </p>
      </footer>
    </div>
  );
};

export default function DashboardContent() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-yellow-500">BOOTING MULTIVERSE...</div>}>
      <DashboardMain />
    </Suspense>
  );
  }
  
