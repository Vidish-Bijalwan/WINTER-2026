import { useRef, useState, useCallback } from 'react';
import { CameraControls } from '@react-three/drei';
import * as THREE from 'three';

export interface Node {
  id: string;
  label?: string;
  x: number;
  y: number;
  z: number;
  color?: string;
  size?: number;
  metadata?: Record<string, any>;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  weight?: number;
  color?: string;
}

export interface NetworkData {
  nodes: Node[];
  edges: Edge[];
}

interface UseNetworkInteractionProps {
  data: NetworkData;
  onNodeClick?: (node: Node) => void;
  onNodeHover?: (node: Node | null) => void;
}

export const useNetworkInteraction = ({
  data,
  onNodeClick,
  onNodeHover,
}: UseNetworkInteractionProps) => {
  const cameraControlsRef = useRef<CameraControls>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    minWeight?: number;
    maxWeight?: number;
    nodeColors?: string[];
  }>({});

  // Camera controls
  const resetCamera = useCallback(() => {
    cameraControlsRef.current?.reset(true);
  }, []);

  const zoomToNode = useCallback((nodeId: string) => {
    const node = data.nodes.find(n => n.id === nodeId);
    if (node && cameraControlsRef.current) {
      const target = new THREE.Vector3(node.x, node.y, node.z);
      cameraControlsRef.current.setLookAt(
        target.x + 5,
        target.y + 5,
        target.z + 5,
        target.x,
        target.y,
        target.z,
        true
      );
    }
  }, [data.nodes]);

  // Node selection
  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode(node);
    onNodeClick?.(node);
  }, [onNodeClick]);

  const handleNodeHover = useCallback((node: Node | null) => {
    setHoveredNode(node);
    onNodeHover?.(node);
  }, [onNodeHover]);

  // Search and filter
  const filteredNodes = data.nodes.filter(node => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesLabel = node.label?.toLowerCase().includes(query);
      const matchesId = node.id.toLowerCase().includes(query);
      if (!matchesLabel && !matchesId) return false;
    }
    if (filters.nodeColors && filters.nodeColors.length > 0) {
      if (!node.color || !filters.nodeColors.includes(node.color)) return false;
    }
    return true;
  });

  const filteredEdges = data.edges.filter(edge => {
    const sourceNode = filteredNodes.find(n => n.id === edge.source);
    const targetNode = filteredNodes.find(n => n.id === edge.target);
    if (!sourceNode || !targetNode) return false;

    if (filters.minWeight !== undefined && (edge.weight || 0) < filters.minWeight) {
      return false;
    }
    if (filters.maxWeight !== undefined && (edge.weight || 0) > filters.maxWeight) {
      return false;
    }
    return true;
  });

  // Export functions
  const exportAsImage = useCallback(async () => {
    // This will be implemented with html2canvas
    return null;
  }, []);

  const exportAsJSON = useCallback(() => {
    const exportData = {
      nodes: filteredNodes,
      edges: filteredEdges,
      metadata: {
        exportedAt: new Date().toISOString(),
        filters,
        searchQuery,
      },
    };
    return JSON.stringify(exportData, null, 2);
  }, [filteredNodes, filteredEdges, filters, searchQuery]);

  return {
    cameraControlsRef,
    selectedNode,
    hoveredNode,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    filteredNodes,
    filteredEdges,
    resetCamera,
    zoomToNode,
    handleNodeClick,
    handleNodeHover,
    exportAsImage,
    exportAsJSON,
  };
};
