export interface Position {
  x: number;
  y: number;
}

export interface NodeStyle {
  color: string;
  backgroundColor: string;
  width: number;
  height: number;
}

export interface ConnectionStyle {
  color: string;
  width: number;
  type: 'straight' | 'curved';
}

export interface Node {
  id: string;
  type: 'circle' | 'rectangle';
  content: string;
  position: Position;
  parentId?: string;
  children: string[];
  style: NodeStyle;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  style: ConnectionStyle;
}

export interface MindMap {
  nodes: Record<string, Node>;
  connections: Connection[];
  rootId: string;
}