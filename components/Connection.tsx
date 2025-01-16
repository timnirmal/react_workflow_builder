import React from "react";

interface Position {
    x: number;
    y: number;
}

interface ConnectionProps {
    source: Position;
    target: Position;
}

const Connection: React.FC<ConnectionProps> = ({ source, target }) => {
    return (
        <line
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-700 dark:text-gray-200"
        />
    );
};

export default Connection;
