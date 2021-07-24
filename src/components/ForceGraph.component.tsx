import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import ContainerDimensions from 'react-container-dimensions';

import { COLORS } from '../constants';

const initialState = {
  nodes: [],
  links: [],
};

export const ForceGraph: React.FC = () => {
  const [graph, setGraph] = useState<any>(initialState);
  const intervalRef = useRef<any>(null);
  const [renderKey, setRenderKey] = useState(0);

  const handleAddGraphElements = useCallback(() => {
    setGraph(({ nodes, links }: any) => {
      const id = nodes.length;

      if (id > 100) return initialState;

      const getSource = () => Math.floor(Math.random() * id);

      const nextEdges = [
        ...links,
        { source: getSource(), target: id },
        { source: id + 1, target: id },
      ];

      if (Math.random() < 0.5) {
        nextEdges.push({ source: getSource(), target: id + 1 });
      }

      const nextGraph = {
        nodes: [
          ...nodes,
          { id, val: 1 },
          { id: id + 1, val: 1 },
        ],
        links: nextEdges,
      };

      return nextGraph;
    });
  }, [setGraph]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRenderKey(Math.random());
    }, 2000);
    return () => {
      if (!timeout) return;
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      handleAddGraphElements();
    }, 300);
    return () => {
      if (!intervalRef.current) return;
      clearInterval(intervalRef.current);
    };
  }, [handleAddGraphElements]);

  return (
    <ContainerDimensions key={renderKey}>
      {({ width }) =>
        <ForceGraph2D
          width={width}
          height={600}
          graphData={graph}
          enableZoomInteraction={false}
          enablePanInteraction={false}
          enablePointerInteraction={false}
          nodeColor={() => COLORS.DARK_GREY}
          linkColor={() => COLORS.DARK_GREY}
          nodeRelSize={10}
        />
      }
    </ContainerDimensions>
  );
};
