import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowDownRight, ArrowUpRight, ArrowRightLeft, CheckCircle2, Wallet, Info, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import clsx from 'clsx';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw' | 'transfer';
  wallets: any[];
  onSuccess: () => void;
}

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

export default function TransferModal({ isOpen, onClose, type, wallets, onSuccess }: TransferModalProps) {
  const { token } = useAuthStore();
  const [amount, setAmount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(wallets[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<'input' | 'confirm'>('input');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError('');
      setSuccess(false);
      setIsLoading(false);
      setStep('input');
      if (wallets.length > 0 && !selectedWallet) {
        setSelectedWallet(wallets[0].id);
      }
    }
  }, [isOpen, wallets]);

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
  };

  const handleMaxAmount = () => {
    const wallet = wallets.find(w => w.id === selectedWallet);
    if (wallet && type === 'withdraw') {
      setAmount(wallet.balance.toString());
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    const wallet = wallets.find(w => w.id === selectedWallet);
    if (type === 'withdraw' && wallet && Number(amount) > wallet.balance) {
      setError('Insufficient funds');
      return;
    }
    setError('');
    setStep('confirm');
  };

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          walletId: selectedWallet,
          type,
          amount: type === 'withdraw' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
          currency: wallets.find(w => w.id === selectedWallet)?.currency || 'USD',
          status: 'completed',
          details: `${type.charAt(0).toUpperCase() + type.slice(1)} via platform`
        }),
      });

      if (!res.ok) {
        const data = await res.text().then(text => text ? JSON.parse(text) : {});
        throw new Error(data.error || 'Transaction failed');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setStep('input');
    } finally {
      setIsLoading(false);
    }
  };

  const title = type === 'deposit' ? 'Deposit Funds' : type === 'withdraw' ? 'Withdraw Funds' : 'Transfer Assets';
  const Icon = type === 'deposit' ? ArrowDownRight : type === 'withdraw' ? ArrowUpRight : ArrowRightLeft;
  const activeWallet = wallets.find(w => w.id === selectedWallet);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-graphite-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {success ? (
              <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-10 h-10" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Transaction Successful</h3>
                <p className="text-silver-400">Your {type} of ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} has been processed.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className={clsx(
                      "w-12 h-12 rounded-2xl flex items-center justify-center border",
                      type === 'deposit' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                      type === 'withdraw' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                      'bg-accent-500/10 border-accent-500/20 text-accent-500'
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                      <p className="text-xs text-silver-400 font-medium uppercase tracking-wider">
                        {step === 'input' ? 'Enter Details' : 'Review & Confirm'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 text-silver-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto">
                  {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
                      <Info className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  {step === 'input' ? (
                    <form id="transfer-form" onSubmit={handleContinue} className="space-y-8">
                      {/* Wallet Selection */}
                      <div className="space-y-3">
                        <label className="text-xs font-semibold text-silver-400 uppercase tracking-wider">Select Asset</label>
                        <div className="relative">
                          <select 
                            value={selectedWallet}
                            onChange={(e) => setSelectedWallet(e.target.value)}
                            className="w-full bg-graphite-800/50 border border-white/10 rounded-2xl py-4 pl-14 pr-10 text-white font-medium focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all appearance-none cursor-pointer"
                            required
                          >
                            <option value="" disabled>Select a wallet</option>
                            {wallets.map(w => (
                              <option key={w.id} value={w.id}>
                                {w.currency} ({w.type}) - Avail: ${w.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Wallet className="w-6 h-6 text-silver-400" />
                          </div>
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <ChevronDown className="w-5 h-5 text-silver-400" />
                          </div>
                        </div>
                      </div>

                      {/* Amount Input */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <label className="text-xs font-semibold text-silver-400 uppercase tracking-wider">Amount</label>
                          {type === 'withdraw' && activeWallet && (
                            <button 
                              type="button"
                              onClick={handleMaxAmount}
                              className="text-xs font-medium text-accent-400 hover:text-accent-300 transition-colors"
                            >
                              Max: ${activeWallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <span className="text-2xl text-silver-400 font-light">$</span>
                          </div>
                          <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            min="0.01"
                            step="0.01"
                            required
                            className="w-full bg-graphite-800/50 border border-white/10 rounded-2xl py-6 pl-12 pr-6 text-4xl text-white font-light focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all placeholder:text-silver-600"
                          />
                        </div>

                        {/* Quick Amounts */}
                        <div className="grid grid-cols-4 gap-2 pt-2">
                          {QUICK_AMOUNTS.map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleQuickAmount(val)}
                              className="py-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/10 text-sm font-medium text-silver-300 transition-colors"
                            >
                              ${val}
                            </button>
                          ))}
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-graphite-800/50 border border-white/5 space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                          <span className="text-silver-400">Asset</span>
                          <span className="text-white font-medium flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-silver-400" />
                            {activeWallet?.currency} ({activeWallet?.type})
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                          <span className="text-silver-400">Amount</span>
                          <span className="text-white font-medium">${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                          <span className="text-silver-400">Network Fee</span>
                          <span className="text-emerald-400 font-medium">Free</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-silver-300 font-medium">Total {type === 'deposit' ? 'to receive' : 'to deduct'}</span>
                          <span className="text-2xl font-bold text-white tracking-tight">
                            ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                        <Info className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>Please review the transaction details carefully. This action cannot be undone once confirmed.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-white/5 bg-white/[0.02] flex gap-3">
                  {step === 'confirm' && (
                    <button 
                      type="button"
                      onClick={() => setStep('input')}
                      disabled={isLoading}
                      className="flex-1 py-4 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 transition-all"
                    >
                      Back
                    </button>
                  )}
                  <button 
                    type={step === 'input' ? 'submit' : 'button'}
                    form={step === 'input' ? 'transfer-form' : undefined}
                    onClick={step === 'confirm' ? handleSubmit : undefined}
                    disabled={isLoading || !amount || !selectedWallet}
                    className={clsx(
                      "flex-[2] py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2",
                      isLoading || !amount || !selectedWallet ? 'opacity-50 cursor-not-allowed bg-white/10' :
                      type === 'deposit' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' :
                      type === 'withdraw' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20' :
                      'bg-accent-600 hover:bg-accent-500 shadow-accent-500/20'
                    )}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : step === 'input' ? (
                      'Continue'
                    ) : (
                      `Confirm ${type.charAt(0).toUpperCase() + type.slice(1)}`
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
