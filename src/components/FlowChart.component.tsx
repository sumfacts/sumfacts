import { forwardRef, useImperativeHandle, useEffect, useRef, useState, useCallback } from 'react';
import { findIndex, pick, merge } from 'lodash';
import { Typography } from 'antd';
import { nanoid } from 'nanoid';
import ReactFlow, {
  removeElements,
  addEdge,
  Controls,
  Background,
  isEdge,
  BackgroundVariant,
} from 'react-flow-renderer';
import domtoimage from "dom-to-image";

import { isValidUrl } from '../util';
import { COLORS, VERSION } from '../constants';
import { FlowChartEdge } from './FlowChartEdge.component';
import { FlowChartNode } from './FlowChartNode.component';

const EDGE_TYPES = {
  support: {
    label: 'support',
    labelStyle: {
      fill: COLORS.DARK_GREY,
    },
    labelBgStyle: {
      fill: 'white',
    },
    style: {
      stroke: COLORS.DARK_GREY,
    },
  },
  oppose: {
    label: 'oppose',
    labelStyle: {
      fill: COLORS.RED,
    },
    labelBgStyle: {
      fill: 'white',
    },
    style: {
      stroke: COLORS.RED,
    },
  },
  unknown: {
    label: 'unknown',
    labelStyle: {
      fill: COLORS.ORANGE,
    },
    labelBgStyle: {
      fill: 'white',
    },
    style: {
      stroke: COLORS.ORANGE,
    },
  },
};

const DEFAULT_EDGE_PROPS = {
  type: 'custom',
  animated: true,
  ...EDGE_TYPES.support,
};

