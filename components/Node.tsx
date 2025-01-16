import React, { useState, useRef, useEffect } from "react";

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
                                       highlightEdge,
                                   }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // For context menu:
    const [showMenu, setShowMenu] = useState(false);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

    const nodeRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only handle left-click for dragging
        if (e.button !== 0) return;

        e.stopPropagation();
        e.preventDefault();
        setIsDragging(true);
        setOffset({ x: e.clientX - x, y: e.clientY - y });
        // Hide context menu if open
        setShowMenu(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        onDrag(id, e.clientX - offset.x, e.clientY - offset.y);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

      const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]; // Get the first touch point
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    setOffset({ x: touch.clientX - x, y: touch.clientY - y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0]; // Get the first touch point
    e.preventDefault();
    onDrag(id, touch.clientX - offset.x, touch.clientY - offset.y);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };


    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Show custom context menu at cursor position
        setShowMenu(true);
        setMenuPos({ x: e.clientX, y: e.clientY });
    };

    // Hide menu on click outside
    useEffect(() => {
        const handleGlobalClick = () => {
            setShowMenu(false);
        };

        window.addEventListener("click", handleGlobalClick);
        return () => {
            window.removeEventListener("click", handleGlobalClick);
        };
    }, []);

    // Classes
    const nodeBaseClasses =
        "absolute text-white font-semibold rounded-lg shadow-md w-32 h-16 flex items-center justify-center " +
        "bg-blue-500 dark:bg-blue-600 hover:shadow-lg transition-shadow duration-200";
    const draggingCursor = isDragging ? "cursor-grabbing" : "cursor-move";

    // Highlight the edge UI if there's an active selection
    const edgeClass = highlightEdge
    ? "bg-blue-500 animate-pulse"
    : "bg-red-500";

    return (
        <>
            {/* Node container */}
            <div
                className={`${nodeBaseClasses} ${draggingCursor} select-none`}
                ref={nodeRef}
                style={{ top: y, left: x }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                // Right-click
                onContextMenu={handleContextMenu}
                      onTouchStart={handleTouchStart} // Touch events for mobile
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
            >
                {label}
                {/* Delete Button */}
                <button
                    className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                >
                    X
                </button>

                {/* Edge Buttons */}
                {/* Top Edge */}
                <button
                    className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${edgeClass} text-white w-4 h-4 rounded-full`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdgeSelect(id, "top");
        }}
        onTouchStart={(e) => {
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
        onTouchStart={(e) => {
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
        onTouchStart={(e) => {
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
                            onTouchStart={(e) => {
          e.stopPropagation();
          onEdgeSelect(id, "right");
        }}
                />
            </div>

            {/* Custom Context Menu */}
            {showMenu && (
                <div
                    style={{ top: menuPos.y, left: menuPos.x }}
                    className="fixed z-50 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 text-gray-800 dark:text-gray-200"
                >
                    <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                            console.log(`Edit Node: ${id}`);
                            setShowMenu(false);
                        }}
                    >
                        Edit Node
                    </button>
                    <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                            onDelete(id);
                            setShowMenu(false);
                        }}
                    >
                        Delete Node
                    </button>
                </div>
            )}
        </>
    );
};

export default Node;
