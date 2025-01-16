import React, { useState } from "react";

interface NodeProps {
    id: string;
    x: number;
    y: number;
    label: string;
    onDrag: (id: string, x: number, y: number) => void;
    onEdgeSelect: (id: string, edge: "top" | "bottom" | "left" | "right") => void;
}

const Node: React.FC<NodeProps> = ({ id, x, y, label, onDrag, onEdgeSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setOffset({ x: e.clientX - x, y: e.clientY - y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        onDrag(id, e.clientX - offset.x, e.clientY - offset.y);
    };

    const handleMouseUp = () => setIsDragging(false);

    return (
        <div
            className="absolute bg-blue-500 text-white font-bold rounded-lg shadow-md w-32 h-16 flex items-center justify-center cursor-move"
            style={{ top: y, left: x }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {label}

            {/* Edge Buttons */}
            <button
                className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white w-4 h-4 rounded-full"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdgeSelect(id, "top");
                }}
            />
            <button
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white w-4 h-4 rounded-full"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdgeSelect(id, "bottom");
                }}
            />
            <button
                className="absolute top-1/2 -left-3 transform -translate-y-1/2 bg-red-500 text-white w-4 h-4 rounded-full"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdgeSelect(id, "left");
                }}
            />
            <button
                className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-red-500 text-white w-4 h-4 rounded-full"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdgeSelect(id, "right");
                }}
            />
        </div>
    );
};

export default Node;
