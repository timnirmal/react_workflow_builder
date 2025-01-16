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
            stroke="black"
            strokeWidth="2"
        />
    );
};

export default Connection;
