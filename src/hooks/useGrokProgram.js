import { useEffect, useState, useCallback } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "../utils/idl.json";
import { useSearchParams } from 'next/navigation';

const PROGRAM_ID = new PublicKey("DzsNMUqVhpyj6rznbph4jjDKTshPaKdWVHYHDBETYgXE");

export const useGrokProgram = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const searchParams = useSearchParams();
  const [program, setProgram] = useState(null);
  const [userAccount, setUserAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize Provider and Program
  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
      const prog = new Program(idl, PROGRAM_ID, provider);
      setProgram(prog);
      fetchUserAccount(prog, wallet.publicKey);
    }
  }, [wallet, connection]);

  // Fetch On-Chain User Data
  const fetchUserAccount = async (prog, pubkey) => {
    try {
      const [userStatsPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("user-stats"), pubkey.toBuffer()],
        PROGRAM_ID
      );
      const account = await prog.account.userAccount.fetch(userStatsPDA);
      setUserAccount(account);
    } catch (e) {
      console.log("User account not found on-chain.");
      setUserAccount(null);
    }
  };

  // Initialize Account + Handle Referral
  const initialize = async () => {
    if (!program || !wallet) return;
    setLoading(true);
    try {
      const [userStatsPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("user-stats"), wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      // Check for referral in URL
      const referrerString = searchParams.get('ref');
      let referrerPubkey = wallet.publicKey; // Default to self if no referral

      if (referrerString) {
        try {
          referrerPubkey = new PublicKey(referrerString);
        } catch (err) {
          console.error("Invalid Referral Pubkey");
        }
      }

      const tx = await program.methods.initializeAccount()
        .accounts({
          userStats: userStatsPDA,
          user: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      
      console.log("Init TX:", tx);

      // If there's a referrer and it's not the user themselves, process referral
      if (referrerString && referrerString !== wallet.publicKey.toString()) {
        const [referrerStatsPDA] = await PublicKey.findProgramAddress(
            [Buffer.from("user-stats"), referrerPubkey.toBuffer()],
            PROGRAM_ID
        );
        
        await program.methods.processReferral()
            .accounts({
                referrerStats: referrerStatsPDA,
                referrer: referrerPubkey,
                user: wallet.publicKey,
            }).rpc();
      }

      await fetchUserAccount(program, wallet.publicKey);
      alert("Multiverse ID Initialized!");
    } catch (error) {
      console.error("Transaction Error:", error);
      alert("Failed! Ensure you have Devnet SOL.");
    }
    setLoading(false);
  };

  // Claim Social Task Points
  const claimTask = async (taskType) => {
    if (!program || !wallet) return;
    setLoading(true);
    try {
      const [userStatsPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("user-stats"), wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      if (taskType === 'x') {
        await program.methods.claimXPoints().accounts({
          userStats: userStatsPDA,
          user: wallet.publicKey
        }).rpc();
      } else if (taskType === 'tg') {
        await program.methods.claimTgPoints().accounts({
          userStats: userStatsPDA,
          user: wallet.publicKey
        }).rpc();
      }
      
      await fetchUserAccount(program, wallet.publicKey);
      alert("Reward Claimed on Solana Devnet!");
    } catch (error) {
      console.error("Task Error:", error);
      alert("Error: You may have already claimed this or transaction failed.");
    }
    setLoading(false);
  };

  return { wallet, userAccount, initialize, claimTask, loading, PROGRAM_ID };
};
          
