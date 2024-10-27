import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { Node as NodeType } from '../types/mindmap';
import { useMindMapStore } from '../store/mindmapStore';

interface NodeProps {
  node: NodeType;
}

export const Node: React.FC<NodeProps> = ({ node }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: node.id,
  });
  const { addNode, deleteNode, updateNode, selectedNodeId, setSelectedNode } = useMindMapStore();
  const [isHovered, setIsHovered] = React.useState(false);

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    position: 'absolute',
    left: node.position.x,
    top: node.position.y,
    width: node.style.width,
    height: node.style.height,
    backgroundColor: node.style.backgroundColor,
    color: node.style.color,
  } as const;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNode(node.id, { content: e.target.value });
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`mindmap-node rounded-xl p-4 cursor-move ${
        selectedNodeId === node.id ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => setSelectedNode(node.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      {...listeners}
      {...attributes}
    >
      <textarea
        className="w-full h-full bg-transparent resize-none outline-none"
        value={node.content}
        onChange={handleContentChange}
        onClick={(e) => e.stopPropagation()}
      />
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -right-12 top-0 flex flex-col gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                addNode(node.id);
              }}
              className="p-2 bg-emerald-500 rounded-full hover:bg-emerald-600 transition-colors shadow-lg"
            >
              <Plus size={16} className="text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(node.id);
              }}
              className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <Trash2 size={16} className="text-white" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};