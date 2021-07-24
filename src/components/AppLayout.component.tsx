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

import './AppLayout.component.scss';

export const AppLayout: React.FC<{ headerContent?: any }> = ({ children, headerContent }): JSX.Element => (
  <Layout className="AppLayout">
    <Layout.Header>
      <Row>
        <Col span={12}>
          <Link to="/" className="logo">
            <Space>
              <ThunderboltOutlined />
              <strong>SumFacts</strong>
              <span className="hide-md">
                <Typography.Text type="secondary">| </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: '0.9em' }}>fight fake-news</Typography.Text>
              </span>
            </Space>
          </Link>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          {headerContent}
        </Col>
      </Row>
    </Layout.Header>
    <Layout.Content className="AppLayout-content">
      {children}
    </Layout.Content>
  </Layout>
);
