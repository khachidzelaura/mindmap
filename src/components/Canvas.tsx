import React, { useRef, useEffect } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Node } from './Node';
import { Connection } from './Connection';
import { useMindMapStore } from '../store/mindmapStore';

export const Canvas: React.FC = () => {
  const { mindmaps, currentMindMapId, updateNode } = useMindMapStore();
  const currentMindMap = mindmaps[currentMindMapId];
  const transformComponentRef = useRef<any>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const nodeId = active.id as string;
    const node = currentMindMap.nodes[nodeId];
    
    if (node) {
      updateNode(nodeId, {
        position: {
          x: node.position.x + delta.x,
          y: node.position.y + delta.y,
        },
      });
    }
  };

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 1) { // Middle mouse button
        e.stopPropagation();
      }
    };

    const canvas = document.querySelector('.react-transform-wrapper');
    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, []);

  if (!currentMindMap) {
    return null;
  }

  return (
    <TransformWrapper
      ref={transformComponentRef}
      initialScale={0.8}
      minScale={0.3}
      maxScale={2}
      limitToBounds={false}
      wheel={{ wheelEnabled: true }}
      pinch={{ pinchEnabled: true }}
      panning={{ activationKeys: ['AltLeft', 'AltRight'] }}
    >
      <TransformComponent
        wrapperClass="w-full h-full"
        contentClass="w-[4000px] h-[4000px] relative canvas-grid"
      >
        <DndContext
          sensors={sensors}
          modifiers={[restrictToWindowEdges]}
          onDragEnd={handleDragEnd}
        >
          {currentMindMap.connections.map((connection) => (
            <Connection
              key={connection.id}
              connection={connection}
              sourceNode={currentMindMap.nodes[connection.source]}
              targetNode={currentMindMap.nodes[connection.target]}
            />
          ))}
          
          {Object.values(currentMindMap.nodes).map((node) => (
            <Node key={node.id} node={node} />
          ))}
        </DndContext>
      </TransformComponent>
    </TransformWrapper>
  );
};