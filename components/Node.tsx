// Node.tsx
import React, { useState } from "react";

interface NodeProps {
    id: string;
    x: number;
    y: number;
    label: string;
    onDrag: (id: string, x: number, y: number) => void;
    onEdgeSelect: (id: string, edge: "top" | "bottom" | "left" | "right") => void;
    onDelete: (id: string) => void;
    highlightEdge: boolean; // Whether to highlight edges
}

const Node: React.FC<NodeProps> = ({
                                       id,
                                       x,
                                       y,
                                       label,
                                       onDrag,
                                       onEdgeSelect,
    onDelete,
    highlightEdge
                                   }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent parent handlers from firing
        e.preventDefault(); // Prevent text selection or default browser behavior
        setIsDragging(true);
        setOffset({ x: e.clientX - x, y: e.clientY - y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault(); // Prevent text selection while dragging
        onDrag(id, e.clientX - offset.x, e.clientY - offset.y);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Highlight the edge UI if there's an active selection
    const edgeClass = highlightEdge
        ? "bg-blue-500 animate-pulse"
        : "bg-red-500";

    return (
        <div
    className={`absolute bg-blue-500 text-white font-bold rounded-lg shadow-md w-32 h-16 flex items-center justify-center ${
        isDragging ? "cursor-grabbing" : "cursor-move"
    } select-none`}
            style={{ top: y, left: x }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // Stop dragging if the mouse leaves the node
        >
            {label}
            {/* Delete Button */}
                        <button
                className="absolute -top-3 -right-3 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id); // Call delete function
                }}
            >
                X
            </button>

            {/* Edge Buttons */}
            <button
                className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${edgeClass} text-white w-4 h-4 rounded-full`}
                onClick={(e) => {
                    e.stopPropagation();
                    onEdgeSelect(id, "top");
                }}
            />

            {/* Bottom Edge */}
            <button
                className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 ${edgeClass} text-white w-4 h-4 rounded-full`}
                onClick={(e) => {
                    e.stopPropagation();
                    onEdgeSelect(id, "bottom");
                }}
            />

            {/* Left Edge */}
            <button
                className={`absolute top-1/2 -left-3 transform -translate-y-1/2 ${edgeClass} text-white w-4 h-4 rounded-full`}
                onClick={(e) => {
                    e.stopPropagation();
                    onEdgeSelect(id, "left");
                }}
            />

            {/* Right Edge */}
            <button
                className={`absolute top-1/2 -right-3 transform -translate-y-1/2 ${edgeClass} text-white w-4 h-4 rounded-full`}
                onClick={(e) => {
                    e.stopPropagation();
                    onEdgeSelect(id, "right");
                }}
            />
        </div>
    );
};

export default Node;