export const FlowChart = forwardRef<any, { argument?: any; onChange: (exportData: string) => void}>(({ argument, onChange }, ref) => {
  const [elements, setElements] = useState<any[]>([]);
  const [showControls, setShowControls] = useState(true);
  const instanceRef = useRef<any>({});
  const containerRef = useRef<any>();

  const handleUpdateElement = useCallback((elementToUpdate) => {
    setElements((elements) =>
      elements.map((element) => {
        if (element.id === elementToUpdate.id){
          return merge({}, element, elementToUpdate);
        }
        return element;
      })
    );
  }, [setElements]);

  const getDefaultNodeProps = useCallback((element: any) => {
    const id = element.id || nanoid();
    return merge(
      {
        id,
        type: 'custom',
        data: {
          label: '',
          type: 'text',
          autoFocus: true,
          onChange: (event: any) => {
            setElements((els) =>
              els.map((element) => {
                if (element.id === id) {
                  const { value } = event.target;
                  element.data.label = value;
                  if (isValidUrl(value)) {
                    element.data.type = 'link';
                  }
                }
                return element;
              })
            )
          },
          onRemove: () => {
            setElements((els) => els.filter((element) => element.id !== id));
          },
          onExpand: () => {
            console.log('expand');
          },
          onChangeType: (type: string) => {
            setElements((els) =>
              els.map((element) => {
                if (element.id === id) {
                  handleUpdateElement({ id, data: { type } });
                }
                return element;
              })
            )
          },
        },
      },
      element
    );
  }, [handleUpdateElement]);

  const getDefaultEdgeProps = useCallback((element) =>
    merge(
      {},
      DEFAULT_EDGE_PROPS,
      EDGE_TYPES[element.label as 'support' | 'oppose'],
      element,
    )
  , []);

  useEffect(() => {
    const newElements = (argument?.elements || []).map((element: any) =>
      (element.source) ?
        getDefaultEdgeProps(element) :
        getDefaultNodeProps(element)
    );
    setElements(() => newElements);
    setTimeout(() => {
      instanceRef.current.fitView();
    }, 500);
  }, [argument?.elements, getDefaultEdgeProps, getDefaultNodeProps]);

  const handleLoad = useCallback((reactFlowInstance) => {
    instanceRef.current = reactFlowInstance;
    if (elements.length) {
      setTimeout(() => {reactFlowInstance.fitView()}, 500);
    }
  }, [elements.length]);

  const handlePaneDoubleClick = useCallback(async (event) => {
    const { target, clientX, clientY } = event;
    const rect = target.getBoundingClientRect();
    const position = instanceRef.current.project({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
    const id: any = nanoid();
    const newNode = getDefaultNodeProps({
      id,
      position,
    });
    setTimeout(() => setElements(() => [...elements, newNode]));
  }, [elements, setElements, getDefaultNodeProps]);

  const handleChangeEdgeType = useCallback((edge) => {
    setElements((els) =>
    els.map((element) => {
      if (element.id === edge.id) {
        const existingEdge = els.filter(({ id }) => edge.id !== id)[0];
        const edgeTypes = Object.values(EDGE_TYPES);
        const currentEdgeTypeIndex = findIndex(edgeTypes, ({ label }) => label === element.label);
        const edgeTypeCount = edgeTypes.length;
        const nextEdgeTypeIndex = currentEdgeTypeIndex > 0 ? currentEdgeTypeIndex - 1 : edgeTypeCount - 1;
        return merge(
          {},
          element,
          DEFAULT_EDGE_PROPS,
          pick(existingEdge, ['data', 'position', 'type']),
          edgeTypes[nextEdgeTypeIndex]
        );
      }
      return element;
    }));

  }, [setElements]);

  const handleElementClick = useCallback((event, element) => {
    if (isEdge(element)) {
      handleChangeEdgeType(element);
    }
  }, [handleChangeEdgeType]);

  const handleElementDoubleClick = useCallback((event, element) => {
    event.stopPropagation();
  }, []);

  const onElementsRemove = useCallback((elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els)),
    []
  );

  const handleConnect = useCallback(
    (params) => {
      setElements((els) => addEdge({
        ...params,
        ...DEFAULT_EDGE_PROPS,
        id: nanoid(),
      }, els));
    },
    []
  );

  useImperativeHandle(ref, () => ({
    toObject: async (saveImage = false) => {
      if (!instanceRef.current.getElements) return;
      const rawData = instanceRef.current.toObject();
      const elements = rawData.elements.map((element: any) => {
        if (isEdge(element)) {
          return pick(element, ['id', 'source', 'target', 'label']);
        }
        return pick(element, ['id', 'position.x', 'position.y', 'data.label', 'data.type']);
      });

      if (saveImage) {
        setShowControls(false);
        setTimeout(async () => {
          const dataUrl: string = await domtoimage.toJpeg(containerRef.current, { quality: 1 });
          const link = document.createElement("a");
          link.download = "my-image-name.jpeg";
          link.href = dataUrl;
          link.click();
          setShowControls(true);
        }, 100);
      }

      const exportData = {
        "$schema": `https://raw.githubusercontent.com/sumfacts/sumfacts/master/src/schema/v${VERSION}/argument.json`,
        ...rawData,
        elements,
      };

      return exportData;
    },
  }), []);

  const handleStopPropagation = useCallback((...args) => {
    console.log(args);
  }, []);

  return (
    <div
      style={{ flex: 1, position: 'relative', background: 'ghostwhite' }}
      onDoubleClick={handlePaneDoubleClick}
      ref={containerRef}
    >
      {!elements.length &&
        <Typography.Title
          level={3}
          style={{
            textAlign: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
          }}
          type="secondary"
        >
          double-click to start building your argument
        </Typography.Title>
      }
      <ReactFlow
        elements={elements as any}
        onElementClick={handleElementClick}
        onElementsRemove={onElementsRemove}
        onConnect={handleConnect}
        onNodeDoubleClick={handleElementDoubleClick}
        onLoad={handleLoad}
        snapToGrid
        edgeTypes={{ custom: FlowChartEdge }}
        nodeTypes={{ custom: FlowChartNode }}
        zoomOnDoubleClick={false}
      >
        {showControls && <Controls showInteractive={false} />}
        <Background variant={BackgroundVariant.Lines} />
      </ReactFlow>
    </div>
  );
});
