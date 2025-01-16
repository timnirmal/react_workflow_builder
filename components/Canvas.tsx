import React, { useState } from "react";
import Node from "./Node";
import Connection from "./Connection";

interface NodeType {
    id: string;
    x: number;
    y: number;
    label: string;
}

interface ConnectionType {
    source: { nodeId: string; edge: string };
    target: { nodeId: string; edge: string };
}

const Canvas: React.FC = () => {
    const [nodes, setNodes] = useState<NodeType[]>([]);
    const [connections, setConnections] = useState<ConnectionType[]>([]);
    const [selectedEdge, setSelectedEdge] = useState<{
        nodeId: string;
        edge: string;
    } | null>(null);

    const addNode = () => {
        const id = `node-${nodes.length + 1}`;
        setNodes([
            ...nodes,
            { id, x: 100, y: 100 + nodes.length * 50, label: `Node ${nodes.length + 1}` },
        ]);
    };

    const handleNodeDrag = (id: string, x: number, y: number) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === id ? { ...node, x, y } : node
            )
        );
    };

    const handleEdgeSelect = (nodeId: string, edge: "top" | "bottom" | "left" | "right") => {
        if (selectedEdge) {
            // Create a connection
            setConnections([
                ...connections,
                {
                    source: selectedEdge,
                    target: { nodeId, edge },
                },
            ]);
            setSelectedEdge(null); // Reset selection
        } else {
            // Select the first edge
            setSelectedEdge({ nodeId, edge });
        }
    };

    const removeConnection = (index: number) => {
        setConnections((prevConnections) =>
            prevConnections.filter((_, idx) => idx !== index)
        );
    };

    return (
        <div className="relative w-full h-screen bg-gray-100 overflow-hidden border border-gray-300">
            <button
                className="absolute top-2 left-2 bg-green-500 text-white px-4 py-2 rounded"
                onClick={addNode}
            >
                Add Node
            </button>

            {nodes.map((node) => (
                <Node
                    key={node.id}
                    id={node.id}
                    x={node.x}
                    y={node.y}
                    label={node.label}
                    onDrag={handleNodeDrag}
                    onEdgeSelect={handleEdgeSelect}
                />
            ))}
            <svg className="absolute w-full h-full pointer-events-none">
                {connections.map((connection, idx) => {
                    const sourceNode = nodes.find((n) => n.id === connection.source.nodeId)!;
                    const targetNode = nodes.find((n) => n.id === connection.target.nodeId)!;

                    // Calculate edge positions
                    const getEdgePosition = (node: NodeType, edge: string) => {
                        switch (edge) {
                            case "top":
                                return { x: node.x + 64, y: node.y };
                            case "bottom":
                                return { x: node.x + 64, y: node.y + 64 };
                            case "left":
                                return { x: node.x, y: node.y + 32 };
                            case "right":
                                return { x: node.x + 128, y: node.y + 32 };
                            default:
                                return { x: node.x, y: node.y };
                        }
                    };

                    const sourcePos = getEdgePosition(sourceNode, connection.source.edge);
                    const targetPos = getEdgePosition(targetNode, connection.target.edge);

                    // Calculate the middle of the connection for the remove button
                    const midPoint = {
                        x: (sourcePos.x + targetPos.x) / 2,
                        y: (sourcePos.y + targetPos.y) / 2,
                    };

                    return (
                        <React.Fragment key={idx}>
                            <Connection source={sourcePos} target={targetPos} />
                            <foreignObject
                                x={midPoint.x - 10}
                                y={midPoint.y - 10}
                                width={20}
                                height={20}
                                className="pointer-events-auto"
                            >
                                <button
                                    className="bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs"
                                    onClick={() => removeConnection(idx)}
                                >
                                    ✕
                                </button>
                            </foreignObject>
                        </React.Fragment>
                    );
                })}
            </svg>
        </div>
    );
};

export default Canvas;
