import { useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "../utils/idl.json";

const PROGRAM_ID = new PublicKey("DzsNMUqVhpyj6rznbph4jjDKTshPaKdWVHYHDBETYgXE");

export const useGrokProgram = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState(null);
  const [userAccount, setUserAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
      const prog = new Program(idl, PROGRAM_ID, provider);
      setProgram(prog);
      fetchUserAccount(prog, wallet.publicKey);
    }
  }, [wallet, connection]);

  const fetchUserAccount = async (prog, pubkey) => {
    try {
      const [userStatsPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("user-stats"), pubkey.toBuffer()],
        PROGRAM_ID
      );
      const account = await prog.account.userAccount.fetch(userStatsPDA);
      setUserAccount(account);
    } catch (e) {
      console.log("Account not initialized yet");
      setUserAccount(null);
    }
  };

  const initialize = async () => {
    if (!program || !wallet) return;
    setLoading(true);
    try {
      const [userStatsPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("user-stats"), wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );
      
      await program.methods.initializeAccount()
        .accounts({
          userStats: userStatsPDA,
          user: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      
      await fetchUserAccount(program, wallet.publicKey);
    } catch (error) {
      console.error("Init Error:", error);
      alert("Initialization Failed! Check Console.");
    }
    setLoading(false);
  };

  const claimTask = async (taskType) => {
    if (!program || !wallet) return;
    setLoading(true);
    try {
        const [userStatsPDA] = await PublicKey.findProgramAddress(
            [Buffer.from("user-stats"), wallet.publicKey.toBuffer()],
            PROGRAM_ID
        );

        if(taskType === 'x') {
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
        alert("Points Claimed Successfully!");
    } catch (error) {
        console.error("Claim Error:", error);
        alert("Failed to claim points. Maybe already claimed?");
    }
    setLoading(false);
  };

  return { wallet, userAccount, initialize, claimTask, loading, PROGRAM_ID };
};
    
