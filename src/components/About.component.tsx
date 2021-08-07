import { FC, useCallback } from 'react';
import {
  Button,
  Image,
  Modal,
  Typography,
  Space,
  Row,
  Col,
} from 'antd';
import {
  ThunderboltOutlined,
} from '@ant-design/icons';

import './About.component.scss';

const { Title, Text } = Typography;

export const About: FC<{ onClose: () => void }> = ({ onClose }): JSX.Element => {
  const handleIpfs = useCallback(() => {
    const newTab = window.open('https://ipfs.io/', '_blank');
    if (newTab) newTab.focus();
  }, []);

  const handleGithub = useCallback(() => {
    const newTab = window.open('https://github.com/sumfacts/sumfacts', '_blank');
    if (newTab) newTab.focus();
  }, []);

  return (
    <Modal
      visible
      footer={null}
      onCancel={onClose}
      width="80%"
    >
      <Space size="large" direction="vertical">

        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <div style={{ maxWidth: 600 }}>
            <Title level={3} style={{ fontWeight: 400 }}><Text strong>SumFacts.</Text> Create logical arguments as diagrams with an open-source editor. Store them in a secure peer-to-peer network. Share them simply by pasting a link.</Title>
          </div>
        </div>

        <Image
          width="100%"
          src="/about-banner.png"
          preview={false}
          style={{ paddingBottom: 100 }}
        />

        <Row>
          <Col md={8} style={{ padding: 50 }}>
            <Space direction="vertical" size="middle">
              <Title level={4}>Decentralized</Title>
              <Text>All data is <Text strong>stored</Text> on a distributed, peer-to-peer network that can't be attacked or censored. Anybody can access the data at any time.</Text>
              <Button type="ghost" size="small" onClick={handleIpfs}>IPFS</Button>
            </Space>
          </Col>

          <Col md={8} style={{ padding: 50 }}>
            <Space direction="vertical" size="middle">
              <Title level={4}>Open-source</Title>
              <Text>This app you are using is completely open-source - anyone can freely download it, run it and audit it. Which means everybody has access to create data in the network.</Text>
              <Button type="ghost" size="small" onClick={handleGithub}>Github</Button>
            </Space>
          </Col>
          <Col md={8} style={{ padding: 50 }}>
            <Space direction="vertical" size="middle">
              <Title level={4}>Shareable</Title>
              <Text>Arguments can be shared by simply copying and pasting a link. They can also be exported, downloaded (jpeg/json) and imported again.</Text>
            </Space>
          </Col>

        </Row>

        <Row>
          {/* <Col md={8} style={{ padding: 50 }}>
            <Space direction="vertical" size="middle">
              <Title level={4}>Intuitive</Title>
              <Text>The argument builder is designed to make it as easy as possible to quickly formulate arguments. The goal is to give you more time thinking about difficult concepts.</Text>
            </Space>
          </Col> */}
        </Row>

        <Image
          width="100%"
          src="/network.gif"
          preview={false}
        />

        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <Space direction="vertical" style={{ textAlign: 'center' }}>
            <Title level={3} style={{ fontWeight: 400 }}>
              Struggling to explain a complex topic?
            </Title>
            <Button type="ghost" size="large" onClick={onClose}>get started now</Button>
          </Space>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Text>
            <Space>
              <ThunderboltOutlined />
              <Text strong>SumFacts</Text>
              <Text type="secondary">{' | fight fake-news'}</Text>
            </Space>
          </Text>
        </div>

      </Space>

    </Modal>
  );
};
