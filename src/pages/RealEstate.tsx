import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building, MapPin, TrendingUp, DollarSign, ArrowRight, Home, Percent, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import clsx from 'clsx';

const PROPERTIES = [
  {
    id: 'prop-1',
    name: 'The Obsidian Tower',
    location: 'Dubai, UAE',
    type: 'Commercial',
    price: 12500000,
    minInvestment: 5000,
    apy: 12.5,
    funded: 85,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
    status: 'funding'
  },
  {
    id: 'prop-2',
    name: 'Aura Residences',
    location: 'Miami, USA',
    type: 'Residential',
    price: 8400000,
    minInvestment: 2500,
    apy: 9.8,
    funded: 100,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
    status: 'trading'
  },
  {
    id: 'prop-3',
    name: 'Neo Logistics Hub',
    location: 'Singapore',
    type: 'Industrial',
    price: 22000000,
    minInvestment: 10000,
    apy: 14.2,
    funded: 42,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop',
    status: 'funding'
  }
];

export default function RealEstate() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'portfolio'>('marketplace');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Real Estate</h1>
          <p className="text-silver-400">Invest in premium tokenized global real estate.</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-graphite-800 p-1 rounded-xl w-fit border border-white/5">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={clsx(
              "px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === 'marketplace'
                ? "bg-white/10 text-white shadow-sm"
                : "text-silver-400 hover:text-white hover:bg-white/5"
            )}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={clsx(
              "px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === 'portfolio'
                ? "bg-white/10 text-white shadow-sm"
                : "text-silver-400 hover:text-white hover:bg-white/5"
            )}
          >
            My Portfolio
          </button>
        </div>

        {activeTab === 'marketplace' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PROPERTIES.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-graphite-800 rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite-900 via-graphite-900/40 to-transparent" />
                  
                  <div className="absolute top-4 right-4">
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border",
                      property.status === 'funding' 
                        ? "bg-accent-500/20 text-accent-400 border-accent-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    )}>
                      {property.status === 'funding' ? 'Funding Now' : 'Trading'}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-light text-white mb-1">{property.name}</h3>
                    <div className="flex items-center gap-2 text-silver-300 text-sm">
                      <MapPin className="w-4 h-4" />
                      {property.location}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="text-silver-400 text-xs mb-1 flex items-center gap-1">
                        <Percent className="w-3 h-3" /> Projected APY
                      </div>
                      <div className="text-emerald-400 font-bold text-lg">{property.apy}%</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="text-silver-400 text-xs mb-1 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> Min. Invest
                      </div>
                      <div className="text-white font-bold text-lg">${property.minInvestment.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-silver-400">Funding Progress</span>
                      <span className="text-white font-medium">{property.funded}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-accent-500 h-full rounded-full"
                        style={{ width: `${property.funded}%` }}
                      />
                    </div>
                  </div>

                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors border border-white/10 flex items-center justify-center gap-2">
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
            <Home className="w-16 h-16 text-silver-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-white mb-2">No Properties Yet</h3>
            <p className="text-silver-400 mb-6 max-w-md mx-auto">
              You haven't invested in any real estate properties yet. Browse the marketplace to start building your global portfolio.
            </p>
            <button 
              onClick={() => setActiveTab('marketplace')}
              className="px-6 py-3 bg-accent-600 hover:bg-accent-500 text-white rounded-xl font-medium transition-colors"
            >
              Explore Properties
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
