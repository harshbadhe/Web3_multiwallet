'use client'
import {
  useAccount, useConnect, useDisconnect,
  useSwitchChain, useSendTransaction, useSignMessage,
} from 'wagmi'
import { parseEther } from 'viem'
import { useState, useEffect } from 'react'
import { mainnet, sepolia, polygon } from 'wagmi/chains'

export default function Home() {
  const { address, isConnected, chain } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { sendTransaction, data: txHash, isPending: txPending } = useSendTransaction()
  const { signMessage, data: signature, isPending: signPending } = useSignMessage()

  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const chains = [mainnet, sepolia, polygon]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white p-6 md:p-12 font-sans selection:bg-purple-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 pt-10 pb-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Web3 Multiwallet
          </h1>
          <p className="text-gray-400 text-lg">Connect, transact, and sign securely.</p>
        </div>

        {/* Connect Wallets Card */}
        <section className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 hover:border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Wallet Connection
            </h2>
            <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          </div>

          {!isConnected ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {connectors.map((connector) => {
                let displayName = connector.name;
                if (displayName === 'Injected') displayName = 'MetaMask / Browser';
                
                return (
                  <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                  >
                    <span className="text-blue-400">⚡</span> {displayName}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-black/30 rounded-xl border border-white/5">
              <div className="space-y-1 text-center md:text-left">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Active Account</p>
                <p className="font-mono text-sm md:text-base text-gray-200 bg-white/5 px-3 py-1 rounded-md border border-white/10">
                  {address}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                  <span className="text-xs text-gray-400">Network:</span>
                  <span className="text-sm font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                    {chain?.name || 'Unknown'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => disconnect()}
                className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-semibold transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                 Disconnect
              </button>
            </div>
          )}
        </section>

        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-8">
              {/* Switch Chain */}
              <section className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 hover:border-white/20">
                <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Networks
                </h2>
                <div className="flex flex-col gap-3">
                  {chains.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => switchChain({ chainId: c.id })}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all flex justify-between items-center ${
                        chain?.id === c.id
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 text-green-300'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300'
                      }`}
                    >
                      {c.name}
                      {chain?.id === c.id && <span className="text-xs bg-green-500 text-black px-2 py-1 rounded-full">Active</span>}
                    </button>
                  ))}
                </div>
              </section>

              {/* Sign Message */}
              <section className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 hover:border-white/20">
                <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Sign Message
                </h2>
                <div className="flex flex-col gap-4">
                  <textarea
                    placeholder="Enter a message to sign..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="px-4 py-3 bg-black/40 border border-white/10 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 rounded-xl text-sm outline-none resize-none h-24 transition-all"
                  />
                  <button
                    onClick={() => signMessage({ message })}
                    disabled={signPending || !message}
                    className="px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-400 rounded-xl font-bold transition-all shadow-lg hover:shadow-orange-500/25 active:scale-95"
                  >
                    {signPending ? 'Signing Protocol...' : 'Sign Data ✍️'}
                  </button>
                  {signature && (
                    <div className="p-3 bg-black/30 border border-white/5 rounded-lg mt-2">
                       <p className="text-xs text-gray-500 mb-1">Signature Hash</p>
                       <p className="text-xs text-yellow-400 font-mono break-all">{signature}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Send Transaction */}
              <section className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 hover:border-white/20 h-full">
                <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Send Funds
                </h2>
                <div className="flex flex-col gap-5">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider ml-1">Recipient Address</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={toAddress}
                      onChange={(e) => setToAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 rounded-xl font-mono text-sm outline-none transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider ml-1">Amount (ETH/MATIC)</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 rounded-xl text-sm outline-none transition-all pr-12"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                        {chain?.nativeCurrency?.symbol || 'ETH'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      sendTransaction({
                        to: toAddress as `0x${string}`,
                        value: parseEther(amount || '0'),
                      })
                    }
                    disabled={txPending || !toAddress || !amount}
                    className="mt-2 px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-400 rounded-xl font-bold transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95 text-lg"
                  >
                    {txPending ? 'Confirming Tx...' : 'Send Transaction 💸'}
                  </button>
                  
                  {txHash && (
                    <div className="p-3 bg-black/30 border border-white/5 rounded-lg mt-2">
                       <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                       <p className="text-xs text-purple-400 font-mono break-all">{txHash}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
