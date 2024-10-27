import React from 'react';
import { Connection as ConnectionType, Node } from '../types/mindmap';

interface ConnectionProps {
  connection: ConnectionType;
  sourceNode: Node;
  targetNode: Node;
}

export const Connection: React.FC<ConnectionProps> = ({
  connection,
  sourceNode,
  targetNode,
}) => {
  if (!sourceNode || !targetNode) return null;

  const sourceX = sourceNode.position.x + sourceNode.style.width / 2;
  const sourceY = sourceNode.position.y + sourceNode.style.height / 2;
  const targetX = targetNode.position.x + targetNode.style.width / 2;
  const targetY = targetNode.position.y + targetNode.style.height / 2;

  const controlPoint1X = sourceX + (targetX - sourceX) / 2;
  const controlPoint1Y = sourceY;
  const controlPoint2X = controlPoint1X;
  const controlPoint2Y = targetY;

  const path = connection.style.type === 'curved'
    ? `M ${sourceX} ${sourceY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${targetX} ${targetY}`
    : `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <path
        d={path}
        stroke={connection.style.color}
        strokeWidth={connection.style.width}
        fill="none"
      />
    </svg>
  );
};