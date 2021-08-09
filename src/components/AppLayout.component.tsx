import * as React from 'react';
import {
  Typography,
  Space,
  Row,
  Col,
  Layout,
} from 'antd';
import {
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ContainerDimensions from 'react-container-dimensions';

import './AppLayout.component.scss';
import { isMobile } from '../util';

export const AppLayout: React.FC<{ headerContent?: any }> = ({ children, headerContent }): JSX.Element => {
  return (
    <ContainerDimensions>
      {({ width }) => {
        const mobile = isMobile(width);
        return (
          <Layout className="AppLayout">
            <Layout.Header>
              <Row>
                <Col span={8}>
                  <Link to="/" className="logo">
                    <Space>
                      <ThunderboltOutlined />
                      <strong>SumFacts</strong>
                      {!mobile && <span>
                        <Typography.Text type="secondary">| </Typography.Text>
                        <Typography.Text type="secondary" style={{ fontSize: '0.9em' }}>fight fake-news</Typography.Text>
                      </span>}
                    </Space>
                  </Link>
                </Col>
                <Col span={16} style={{ textAlign: 'right' }}>
                  {headerContent}
                </Col>
              </Row>
            </Layout.Header>
            <Layout.Content className="AppLayout-content">
              {children}
            </Layout.Content>
          </Layout>
        );
      }}
    </ContainerDimensions>
  );
};
