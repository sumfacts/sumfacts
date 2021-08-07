import { useMemo, useRef, useEffect, useState, FC, useCallback } from 'react';
import {
  Modal,
  Input,
  Popover,
  List,
  notification,
  Button,
  Space,
  Upload,
  Popconfirm,
  Typography,
} from "antd";
import {
  EyeOutlined,
  MoreOutlined,
  DownOutlined,
  BranchesOutlined,
  GithubOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  UpOutlined,
  SaveOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import { nanoid } from 'nanoid';
import { useHistory, useLocation } from 'react-router-dom';
import { parse as pasreQueryString } from 'query-string';
import Ajv from 'ajv';

import { AppLayout } from '../components/AppLayout.component';
import { About } from '../components/About.component';
import { FlowChart } from '../components/FlowChart.component';
import { useIpfs } from '../hooks/useIpfs.hook';
import { download, copy, parse } from '../util';
import { COLORS } from '../constants';
import argumentSchema from '../schema/v1/argument.json';

const SAVE_IMAGE = true;

const ajv = new Ajv();
const validate = ajv.compile(argumentSchema);

export const EditorPage: FC<RouteComponentProps<{ id?: string }>> = ({ match }): JSX.Element | null => {
  const [showAbout, setShowAbout] = useState(false);
  const [argument, setArgument] = useState('');
  const { create, resolve, update, ready, init /*, initError as ipfsInitError*/ } = useIpfs();
  const { push } = useHistory();
  const currentIdRef = useRef<string | null>(null);
  const flowchartRef = useRef<any>();
  const { search, pathname } = useLocation();
  const [secret, setSecret] = useState('');
  const [secretDialogIsVisible, setSecretDialogIsVisible] = useState(false);
  const [infoDialogIsVisible, setInfoDialogIsVisible] = useState(false);

  const handleUpload = useCallback(({ file }: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file.originFileObj, "UTF-8");
    fileReader.onload = (e: any) => {
      try {
        const arg = JSON.parse(e.target.result);
        const valid = validate(arg);
        if (!valid) throw new Error('invalid JSON imported');
        setArgument(arg);
      } catch (error) {
        notification.error({
          message: `Problem importing: ${error.message}.`,
          style: {},
        });
      }
    };
  }, [setArgument]);

  useEffect(() => {
    init();
  });

  const searchQuery = useMemo(() => pasreQueryString(search), [search])

  useEffect(() => {
    setShowAbout(searchQuery.about === 'true');
  }, [searchQuery])

  useEffect(() => {
    const handler = async () => {
      if (!match.params.id) {
        currentIdRef.current = null;
        setArgument('');
        return;
      }

      if (match.params.id === currentIdRef.current || !ready) return;

      try {
        await resolve(match.params.id, setArgument);
      } catch (error) {
        console.log(error);
      }
      // TODO error handling
      currentIdRef.current = match.params.id;
    };
    handler();
  }, [ready, match.params.id, resolve]);

  const handleCloseAbout = useCallback(async () => {
    push(pathname);
  }, [pathname, push]);

  const handleCloseSecretDialog = useCallback(async () => {
    setSecretDialogIsVisible(false);
  }, []);

  const handleShowInfo = useCallback(async () => {
    setInfoDialogIsVisible(true);
  }, []);

  const handleCloseInfoDialog = useCallback(async () => {
    setInfoDialogIsVisible(false);
  }, []);

  const handleChangeSecret = useCallback((event) => {
    setSecret(event.target.value);
  }, []);

  const handleGetArgument = useCallback(async (saveImage?: boolean) => {
    if (!flowchartRef.current) return;
    return await flowchartRef.current.toObject(saveImage);
  }, []);

  const handleUpdate = useCallback(async () => {
    const argument = await handleGetArgument();
    if (!argument?.elements?.length) {
      notification.error({
        message: 'Cant save empty argument.',
        style: {},
      });
      return;
    }
    if (!secret.length) {
      notification.error({
        message: "enter secret",
        style: {},
      });
      return;
    }
    await update(secret, argument);
    handleCloseSecretDialog();
  }, [secret, handleGetArgument, update, handleCloseSecretDialog]);

  const handleSave = useCallback(async () => {
    const argument = await handleGetArgument();
    if (!argument?.elements?.length) {
      notification.error({
        message: 'Cant save empty argument.',
        style: {},
      });
      return;
    }
    if (match.params.id) {
      if (!secret) {
        setSecretDialogIsVisible(true);
      } else {
        handleUpdate();
      }
      return;
    }
    const { name, secret: newSecret } = await create(argument);
    if (!name || !newSecret) return;
    const permalink = `/ipns/${name}`;
    setInfoDialogIsVisible(true);
    setSecret(newSecret);
    download(`sumfacts_${name}_secret_info`, { permalink, secret: newSecret });
    push(permalink);
  }, [handleGetArgument, create, match.params.id, secret, push, handleUpdate]);

  const handleFork = useCallback(async () => {
    const argument = await handleGetArgument();
    if (!match.params.id) {
      notification.error({
        message: 'Cannot fork unsaved argument',
        style: {},
      });
      return;
    }
    const newId = await create(argument);
    const newTab = window.open(`/id/${newId}`, '_blank');
    if (newTab) newTab.focus();
  }, [handleGetArgument, create, match.params.id]);

  const handleExport = useCallback(async () => {
    const argument = await handleGetArgument(SAVE_IMAGE);
    download(`sumfacts_${match.params.id || `_random_${nanoid()}`}`, argument);
    copy(parse(argument));
    notification.success({
      message: 'Downloaded & copied to clipboard.',
      style: {},
    });
  }, [handleGetArgument, match.params.id]);

  const handleAbout = useCallback(() => {
    push(`${pathname}?about=true`);
  }, [pathname, push]);

  const handleNew = useCallback(() => {
    push('/');
  }, [push]);

  const handleGithub = useCallback(() => {
    const newTab = window.open('https://github.com/sumfacts/sumfacts', '_blank');
    if (newTab) newTab.focus();
  }, []);

  // const handleCloseError = useCallback(() => {
  //   setErrorHidden(true);
  // }, []);

  const handleCopySecret = useCallback(() => {
    copy(secret);
    notification.success({
      message: 'Copied to clipboard.',
      style: {},
    });
  }, [secret]);

  return (
    <AppLayout
      headerContent={
        <Space>
          {!match.params.id && <Popconfirm
            placement="bottomRight"
            title="Are you sure?"
            onConfirm={handleSave}
            okText="ok"
            cancelText="cancel"
            icon={<QuestionCircleOutlined style={{ color: COLORS.DARK_GREY }} />}
            okButtonProps={{ type: 'ghost' }}
          >
            <Button
              icon={<SaveOutlined />}
              size="small"
            >
              save
            </Button>
          </Popconfirm>}

          {match.params.id && <Button
            icon={<SaveOutlined />}
            size="small"
            onClick={handleSave}
          >
            update
          </Button>}

          <Button
            icon={<PlusOutlined />}
            size="small"
            onClick={handleNew}
          >
            new
          </Button>

          <Popover
            placement="bottomRight"
            content={
              <List>
                <List.Item style={{ cursor: 'pointer' }}>
                  <Upload
                    onChange={handleUpload}
                    showUploadList={false}
                  >
                    <Space>
                      <UpOutlined />
                      import
                    </Space>
                  </Upload>
                </List.Item>
                <List.Item style={{ cursor: 'pointer' }} onClick={handleExport}>
                  <Space>
                    <DownOutlined />
                    export
                  </Space>
                </List.Item>
                {match.params.id && <List.Item style={{ cursor: 'pointer' }}>
                  <Popconfirm
                    placement="bottomRight"
                    title="This will copy the current argument and save it as a new one."
                    onConfirm={handleFork}
                    okText="ok"
                    cancelText="cancel"
                    icon={<QuestionCircleOutlined style={{ color: COLORS.DARK_GREY }} />}
                    okButtonProps={{ type: 'ghost' }}
                  >
                    <Space>
                      <BranchesOutlined />
                      fork
                    </Space>
                  </Popconfirm>
                </List.Item>}
                {match.params.id && <List.Item style={{ cursor: 'pointer' }} onClick={handleShowInfo}>
                  <Space>
                    <EyeOutlined />
                    show info
                  </Space>
                </List.Item>}
              </List>
            }
            trigger="click"
          >
            <Button size="small">
              <MoreOutlined />
            </Button>
          </Popover>
          <Button
            style={{
              fontWeight: 'bold',
            }}
            size="small"
            onClick={handleAbout}
          >about</Button>
          <Button
            icon={<GithubOutlined />}
            size="large"
            style={{ border: 'none' }}
            onClick={handleGithub}
          />
        </Space>
      }
    >

      {secretDialogIsVisible && <Modal
        visible
        footer={null}
        onCancel={handleCloseSecretDialog}
        maskClosable
        closable={false}
        bodyStyle={{ padding: 0 }}
      >
        <Input
          placeholder="enter secret code"
          value={secret}
          onChange={handleChangeSecret}
          onPressEnter={handleUpdate}
          size="large"
          type="secret"
          autoComplete={`sumfacts_${match.params.id}`}
          style={{
            padding: 16
          }}
          autoFocus
        />
      </Modal>}

      <Modal
        visible={infoDialogIsVisible}
        footer={null}
        onCancel={handleCloseInfoDialog}
        maskClosable
        closable={false}
      >
        <List
          itemLayout="vertical"
          size="large"
        >
          <List.Item>
            <List.Item.Meta
              title={<Typography.Title level={4}>permalink</Typography.Title>}
              description={
                <a href={`/id/${match.params.id}`} target="_blank" rel="noreferrer">{`${window.location.protocol}${window.location.host}/id/${match.params.id}`}</a>
              }
            />
            <Typography.Text type="secondary">replace{''}
              <Typography.Text code>{window.location.host}</Typography.Text>
              with the root url of any other SumFacts client
            </Typography.Text>
          </List.Item>
          <List.Item>
            <List.Item.Meta
              title={<Typography.Title level={4}>secret code</Typography.Title>}
              description={
                secret ?
                  <>
                    <p>
                      <Input
                        value={secret}
                        autoComplete={`sumfacts_${match.params.id}`}
                        addonAfter={
                          secret ?
                            <CopyOutlined
                              onClick={handleCopySecret}
                            /> :
                            null
                        }
                      />
                    </p>
                    <p>
                      <Typography.Text type="danger">
                        N.B.: keep this safe! If you lose it you will not be able to edit this argument again. You will only see this once!
                      </Typography.Text>
                    </p>
                  </> :
                  <Input type="secret" disabled value="1234567890" />
              }
            />
          </List.Item>
        </List>
      </Modal>

      {showAbout && <About onClose={handleCloseAbout} />}

      {/* {ipfsInitError && !errorHidden &&
        <Alert
          message="Problem connecting to peer-to-peer network..."
          type="error"
          closable
          onClose={handleCloseError}
        />
      } */}

      <div style={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'row', position: 'relative' }} className="MapPage">
        <div style={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <FlowChart
            ref={flowchartRef}
            argument={argument}
            onChange={setArgument}
          />
        </div>
      </div>
    </AppLayout>
  );
}
