import React, { useState, useCallback, useMemo } from 'react';
import {
  Dropdown,
  Menu,
  Tag,
} from 'antd';
import { LinkOutlined, ThunderboltOutlined, MoreOutlined, ArrowRightOutlined } from '@ant-design/icons';
import {
  Handle,
  Position,
} from 'react-flow-renderer';
import TextareaAutosize from 'react-textarea-autosize';

import { COLORS } from '../constants';

const HANDLE_SIZE = 24;
const HANDLE_COLOR = COLORS.DARK_GREY;

const tagStyle = {
  margin: 0,
  zIndex: 2,
  width: HANDLE_SIZE * 2.1,
  height: HANDLE_SIZE,
  background: HANDLE_COLOR,
  borderColor: HANDLE_COLOR,
  color: 'white',
  border: 'none !important',
};

const handleStyle = {
  width: HANDLE_SIZE,
  height: HANDLE_SIZE,
  zIndex: -1,
  border: `1px solid ${HANDLE_COLOR}`,
  borderRadius: HANDLE_SIZE,
  background: 'white',
  transform: `translate(0, -50%)`,
};

const nodeStyle = {
  color: 'rgb(51, 51, 51)',
  border: `1px solid ${HANDLE_COLOR}`,
  zIndex: 3,
  fontFamily: "'Roboto Mono', monospace",
  // padding: 10,
  borderRadius: 4,
  // fontSize: 14,
  background: 'white',
};

const inputStyle = {
  width: 200,
  color: 'rgb(51, 51, 51)',
  border: 'none',
  // width: 200,
  zIndex: 3,
  fontFamily: "'Roboto Mono', monospace",
  padding: 10,
  // borderRadius: 4,
  fontSize: 14,
  background: 'transparent',
  flexGrow: 1,
};

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
            <Menu.Item onClick={handleOpenTab(value)} icon={<ArrowRightOutlined />}>
              open link
            </Menu.Item>
          }
          {/* {data.type === 'argument' && Boolean(value?.length) &&
            <Menu.Item onClick={data.onExpand}>
              expand
            </Menu.Item>
          } */}
          {data.type === 'argument' && Boolean(value?.length) &&
            <Menu.Item onClick={handleOpenTab(`/ipns/${value}`)} icon={<ArrowRightOutlined />}>
              open argument
            </Menu.Item>
          }
          <Menu.SubMenu title="change type">
            {data.type !== 'text' &&
              <Menu.Item onClick={handleChangeType('text')}>
                text
              </Menu.Item>
            }
            {data.type !== 'link' &&
              <Menu.Item onClick={handleChangeType('link')}>
                link
              </Menu.Item>
            }
            {data.type !== 'and' &&
              <Menu.Item onClick={handleChangeType('and')}>
                and
              </Menu.Item>
            }
            {data.type !== 'or' &&
              <Menu.Item onClick={handleChangeType('or')}>
                or
              </Menu.Item>
            }
            {data.type !== 'argument' &&
              <Menu.Item onClick={handleChangeType('argument')}>
                argument
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
    <div style={{ display: 'flex', flex: 1, ...nodeStyle }}>
      <Handle
        type="target"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          ...handleStyle,
          right: -HANDLE_SIZE/2,
          height: isAndOrOr ? HANDLE_SIZE : HANDLE_SIZE * 1.4,
          background: 'white',
          zIndex: isAndOrOr ? 9 : -1,
        }}
      />

      {data.type === 'and' &&
        <ActionsDropdown
          value={value}
          data={data}
        >
          <Tag style={tagStyle}>AND</Tag>
        </ActionsDropdown>
      }

      {data.type === 'or' &&
        <ActionsDropdown
          value={value}
          data={data}
        >
          <Tag style={tagStyle}>OR</Tag>
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
          {/* {data.type === 'text' && */}
            <TextareaAutosize
              placeholder={PLACEHOLDERS[data.type as 'text' | 'link' | 'argument']}
              // placeholder={prevKey === KEYS.BACKSPACE ?  'backspace to delete' : PLACEHOLDERS[data.type as 'text' | 'link' | 'argument']}
              onChange={handleChange}
              // onKeyUp={handleKeyUp}
              value={value}
              autoFocus={data.autoFocus}
              style={{
                ...inputStyle,
                resize: 'none',
                // textAlign: 'center',
                textTransform: 'uppercase',
              }}
            />

            {data.type === 'link' && Boolean(value?.length) &&
              <LinkOutlined style={{ padding: 16 }} onClick={handleOpenTab(value)} />
            }
            {data.type === 'argument' && Boolean(value?.length) &&
              <ThunderboltOutlined style={{ padding: 16 }} onClick={handleOpenTab(`/ipns/${value}`)} />
            }
          {/* }

          {data.type === 'link' &&
            <div
              style={{
                ...inputStyle,
                display: 'flex',
                textOverflow: 'ellipsis',
              }}
            >
              <a
                href={data.label}
                target="_blank" rel="noreferrer"
              >
                <Space>
                  <Typography.Text ellipsis italic style={{ width: 180 }}>{data.label}</Typography.Text>
                  <LinkOutlined />
                </Space>
              </a>
            </div>
          }

          {data.type === 'argument' && Boolean(value?.length) &&
            <div
              style={{
                ...inputStyle,
                display: 'flex',
                textOverflow: 'ellipsis',
              }}
            >
              <a
                href={data.label}
                target="_blank" rel="noreferrer"
              >
                <Space>
                  <Typography.Text ellipsis italic style={{ width: 180 }}>{data.label}</Typography.Text>
                  <ThunderboltOutlined />
                </Space>
              </a>
            </div>
          }

          {data.type === 'argument' && !Boolean(value?.length) &&
            <Input
              prefix={
                <ThunderboltOutlined />
              }
              placeholder={prevKey === KEYS.BACKSPACE ?  'backspace to delete' : "Paste argument ID"}
              onChange={handleChange}
              onKeyUp={handleKeyUp}
              autoFocus={data.autoFocus}
              style={{
                ...inputStyle,
                resize: 'none',
                // textAlign: 'center',
                textTransform: 'uppercase',
              }}
            />
          } */}
        </div>
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
