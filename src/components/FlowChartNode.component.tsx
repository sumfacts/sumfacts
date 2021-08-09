import React, { useState, useCallback, useMemo } from 'react';
import {
  Space,
  Badge,
  Dropdown,
  Menu,
  Tag,
} from 'antd';
import { LinkOutlined, ThunderboltOutlined, MoreOutlined, ExportOutlined } from '@ant-design/icons';
import {
  Handle,
  Position,
} from 'react-flow-renderer';
import TextareaAutosize from 'react-textarea-autosize';

import './FlowChartNode.component.scss';
import { COLORS } from '../constants';

const HANDLE_SIZE = 24;

const PLACEHOLDERS = {
  text: 'enter statement',
  link: 'paste url',
  argument: 'paste argument id',
};

const ActionsDropdown = React.memo<{data: any; value: any; children: any}>(({ data, children, value }) => {
  const handleChangeType = useCallback((type: string) => () => {
    data.onChangeType(type);
  }, [data]);

  const handleOpenTab = useCallback((url: string) => () => {
    const newTab = window.open(url, '_blank');
    if (newTab) newTab.focus();
  }, []);

  return (
    <Dropdown
      placement="bottomRight"
      overlay={
        <Menu>
          {data.type === 'link' && Boolean(value?.length) &&
            <Menu.Item onClick={handleOpenTab(value)}>
              <Space>
                open link
                <ExportOutlined style={{ color: COLORS.LINK }} />
              </Space>
            </Menu.Item>
          }
          {/* {data.type === 'argument' && Boolean(value?.length) &&
            <Menu.Item onClick={data.onExpand}>
              expand
            </Menu.Item>
          } */}
          {data.type === 'argument' && Boolean(value?.length) &&
            <Menu.Item onClick={handleOpenTab(`/ipns/${value}`)} style={{ color: COLORS.ARGUMENT }}>
              <Space>
                open argument
                <ExportOutlined />
              </Space>
            </Menu.Item>
          }
          <Menu.SubMenu title="change type">
            {data.type !== 'text' &&
              <Menu.Item onClick={handleChangeType('text')}>
                <Badge color={COLORS.TEXT} text="text" />
              </Menu.Item>
            }
            {data.type !== 'link' &&
              <Menu.Item onClick={handleChangeType('link')}>
                <Badge color={COLORS.LINK} text="link" />
              </Menu.Item>
            }
            {data.type !== 'and' &&
              <Menu.Item onClick={handleChangeType('and')}>
                <Badge color={COLORS.AND} text="and" />
              </Menu.Item>
            }
            {data.type !== 'or' &&
              <Menu.Item onClick={handleChangeType('or')}>
                <Badge color={COLORS.OR} text="or" />
              </Menu.Item>
            }
            {data.type !== 'argument' &&
              <Menu.Item onClick={handleChangeType('argument')}>
                <Badge color={COLORS.ARGUMENT} text="argument" />
              </Menu.Item>
            }
          </Menu.SubMenu>
          <Menu.Item onClick={data.onRemove}>
            delete
          </Menu.Item>
        </Menu>
      }
    >
      {children}
    </Dropdown>
  );
});

export const FlowChartNode = React.memo<{ data: any, isConnectable: boolean }>(({ data, isConnectable }) => {
  const [value, setValue] = useState(data.label);
  // const [prevKey, setPrevKey] = useState<any>(null);

  const handleChange = useCallback((event) => {
    setValue(event.target.value);
    data.onChange(event);
  }, [data]);

  const handleOpenTab = useCallback((url: string) => () => {
    const newTab = window.open(url, '_blank');
    if (newTab) newTab.focus();
  }, []);

  // const handleKeyUp = useCallback((event) => {
  //   if (event.keyCode === KEYS.BACKSPACE) {
  //     if (value.length) {
  //       setPrevKey(null);
  //     } else if (prevKey === KEYS.BACKSPACE) {
  //       data.onRemove();
  //     } else {
  //       setPrevKey(event.keyCode)
  //     }
  //   } else {
  //     setPrevKey(event.keyCode)
  //   }
  // }, [data, value, prevKey]);

  const isAndOrOr = useMemo(() => ['and', 'or'].includes(data.type), [data]);

  return (
    <div className={`FlowChartNode FlowChartNode--${data.type}`}>
      <Handle
        type="target"
        position={Position.Right}
        isConnectable={isConnectable}
        className="FlowChartNode__handle FlowChartNode__handle--target"
        style={{
          height: isAndOrOr ? HANDLE_SIZE : HANDLE_SIZE * 1.4,
          zIndex: isAndOrOr ? 9 : -1,
          right: -HANDLE_SIZE/2,
        }}
      />

      {data.type === 'and' &&
        <ActionsDropdown
          value={value}
          data={data}
        >
          <Tag className="FlowChartNode__tag">AND</Tag>
        </ActionsDropdown>
      }

      {data.type === 'or' &&
        <ActionsDropdown
          value={value}
          data={data}
        >
          <Tag className="FlowChartNode__tag">OR</Tag>
        </ActionsDropdown>
      }

      {['text', 'link', 'argument'].includes(data.type) &&
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ActionsDropdown
            value={value}
            data={data}
          >
            <div style={{ paddingLeft: 12 }}>
              <MoreOutlined />
            </div>
          </ActionsDropdown>
            <TextareaAutosize
              placeholder={PLACEHOLDERS[data.type as 'text' | 'link' | 'argument']}
              // placeholder={prevKey === KEYS.BACKSPACE ?  'backspace to delete' : PLACEHOLDERS[data.type as 'text' | 'link' | 'argument']}
              onChange={handleChange}
              // onKeyUp={handleKeyUp}
              value={value}
              autoFocus={data.autoFocus}
              className="FlowChartNode__input"
            />

            {data.type === 'link' && Boolean(value?.length) &&
              <LinkOutlined style={{ padding: 16 }} onClick={handleOpenTab(value)} />
            }
            {data.type === 'argument' && Boolean(value?.length) &&
              <ThunderboltOutlined style={{ padding: 16 }} onClick={handleOpenTab(`/ipns/${value}`)} />
            }
        </div>
      }

      <Handle
        type="source"
        position={Position.Left}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
        className="FlowChartNode__handle FlowChartNode__handle--source"
        style={{
          left: -HANDLE_SIZE/2,
        }}
      />
    </div>
  );
});
