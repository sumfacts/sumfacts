import React, { useState, useCallback, useMemo } from 'react';
import { Tag, Avatar, Typography } from 'antd';
import {
  Handle,
  Position,
} from 'react-flow-renderer';
import TextareaAutosize from 'react-textarea-autosize';

import { COLORS, KEYS } from '../constants';

const HANDLE_SIZE = 12;
const HANDLE_COLOR = COLORS.DARK_GREY;

const tagStyle = {
  margin: 0,
  zIndex: 2,
  background: HANDLE_COLOR,
  borderColor: HANDLE_COLOR,
  color: 'white',
};

const handleStyle = {
  width: HANDLE_SIZE,
  height: HANDLE_SIZE,
  zIndex: 1,
  border: `1px solid ${HANDLE_COLOR}`,
  borderRadius: HANDLE_SIZE,
  background: 'white',
  transform: `translate(0, -50%)`,
};

const nodeStyle = {
  color: 'rgb(51, 51, 51)',
  border: `1px solid ${HANDLE_COLOR}`,
  width: 200,
  zIndex: 2,
  fontFamily: "'Roboto Mono', monospace",
  padding: 10,
  borderRadius: 4,
  fontSize: 14,
  background: 'white',
};

export const FlowChartNode = React.memo<{ data: any, isConnectable: boolean }>(({ data, isConnectable }) => {
  const [value, setValue] = useState(data.label);
  const [prevKey, setPrevKey] = useState<any>(null);

  const handleChange = useCallback((event) => {
    setValue(event.target.value);
    data.onChange(event);
  }, [data]);

  const handleKeyUp = useCallback((event) => {
    if (event.keyCode === KEYS.BACKSPACE) {
      if (value.length) {
        setPrevKey(null);
      } else if (prevKey === KEYS.BACKSPACE) {
        data.onRemove();
      } else {
        setPrevKey(event.keyCode)
      }
    } else {
      setPrevKey(event.keyCode)
    }
  }, [data, value, prevKey]);

  const isAndOrOr = useMemo(() => ['and', 'or'].includes(data.type), [data]);

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <Handle
        type="target"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          ...handleStyle,
          right: -HANDLE_SIZE/2,
          height: isAndOrOr ? HANDLE_SIZE : HANDLE_SIZE * 3,
          background: isAndOrOr ? HANDLE_COLOR : 'white',
        }}
      />

      {data.type === 'text' &&
        <TextareaAutosize
          placeholder={prevKey === KEYS.BACKSPACE ?  'backspace to delete' : "Statement/link"}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          value={value}
          autoFocus={data.autoFocus}
          style={{
            ...nodeStyle,
            resize: 'none',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        />
      }

      {data.type === 'link' &&
        <div
          style={{
            ...nodeStyle,
            display: 'flex',
          }}
        >
          <div style={{ width: 90 }}>
            <Avatar shape="square" src={data.meta.image} />
          </div>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 4 }}>
              <Typography.Text type="secondary">{data.meta.title}</Typography.Text>
            </div>
            <Typography.Text strong style={{ fontSize: '0.9em' }}>{data.meta.publisher}</Typography.Text>
          </div>
        </div>
      }

      {data.type === 'and' &&
        <Tag style={tagStyle}>AND</Tag>
      }

      {data.type === 'or' &&
        <Tag style={tagStyle}>OR</Tag>
      }

      <Handle
        type="source"
        position={Position.Left}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
        style={{
          ...handleStyle,
          left: -HANDLE_SIZE/2,
          background: HANDLE_COLOR,
        }}
      />
    </div>
  );
});
