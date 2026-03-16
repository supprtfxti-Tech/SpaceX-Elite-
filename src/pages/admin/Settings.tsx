import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { motion } from 'motion/react';
import { Settings, Shield, Bell, Database, Save } from 'lucide-react';

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">System Settings</h1>
          <p className="text-silver-400 text-sm">Manage global application configurations</p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center border border-accent-500/20">
                <Settings className="w-5 h-5 text-accent-400" />
              </div>
              <h2 className="text-lg font-bold text-white">General Configuration</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-silver-300 mb-2">Platform Name</label>
                <input 
                  type="text" 
                  defaultValue="SpaceX Elite"
                  className="w-full bg-graphite-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-silver-300 mb-2">Support Email</label>
                <input 
                  type="email" 
                  defaultValue="support@spacexelite.com"
                  className="w-full bg-graphite-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Security Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Security & Compliance</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-graphite-900/50 border border-white/10 rounded-xl">
                <div>
                  <h3 className="text-white font-medium">Require KYC for Withdrawals</h3>
                  <p className="text-sm text-silver-400">Users must be verified to withdraw funds</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-graphite-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-graphite-900/50 border border-white/10 rounded-xl">
                <div>
                  <h3 className="text-white font-medium">Two-Factor Authentication (2FA)</h3>
                  <p className="text-sm text-silver-400">Enforce 2FA for all admin accounts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-graphite-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                </label>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-xl font-medium transition-colors">
              <Save className="w-5 h-5" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
