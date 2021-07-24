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
  GithubOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { noop } from 'lodash';

import './About.component.scss';
import { ForceGraph } from './ForceGraph.component';
import { COLORS } from '../constants';

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

        <Image
          width="100%"
          src="/about-banner.png"
          preview={false}
        />

        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <div style={{ maxWidth: 600 }}>
            <Title level={3} style={{ fontWeight: 400 }}><Text strong>SumFacts</Text> is a revolutionary new way of debating topics online. Create arguments untuitively with an open-source editor and store them in a secure peer-to-peer network. Share them simply by pasting a link.</Title>
          </div>
        </div>

        <Row>
          <Col md={12} style={{ padding: 50, paddingTop: 0 }}>
            <Space direction="vertical" size="middle">
              <Title level={4}>Decentralized</Title>
              <Text>All data is <Text strong>stored</Text> on the InterPlanetary File System (IPFS) which is a distributed, peer-to-peer network that is invulnerable to attack or censorship. All its data is freely available meaning anybody can <Text strong>access</Text> it.</Text>
              <Button type="ghost" size="small" onClick={handleIpfs}>IPFS</Button>
            </Space>
          </Col>

          <Col md={12} style={{ padding: 50, paddingTop: 0 }}>
            <Space direction="vertical" size="middle">
              <Title level={4}>Open-source</Title>
              <Text>This app you are using is completely open-source - anyone can freely download it, run it and audit it. The data can also be <Text strong>edited</Text> by anyone with a computer and an internet connection.</Text>
              <Button type="ghost" size="small" onClick={handleGithub}>Github</Button>
            </Space>
          </Col>
        </Row>

        <Row>
          <Col md={12} style={{ padding: 50, paddingTop: 0 }}>
            <Space direction="vertical" size="middle">
              <Title level={4}>Shareable</Title>
              <Text>Arguments can be shared by simply copying and pasting a link. They can also be exported, downloaded (jpeg/json) and imported again.</Text>
            </Space>
          </Col>

          <Col md={12} style={{ padding: 50, paddingTop: 0 }}>
            <Space direction="vertical" size="middle">
              <Title level={4}>Intuitive</Title>
              <Text>The argument builder is designed to make it as easy as possible to quickly formulate arguments. The goal is to give you more time thinking about difficult concepts.</Text>
            </Space>
          </Col>
        </Row>

        <div style={{ position: 'relative', background: 'ghostwhite' }}>
          <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', top: 290, width: '100%' }}>
            <Title
              level={1}
              style={{ textAlign: 'center', opacity: 0.2 }}
            >
              and whole arguments can be linked together
            </Title>
          </div>

          <ForceGraph />
        </div>

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
