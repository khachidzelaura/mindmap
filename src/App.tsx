import React from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">MindFlow Pro</h1>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 relative">
        <Canvas />
        <Toolbar />
      </main>
    </div>
  );
}

export default App;