import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap, Lock, DollarSign, Activity, BarChart3, Bot } from 'lucide-react';

export default function NonagonPrototype() {
  const [activeTab, setActiveTab] = useState('trading');
  const [balance, setBalance] = useState({ usdc: 10000, usdt: 10000, n9g: 5000 });
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [] });
  const [stakedAmount, setStakedAmount] = useState(0);
  const [lockPeriod, setLockPeriod] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [hftEnabled, setHftEnabled] = useState(false);
  const [hftProfit, setHftProfit] = useState(0);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [selectedPair, setSelectedPair] = useState('USDC/USDT');

  // Generate realistic orderbook
  useEffect(() => {
    const generateOrderbook = () => {
      const midPrice = 0.9998;
      const bids = [];
      const asks = [];
      
      for (let i = 0; i < 10; i++) {
        bids.push({
          price: (midPrice - (i * 0.0001)).toFixed(4),
          amount: Math.floor(Math.random() * 50000) + 10000,
          total: 0
        });
        asks.push({
          price: (midPrice + (i * 0.0001)).toFixed(4),
          amount: Math.floor(Math.random() * 50000) + 10000,
          total: 0
        });
      }
      
      setOrderbook({ bids, asks });
    };

    generateOrderbook();
    const interval = setInterval(generateOrderbook, 3000);
    return () => clearInterval(interval);
  }, [selectedPair]);

  // HFT Bot simulation
  useEffect(() => {
    if (hftEnabled) {
      const hftInterval = setInterval(() => {
        const profit = Math.random() * 5 + 2; // $2-7 per trade
        setHftProfit(prev => prev + profit);
        setTotalEarnings(prev => prev + profit);
        
        // Add to trade history
        const trades = ['Market Making', 'Arbitrage', 'Spread Capture', 'Statistical Arb'];
        setTradeHistory(prev => [{
          time: new Date().toLocaleTimeString(),
          strategy: trades[Math.floor(Math.random() * trades.length)],
          profit: profit.toFixed(2),
          pair: selectedPair
        }, ...prev].slice(0, 20));
      }, 5000); // Execute trade every 5 seconds
      
      return () => clearInterval(hftInterval);
    }
  }, [hftEnabled, selectedPair]);

  // Staking rewards simulation
  useEffect(() => {
    if (stakedAmount > 0) {
      const rewardInterval = setInterval(() => {
        const baseAPY = 0.15; // 15% base
        const multiplier = 1 + (lockPeriod / 365) * 0.8;
        const dailyRate = (baseAPY * multiplier) / 365;
        const reward = stakedAmount * dailyRate;
        
        setTotalEarnings(prev => prev + reward);
      }, 2000); // Update every 2 seconds for demo
      
      return () => clearInterval(rewardInterval);
    }
  }, [stakedAmount, lockPeriod]);

  const executeTrade = (side, price, amount) => {
    const fee = side === 'maker' ? -0.0001 : 0.0003; // Maker rebate or taker fee
    const total = price * amount;
    const feeAmount = total * Math.abs(fee);
    
    if (side === 'buy') {
      if (balance.usdt >= total + feeAmount) {
        setBalance(prev => ({
          ...prev,
          usdt: prev.usdt - total - feeAmount,
          usdc: prev.usdc + amount
        }));
        
        const profit = fee < 0 ? feeAmount : -feeAmount;
        setTotalEarnings(prev => prev + profit);
        
        setTradeHistory(prev => [{
          time: new Date().toLocaleTimeString(),
          strategy: 'Manual Trade',
          profit: profit.toFixed(2),
          pair: selectedPair
        }, ...prev].slice(0, 20));
      }
    }
  };

  const stakeTokens = (amount) => {
    if (balance.n9g >= amount) {
      setBalance(prev => ({ ...prev, n9g: prev.n9g - amount }));
      setStakedAmount(prev => prev + amount);
    }
  };

  const unstakeTokens = () => {
    setBalance(prev => ({ ...prev, n9g: prev.n9g + stakedAmount }));
    setStakedAmount(0);
    setLockPeriod(0);
  };

  const calculateAPY = () => {
    const baseAPY = 15;
    const lockMultiplier = 1 + (lockPeriod / 365) * 0.8;
    return (baseAPY * lockMultiplier).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-6 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-2">NonagonChain DEX</h1>
          <p className="text-purple-100">High-Frequency Stablecoin Trading Protocol</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <div className="text-purple-200 text-sm">Total Earnings</div>
              <div className="text-2xl font-bold text-white">${totalEarnings.toFixed(2)}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <div className="text-purple-200 text-sm">Staked N9G</div>
              <div className="text-2xl font-bold text-white">{stakedAmount.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <div className="text-purple-200 text-sm">Current APY</div>
              <div className="text-2xl font-bold text-green-400">{calculateAPY()}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <div className="text-purple-200 text-sm">HFT Profit</div>
              <div className="text-2xl font-bold text-yellow-400">${hftProfit.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'trading', label: 'Orderbook Trading', icon: BarChart3 },
            { id: 'staking', label: 'Stake & Earn', icon: Lock },
            { id: 'hft', label: 'HFT Bot', icon: Bot },
            { id: 'portfolio', label: 'Portfolio', icon: DollarSign }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            {activeTab === 'trading' && <TradingPanel orderbook={orderbook} executeTrade={executeTrade} selectedPair={selectedPair} setSelectedPair={setSelectedPair} />}
            {activeTab === 'staking' && <StakingPanel balance={balance} stakedAmount={stakedAmount} lockPeriod={lockPeriod} setLockPeriod={setLockPeriod} stakeTokens={stakeTokens} unstakeTokens={unstakeTokens} calculateAPY={calculateAPY} />}
            {activeTab === 'hft' && <HFTPanel hftEnabled={hftEnabled} setHftEnabled={setHftEnabled} hftProfit={hftProfit} />}
            {activeTab === 'portfolio' && <PortfolioPanel balance={balance} stakedAmount={stakedAmount} totalEarnings={totalEarnings} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BalanceCard balance={balance} />
            <TradeHistory trades={tradeHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TradingPanel({ orderbook, executeTrade, selectedPair, setSelectedPair }) {
  const [orderAmount, setOrderAmount] = useState(1000);

  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Orderbook Trading</h2>
        <select 
          value={selectedPair}
          onChange={(e) => setSelectedPair(e.target.value)}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg"
        >
          <option>USDC/USDT</option>
          <option>DAI/USDC</option>
          <option>FRAX/USDT</option>
          <option>BUSD/USDC</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Asks */}
        <div>
          <h3 className="text-red-400 font-semibold mb-3">Asks (Sell Orders)</h3>
          <div className="space-y-1">
            {orderbook.asks.slice(0, 8).reverse().map((ask, i) => (
              <div key={i} className="flex justify-between text-sm bg-red-900/20 p-2 rounded hover:bg-red-900/40 cursor-pointer" onClick={() => executeTrade('buy', parseFloat(ask.price), orderAmount)}>
                <span className="text-red-400">{ask.price}</span>
                <span className="text-gray-300">{ask.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bids */}
        <div>
          <h3 className="text-green-400 font-semibold mb-3">Bids (Buy Orders)</h3>
          <div className="space-y-1">
            {orderbook.bids.slice(0, 8).map((bid, i) => (
              <div key={i} className="flex justify-between text-sm bg-green-900/20 p-2 rounded hover:bg-green-900/40 cursor-pointer" onClick={() => executeTrade('sell', parseFloat(bid.price), orderAmount)}>
                <span className="text-green-400">{bid.price}</span>
                <span className="text-gray-300">{bid.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Input */}
      <div className="bg-slate-700 p-4 rounded-lg">
        <label className="text-gray-300 text-sm block mb-2">Order Amount (USDC)</label>
        <input
          type="number"
          value={orderAmount}
          onChange={(e) => setOrderAmount(parseFloat(e.target.value))}
          className="w-full bg-slate-600 text-white px-4 py-2 rounded-lg mb-4"
        />
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => executeTrade('buy', parseFloat(orderbook.asks[0]?.price || 1), orderAmount)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Market Buy
          </button>
          <button
            onClick={() => executeTrade('sell', parseFloat(orderbook.bids[0]?.price || 1), orderAmount)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Market Sell
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Fee: Taker 0.03% | Maker -0.01% (rebate)</p>
      </div>
    </div>
  );
}

function StakingPanel({ balance, stakedAmount, lockPeriod, setLockPeriod, stakeTokens, unstakeTokens, calculateAPY }) {
  const [stakeInput, setStakeInput] = useState(1000);

  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Stake $N9G & Earn</h2>

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl mb-6">
        <div className="text-center">
          <div className="text-purple-200 mb-2">Current APY</div>
          <div className="text-5xl font-bold text-white mb-2">{calculateAPY()}%</div>
          <div className="text-purple-200 text-sm">Lock for higher rewards</div>
        </div>
      </div>

      <div className="bg-slate-700 p-6 rounded-xl mb-6">
        <label className="text-gray-300 text-sm block mb-2">Stake Amount (N9G)</label>
        <input
          type="number"
          value={stakeInput}
          onChange={(e) => setStakeInput(parseFloat(e.target.value))}
          className="w-full bg-slate-600 text-white px-4 py-3 rounded-lg mb-4"
          max={balance.n9g}
        />

        <label className="text-gray-300 text-sm block mb-2">Lock Period: {lockPeriod} days</label>
        <input
          type="range"
          min="0"
          max="365"
          value={lockPeriod}
          onChange={(e) => setLockPeriod(parseInt(e.target.value))}
          className="w-full mb-2"
        />
        <div className="flex justify-between text-xs text-gray-400 mb-4">
          <span>Flexible (1.0x)</span>
          <span>30d (1.3x)</span>
          <span>90d (1.6x)</span>
          <span>365d (2.2x)</span>
        </div>

        <button
          onClick={() => stakeTokens(stakeInput)}
          disabled={balance.n9g < stakeInput}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all mb-3"
        >
          Stake {stakeInput} N9G
        </button>

        {stakedAmount > 0 && (
          <button
            onClick={unstakeTokens}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Unstake All ({stakedAmount} N9G)
          </button>
        )}
      </div>

      <div className="bg-slate-700 p-4 rounded-lg">
        <h3 className="text-white font-semibold mb-3">Revenue Sources</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Trading Fees (40%)</span>
            <span className="text-green-400">~12% APY</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Arbitrage Profits (40%)</span>
            <span className="text-green-400">~8% APY</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Inflation Rewards</span>
            <span className="text-green-400">~8% APY</span>
          </div>
          <div className="border-t border-gray-600 pt-2 mt-2 flex justify-between font-semibold">
            <span className="text-white">Total Base APY</span>
            <span className="text-green-400">~28%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HFTPanel({ hftEnabled, setHftEnabled, hftProfit }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">High-Frequency Trading Bot</h2>

      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-orange-100 text-sm mb-1">HFT Bot Status</div>
            <div className="text-3xl font-bold text-white">
              {hftEnabled ? 'ACTIVE' : 'INACTIVE'}
            </div>
          </div>
          <Bot size={48} className="text-white" />
        </div>
      </div>

      <div className="bg-slate-700 p-6 rounded-xl mb-6">
        <h3 className="text-white font-semibold mb-4">Bot Strategies</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-600 rounded-lg">
            <Activity className="text-green-400" size={24} />
            <div className="flex-1">
              <div className="text-white font-semibold">Market Making</div>
              <div className="text-gray-400 text-sm">Place bid/ask orders for spread capture</div>
            </div>
            <div className="text-green-400 font-semibold">0.03%</div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-600 rounded-lg">
            <Zap className="text-yellow-400" size={24} />
            <div className="flex-1">
              <div className="text-white font-semibold">Cross-Exchange Arbitrage</div>
              <div className="text-gray-400 text-sm">Exploit price differences across DEXs</div>
            </div>
            <div className="text-yellow-400 font-semibold">0.15%</div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-600 rounded-lg">
            <TrendingUp className="text-blue-400" size={24} />
            <div className="flex-1">
              <div className="text-white font-semibold">Statistical Arbitrage</div>
              <div className="text-gray-400 text-sm">Mean reversion on correlated pairs</div>
            </div>
            <div className="text-blue-400 font-semibold">0.25%</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-700 p-4 rounded-lg mb-6">
        <h3 className="text-white font-semibold mb-3">Performance</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Total Profit</div>
            <div className="text-2xl font-bold text-green-400">${hftProfit.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-400">Win Rate</div>
            <div className="text-2xl font-bold text-green-400">94.3%</div>
          </div>
          <div>
            <div className="text-gray-400">Avg Profit/Trade</div>
            <div className="text-lg font-bold text-white">$4.23</div>
          </div>
          <div>
            <div className="text-gray-400">Trades/Day</div>
            <div className="text-lg font-bold text-white">~180</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setHftEnabled(!hftEnabled)}
        className={`w-full font-semibold py-4 rounded-lg transition-all ${
          hftEnabled
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {hftEnabled ? 'Stop HFT Bot' : 'Start HFT Bot'}
      </button>

      <p className="text-xs text-gray-400 mt-3 text-center">
        Bot keeps 20% of profits, you keep 80%
      </p>
    </div>
  );
}

function PortfolioPanel({ balance, stakedAmount, totalEarnings }) {
  const totalValue = balance.usdc + balance.usdt + (balance.n9g * 1.2) + (stakedAmount * 1.2);

  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Portfolio Overview</h2>

      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl mb-6">
        <div className="text-emerald-100 text-sm mb-1">Total Portfolio Value</div>
        <div className="text-4xl font-bold text-white">${totalValue.toFixed(2)}</div>
        <div className="text-emerald-100 text-sm mt-2">
          Total Earnings: <span className="font-semibold">${totalEarnings.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-700 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">USDC</span>
            <span className="text-white font-semibold">{balance.usdc.toFixed(2)}</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(balance.usdc / totalValue) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-700 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">USDT</span>
            <span className="text-white font-semibold">{balance.usdt.toFixed(2)}</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(balance.usdt / totalValue) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-700 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">N9G (Liquid)</span>
            <span className="text-white font-semibold">{balance.n9g.toFixed(2)}</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${((balance.n9g * 1.2) / totalValue) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-700 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">N9G (Staked)</span>
            <span className="text-white font-semibold">{stakedAmount.toFixed(2)}</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${((stakedAmount * 1.2) / totalValue) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-700 rounded-lg">
        <h3 className="text-white font-semibold mb-3">Earnings Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Trading Fees</span>
            <span className="text-green-400">+${(totalEarnings * 0.3).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Staking Rewards</span>
            <span className="text-green-400">+${(totalEarnings * 0.4).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">HFT Bot Profits</span>
            <span className="text-green-400">+${(totalEarnings * 0.3).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BalanceCard({ balance }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl">
      <h3 className="text-xl font-bold text-white mb-4">Wallet Balance</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
          <span className="text-gray-300">USDC</span>
          <span className="text-white font-semibold">${balance.usdc.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
          <span className="text-gray-300">USDT</span>
          <span className="text-white font-semibold">${balance.usdt.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
          <span className="text-gray-300">N9G</span>
          <span className="text-purple-400 font-semibold">{balance.n9g.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function TradeHistory({ trades }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl">
      <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {trades.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No trades yet. Start trading or enable HFT bot!</p>
        ) : (
          trades.map((trade, i) => (
            <div key={i} className="p-3 bg-slate-700 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="text-gray-300 text-sm">{trade.strategy}</span>
                <span className="text-green-400 text-sm font-semibold">+${trade.profit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs">{trade.pair}</span>
                <span className="text-gray-500 text-xs">{trade.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
