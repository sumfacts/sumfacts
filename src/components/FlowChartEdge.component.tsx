import React from 'react';
import {
  EdgeText,
  getEdgeCenter,
  getMarkerEnd,
  getBezierPath,
} from 'react-flow-renderer';

export const FlowChartEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  label,
  arrowHeadType,
  markerEndId,
  labelStyle,
  labelBgStyle,
  labelBgPadding,
  labelBgBorderRadius,
}: any) => {
  const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  const edgeCenter = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY
  });
  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={style}
      />
      <EdgeText
        x={edgeCenter[0]}
        y={edgeCenter[1]}
        label={label}
        labelStyle={labelStyle}
        labelBgStyle={labelBgStyle}
        labelBgPadding={labelBgPadding}
        labelBgBorderRadius={labelBgBorderRadius}
      />
    </>
  );
}
