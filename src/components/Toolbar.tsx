import React from 'react';
import { motion } from 'framer-motion';
import { FilePlus, Save, Download, Share2 } from 'lucide-react';
import { useMindMapStore } from '../store/mindmapStore';

export const Toolbar: React.FC = () => {
  const { createNewMindMap } = useMindMapStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="toolbar fixed bottom-6 left-1/2 transform -translate-x-1/2 rounded-full shadow-2xl px-6 py-3 flex items-center space-x-4"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={createNewMindMap}
        className="p-2 hover:bg-slate-700/50 rounded-full tooltip"
        data-tooltip="New Mind Map"
      >
        <FilePlus className="w-5 h-5 text-slate-300" />
      </motion.button>

      <div className="w-px h-6 bg-slate-700" />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 hover:bg-slate-700/50 rounded-full tooltip"
        data-tooltip="Save"
      >
        <Save className="w-5 h-5 text-slate-300" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 hover:bg-slate-700/50 rounded-full tooltip"
        data-tooltip="Export"
      >
        <Download className="w-5 h-5 text-slate-300" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 hover:bg-slate-700/50 rounded-full tooltip"
        data-tooltip="Share"
      >
        <Share2 className="w-5 h-5 text-slate-300" />
      </motion.button>
    </motion.div>
  );
};