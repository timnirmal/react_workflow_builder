import React, { useState, useEffect, useRef } from "react";
import Node from "./Node";
import Connection from "./Connection";
import { v4 as uuidv4 } from "uuid";

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
    const [tempEdge, setTempEdge] = useState<{
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    } | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<{
        nodeId: string;
        edge: string;
    } | null>(null);

    // For demo: dark mode toggle
    const [isDarkMode, setIsDarkMode] = useState(false);

    const nodeCounter = useRef(1); // Fixed counter for node labels

    useEffect(() => {
        console.log("Nodes:", JSON.stringify(nodes, null, 2));
        console.log("Connections:", JSON.stringify(connections, null, 2));
    }, [nodes, connections]);

    const addNode = () => {
        const id = `node-${uuidv4()}`;
        const label = `Node ${nodeCounter.current}`;
        setNodes((prev) => [
            ...prev,
            {
                id,
                x: 100,
                y: 100 + prev.length * 50,
                label,
            },
        ]);
        nodeCounter.current += 1;
    };

    const handleNodeDrag = (id: string, x: number, y: number) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) => (node.id === id ? { ...node, x, y } : node))
        );
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (selectedEdge) {
            setTempEdge((prevTempEdge) => {
                if (!prevTempEdge) return null;
                return {
                    ...prevTempEdge,
                    x2: e.clientX,
                    y2: e.clientY,
                };
            });
        }
    };

    const handleMouseDownCanvas = (e: React.MouseEvent<HTMLDivElement>) => {
        // If user clicked the canvas, reset selection
        if (e.target === e.currentTarget) {
            setTempEdge(null);
            setSelectedEdge(null);
        }
    };

    const deleteNode = (id: string) => {
        setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
        setConnections((prevConnections) =>
            prevConnections.filter(
                (conn) =>
                    conn.source.nodeId !== id && conn.target.nodeId !== id
            )
        );
    };

    const deleteConnection = (index: number) => {
        setConnections((prevConnections) =>
            prevConnections.filter((_, i) => i !== index)
        );
    };

    useEffect(() => {
        console.log("Updated Connections:", JSON.stringify(connections, null, 2));
    }, [connections]);

    useEffect(() => {
        console.log("Selected Edge Updated:", selectedEdge);
    }, [selectedEdge]);

    const handleEdgeSelect = (
        nodeId: string,
        edge: "top" | "bottom" | "left" | "right"
    ) => {
        const node = nodes.find((n) => n.id === nodeId);

        if (selectedEdge) {
            // Finalize connection
            setConnections((prevConnections) => [
                ...prevConnections,
                {
                    source: selectedEdge,
                    target: { nodeId, edge },
                },
            ]);
            setTempEdge(null);
            setSelectedEdge(null);
        } else if (node) {
            // First edge selection
            const startEdgePosition = getEdgePosition(node, edge);
            setSelectedEdge({ nodeId, edge });
            setTempEdge({
                x1: startEdgePosition.x,
                y1: startEdgePosition.y,
                x2: startEdgePosition.x,
                y2: startEdgePosition.y,
            });
        }
    };

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

    return (
        <div
            className={`relative w-full h-full transition-colors duration-300 ${
                isDarkMode ? "dark" : ""
            }`}
        >
            {/* Controls */}
            <div className="absolute top-2 left-2 flex space-x-2 z-10">
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md"
                    onClick={addNode}
                >
                    Add Node
                </button>
                <button
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white px-4 py-2 rounded shadow-md"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                >
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
            </div>

            {/* Main canvas area */}
            <div
                className="relative w-full h-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDownCanvas}
            >
                {nodes.map((node) => (
                    <Node
                        key={node.id}
                        id={node.id}
                        x={node.x}
                        y={node.y}
                        label={node.label}
                        onDrag={handleNodeDrag}
                        onEdgeSelect={handleEdgeSelect}
                        onDelete={deleteNode}
                        highlightEdge={!!selectedEdge}
                    />
                ))}

                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Draw existing connections */}
                    {connections.map((connection, idx) => {
                        const sourceNode = nodes.find(
                            (n) => n.id === connection.source.nodeId
                        )!;
                        const targetNode = nodes.find(
                            (n) => n.id === connection.target.nodeId
                        )!;
                        const sourcePos = getEdgePosition(sourceNode, connection.source.edge);
                        const targetPos = getEdgePosition(targetNode, connection.target.edge);

                        const midX = (sourcePos.x + targetPos.x) / 2;
                        const midY = (sourcePos.y + targetPos.y) / 2;

                        return (
                            <React.Fragment key={idx}>
                                <Connection source={sourcePos} target={targetPos} />
                                {/* Delete button */}
                                <foreignObject
                                    x={midX - 10}
                                    y={midY - 10}
                                    width={20}
                                    height={20}
                                    className="pointer-events-auto"
                                >
                                    <button
                                        className="w-full h-full bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteConnection(idx);
                                        }}
                                    >
                                        X
                                    </button>
                                </foreignObject>
                            </React.Fragment>
                        );
                    })}

                    {/* Temporary connection line */}
                    {tempEdge && (
                        <line
                            x1={tempEdge.x1}
                            y1={tempEdge.y1}
                            x2={tempEdge.x2}
                            y2={tempEdge.y2}
                            stroke="blue"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                        />
                    )}
                </svg>
            </div>
        </div>
    );
};

export default Canvas;
