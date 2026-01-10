import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Html } from '@react-three/drei';
import { CameraControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useNetworkInteraction, Node, Edge } from '../../hooks/useNetworkInteraction';
import * as THREE from 'three';

interface NetworkGraph3DProps {
  data?: {
    nodes: Node[];
    edges: Edge[];
  };
  onNodeClick?: (node: Node) => void;
}

// Generate sample data if none provided
const generateSampleData = (): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const colors = ['#00d4ff', '#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf'];

  // Create a network of nodes
  for (let i = 0; i < 50; i++) {
    const angle = (i / 50) * Math.PI * 2;
    const radius = 5 + Math.random() * 3;
    nodes.push({
      id: `node-${i}`,
      label: `Node ${i}`,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle * 2) * 2,
      z: Math.sin(angle) * radius,
      color: colors[i % colors.length],
      size: 0.3 + Math.random() * 0.3,
    });
  }

  // Create edges
  for (let i = 0; i < nodes.length; i++) {
    const connections = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < connections; j++) {
      const targetIndex = Math.floor(Math.random() * nodes.length);
      if (targetIndex !== i) {
        edges.push({
          id: `edge-${i}-${targetIndex}`,
          source: nodes[i].id,
          target: nodes[targetIndex].id,
          weight: Math.random(),
          color: '#666',
        });
      }
    }
  }

  return { nodes, edges };
};

const NodeMesh: React.FC<{
  node: Node;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}> = ({ node, isSelected, isHovered, onClick, onHover }) => {
  const color = node.color || '#00d4ff';
  const size = node.size || 0.3;
  const scale = isHovered ? 1.5 : isSelected ? 1.3 : 1;

  return (
    <group
      position={[node.x, node.y, node.z]}
      onClick={onClick}
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
    >
      <mesh scale={scale}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered || isSelected ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {(isHovered || isSelected) && node.label && (
        <Html distanceFactor={10}>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {node.label}
          </div>
        </Html>
      )}
    </group>
  );
};

const EdgeLine: React.FC<{
  edge: Edge;
  sourceNode: Node;
  targetNode: Node;
}> = ({ edge, sourceNode, targetNode }) => {
  const points = useMemo(
    () => [
      new THREE.Vector3(sourceNode.x, sourceNode.y, sourceNode.z),
      new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z),
    ],
    [sourceNode, targetNode]
  );

  const thickness = 0.02 + (edge.weight || 0) * 0.05;
  const color = edge.color || '#666';

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} linewidth={thickness} />
    </line>
  );
};

const NetworkGraph3D: React.FC<NetworkGraph3DProps> = ({
  data: providedData,
  onNodeClick,
}) => {
  const data = providedData || generateSampleData();
  
  const {
    cameraControlsRef,
    selectedNode,
    hoveredNode,
    filteredNodes,
    filteredEdges,
    handleNodeClick,
    handleNodeHover,
  } = useNetworkInteraction({
    data,
    onNodeClick,
  });

  const nodeMap = useMemo(
    () => new Map(filteredNodes.map(n => [n.id, n])),
    [filteredNodes]
  );

  return (
    <div style={{ width: '100%', height: '600px', background: '#0a0a0a' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        <CameraControls ref={cameraControlsRef} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Render edges */}
        {filteredEdges.map(edge => {
          const sourceNode = nodeMap.get(edge.source);
          const targetNode = nodeMap.get(edge.target);
          if (!sourceNode || !targetNode) return null;
          return (
            <EdgeLine
              key={edge.id}
              edge={edge}
              sourceNode={sourceNode}
              targetNode={targetNode}
            />
          );
        })}

        {/* Render nodes */}
        {filteredNodes.map(node => (
          <NodeMesh
            key={node.id}
            node={node}
            isSelected={selectedNode?.id === node.id}
            isHovered={hoveredNode?.id === node.id}
            onClick={() => handleNodeClick(node)}
            onHover={(hovered) => handleNodeHover(hovered ? node : null)}
          />
        ))}

        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default NetworkGraph3D;
