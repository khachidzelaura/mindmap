import { create } from 'zustand';
import { Node, Connection, MindMap } from '../types/mindmap';

interface MindMapState {
  mindmaps: Record<string, MindMap>;
  currentMindMapId: string;
  selectedNodeId: string | null;
  zoom: number;
  createNewMindMap: () => void;
  addNode: (parentId: string) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setZoom: (zoom: number) => void;
  switchMindMap: (id: string) => void;
}

const getInitialNodePosition = () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  return {
    x: (viewportWidth / 2) - 75, // Half of default node width
    y: (viewportHeight / 2) - 30, // Half of default node height
  };
};

const createDefaultMindMap = (id: string): MindMap => ({
  nodes: {
    root: {
      id: 'root',
      type: 'circle',
      content: 'New Mind Map',
      position: getInitialNodePosition(),
      children: [],
      style: {
        color: '#ffffff',
        backgroundColor: '#3b82f6',
        width: 150,
        height: 60,
      },
    },
  },
  connections: [],
  rootId: 'root',
});

const initialMindMap = createDefaultMindMap('default');

export const useMindMapStore = create<MindMapState>((set, get) => ({
  mindmaps: {
    default: initialMindMap,
  },
  currentMindMapId: 'default',
  selectedNodeId: null,
  zoom: 1,

  createNewMindMap: () =>
    set((state) => {
      const newId = crypto.randomUUID();
      return {
        mindmaps: {
          ...state.mindmaps,
          [newId]: createDefaultMindMap(newId),
        },
        currentMindMapId: newId,
        selectedNodeId: null,
      };
    }),

  addNode: (parentId) =>
    set((state) => {
      const currentMindMap = state.mindmaps[state.currentMindMapId];
      if (!currentMindMap) return state;

      const newId = crypto.randomUUID();
      const parentNode = currentMindMap.nodes[parentId];
      if (!parentNode) return state;
      
      const newNode: Node = {
        id: newId,
        type: 'circle',
        content: 'New Node',
        position: {
          x: parentNode.position.x + 200,
          y: parentNode.position.y + (parentNode.children.length * 100),
        },
        parentId,
        children: [],
        style: {
          color: '#ffffff',
          backgroundColor: '#4f46e5',
          width: 120,
          height: 50,
        },
      };

      const newConnection: Connection = {
        id: crypto.randomUUID(),
        source: parentId,
        target: newId,
        style: {
          color: '#475569',
          width: 2,
          type: 'curved',
        },
      };

      return {
        mindmaps: {
          ...state.mindmaps,
          [state.currentMindMapId]: {
            ...currentMindMap,
            nodes: {
              ...currentMindMap.nodes,
              [newId]: newNode,
              [parentId]: {
                ...parentNode,
                children: [...parentNode.children, newId],
              },
            },
            connections: [...currentMindMap.connections, newConnection],
          },
        },
      };
    }),

  updateNode: (nodeId, updates) =>
    set((state) => {
      const currentMindMap = state.mindmaps[state.currentMindMapId];
      if (!currentMindMap || !currentMindMap.nodes[nodeId]) return state;

      return {
        mindmaps: {
          ...state.mindmaps,
          [state.currentMindMapId]: {
            ...currentMindMap,
            nodes: {
              ...currentMindMap.nodes,
              [nodeId]: { ...currentMindMap.nodes[nodeId], ...updates },
            },
          },
        },
      };
    }),

  deleteNode: (nodeId) =>
    set((state) => {
      const currentMindMap = state.mindmaps[state.currentMindMapId];
      if (!currentMindMap || !currentMindMap.nodes[nodeId]) return state;

      const { [nodeId]: deletedNode, ...remainingNodes } = currentMindMap.nodes;
      
      const nodesToDelete = new Set<string>([nodeId]);
      const getChildNodes = (node: Node) => {
        node.children.forEach(childId => {
          nodesToDelete.add(childId);
          const childNode = currentMindMap.nodes[childId];
          if (childNode) {
            getChildNodes(childNode);
          }
        });
      };
      
      getChildNodes(deletedNode);

      const filteredNodes = Object.fromEntries(
        Object.entries(currentMindMap.nodes).filter(([id]) => !nodesToDelete.has(id))
      );

      const newConnections = currentMindMap.connections.filter(
        (conn) => !nodesToDelete.has(conn.source) && !nodesToDelete.has(conn.target)
      );

      if (deletedNode.parentId) {
        const parentNode = filteredNodes[deletedNode.parentId];
        if (parentNode) {
          filteredNodes[deletedNode.parentId] = {
            ...parentNode,
            children: parentNode.children.filter((id) => !nodesToDelete.has(id)),
          };
        }
      }

      return {
        mindmaps: {
          ...state.mindmaps,
          [state.currentMindMapId]: {
            ...currentMindMap,
            nodes: filteredNodes,
            connections: newConnections,
          },
        },
        selectedNodeId: null,
      };
    }),

  setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),
  setZoom: (zoom) => set({ zoom }),
  switchMindMap: (id) => set({ currentMindMapId: id, selectedNodeId: null }),
}));