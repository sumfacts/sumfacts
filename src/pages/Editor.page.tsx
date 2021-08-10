import { useMemo, useRef, useEffect, useState, FC, useCallback } from 'react';
import {
  Tooltip,
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
import ContainerDimensions from 'react-container-dimensions';
import { RouteComponentProps } from 'react-router';
import { nanoid } from 'nanoid';
import { useHistory, useLocation } from 'react-router-dom';
import { parse as pasreQueryString } from 'query-string';
import Ajv from 'ajv';

import { AppLayout } from '../components/AppLayout.component';
import { About } from '../components/About.component';
import { Spin } from '../components/Spin.component';
import { FlowChart } from '../components/FlowChart.component';
import { useIpfs } from '../hooks/useIpfs.hook';
import { download, copy, parse } from '../util';
import { COLORS } from '../constants';
import argumentSchema from '../schema/v1/argument.json';
import { isMobile } from '../util';

const SAVE_IMAGE = true;

const ajv = new Ajv();
const validate = ajv.compile(argumentSchema);

export const EditorPage: FC<RouteComponentProps<{ id?: string }>> = ({ match }): JSX.Element | null => {
  const [showAbout, setShowAbout] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [initialArgument, setInitialArgument] = useState<any>(null);
  const { create, resolve, update, ready, init /*, initError as ipfsInitError*/ } = useIpfs();
  const { push } = useHistory();
  const currentIdRef = useRef<string | null>(null);
  const flowchartRef = useRef<any>();
  const { search, pathname } = useLocation();
  const [secret, setSecret] = useState('');
  const [secretDialogIsVisible, setSecretDialogIsVisible] = useState(false);
  const [infoDialogIsVisible, setInfoDialogIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(match.params.id));

  const handleResetArgument = useCallback((arg: any) => {
    setInitialArgument(arg);
    setTitle(arg?.title);
  }, []);

  const handleUpload = useCallback(({ file }: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file.originFileObj, "UTF-8");
    fileReader.onload = (e: any) => {
      try {
        const arg = JSON.parse(e.target.result);
        const valid = validate(arg);
        if (!valid) throw new Error('invalid JSON imported');
        handleResetArgument(arg);
      } catch (error) {
        notification.error({
          message: `Problem importing: ${error.message}.`,
          style: {},
        });
      }
    };
  }, [handleResetArgument]);

  useEffect(() => {
    init();
  });

  const searchQuery = useMemo(() => pasreQueryString(search), [search])

  useEffect(() => {
    setShowAbout(searchQuery.about === 'true');
  }, [searchQuery])

  useEffect(() => {
    const handler = async () => {
      setIsLoading(true);
      if (!match.params.id) {
        currentIdRef.current = null;
        setIsLoading(false);
        handleResetArgument(null);
        return;
      }

      if (match.params.id === currentIdRef.current || !ready) {
        setIsLoading(false);
        return;
      }

      try {
        await resolve(match.params.id, handleResetArgument);
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
      currentIdRef.current = match.params.id;
    };
    handler();
  }, [ready, match.params.id, resolve, handleResetArgument]);

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
    const currentArgument = await flowchartRef.current.toObject(saveImage);
    const result = {
      ...currentArgument,
      title,
    };

    const { id } = match.params;
    if (id) {
      result.id = id;
      result.permalink = `/ipns/${id}`;
    }

    return result;
  }, [title, match.params]);

  const handleUpdate = useCallback(async () => {
    setIsSaving(true);
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
    try {
      await update(secret, argument);
    } catch (error) {
      console.error(error);
    }
    setIsSaving(true);
    handleCloseSecretDialog();
  }, [secret, handleGetArgument, update, handleCloseSecretDialog]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
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
    try {
      const { id, secret: newSecret } = await create(argument);
      if (!id || !newSecret) return;
      const permalink = `/ipns/${id}`;
      setInfoDialogIsVisible(true);
      setSecret(newSecret);
      download(`sumfacts_${id}_secret_info`, { permalink, secret: newSecret, id });
      push(permalink);
    } catch (error) {
      console.error(error);
    }
    setIsSaving(false);
  }, [handleGetArgument, create, match.params.id, secret, push, handleUpdate]);

  const handleFork = useCallback(async () => {
    setIsSaving(true);
    const argument = await handleGetArgument();
    if (!match.params.id) {
      notification.error({
        message: 'Cannot fork unsaved argument',
        style: {},
      });
      return;
    }
    delete argument.id;
    try {
      const { id: newId } = await create(argument);
      const newTab = window.open(`/ipns/${newId}`, '_blank');
      if (newTab) newTab.focus();
    } catch (error) {
      console.error(error);
    }
    setIsSaving(false);
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

  const handleUpdateTitle = useCallback((event: any) => {
    setTitle(event.target.value);
  }, []);

  const handleCopySecret = useCallback(() => {
    copy(secret);
    notification.success({
      message: 'Copied to clipboard.',
      style: {},
    });
  }, [secret]);

  return (
    <ContainerDimensions>
      {({ width }) => {
        const mobile = isMobile(width);
        return (
          <AppLayout
            headerContent={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {isLoading && <Tooltip title="loading argument"><Spin /></Tooltip>}

                <div style={{ flexGrow: 1, marginRight: 12 }}>
                  <Input
                    placeholder="enter title"
                    value={title}
                    onChange={handleUpdateTitle}
                    disabled={isSaving || isLoading}
                  />
                </div>

                <Space>
                  {!match.params.id && <Popconfirm
                    placement="bottomRight"
                    title="Are you sure? This can take a few minutes because it takes time to upload to the P2P network."
                    onConfirm={handleSave}
                    okText="ok"
                    cancelText="cancel"
                    icon={<QuestionCircleOutlined style={{ color: COLORS.DARK_GREY }} />}
                    okButtonProps={{ type: 'ghost' }}
                    disabled={isSaving || isLoading}
                  >
                    <Button
                      icon={isSaving ? <Tooltip title="loading argument"><Spin /></Tooltip> : <SaveOutlined /> }
                      disabled={isSaving || isLoading}
                      title="save"
                    >
                      {!mobile && 'save'}
                    </Button>
                  </Popconfirm>}

                  {match.params.id &&
                    <Popconfirm
                      placement="bottomRight"
                      title="Are you sure? This can take a few minutes because it takes time to upload to the P2P network."
                      onConfirm={handleSave}
                      okText="ok"
                      cancelText="cancel"
                      icon={<QuestionCircleOutlined style={{ color: COLORS.DARK_GREY }} />}
                      okButtonProps={{ type: 'ghost' }}
                      disabled={isSaving || isLoading}
                    >
                      <Button
                        icon={isSaving ? <Tooltip title="loading argument"><Spin /></Tooltip> : <SaveOutlined /> }
                        disabled={isSaving || isLoading}
                        title="update"
                      >
                        {!mobile && 'update'}
                      </Button>
                    </Popconfirm>}

                  <Popover
                    placement="bottomRight"
                    content={
                      <List>
                        <List.Item style={{ cursor: 'pointer' }} onClick={handleNew}>
                          <Space>
                            <PlusOutlined />
                            new
                          </Space>
                        </List.Item>
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
                            disabled={isSaving || isLoading}
                          >
                            <Space>
                              {isSaving ? <Tooltip title="loading argument"><Spin /></Tooltip> : <BranchesOutlined />}
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
                        {mobile && <>
                          <List.Item style={{ cursor: 'pointer' }} onClick={handleAbout}>
                            <Space>
                              <QuestionCircleOutlined />
                              about
                            </Space>
                          </List.Item>
                          <List.Item style={{ cursor: 'pointer' }} onClick={handleGithub}>
                            <Space>
                              <GithubOutlined />
                              github
                            </Space>
                          </List.Item>
                        </>}
                      </List>
                    }
                    trigger="click"
                  >
                    <Button>
                      <MoreOutlined />
                    </Button>
                  </Popover>
                  {!mobile && <>
                    <Button
                      style={{
                        fontWeight: 'bold',
                      }}
                      onClick={handleAbout}
                      title="about"
                    >about</Button>
                    <Button
                      icon={<GithubOutlined />}
                      size="large"
                      style={{ border: 'none' }}
                      onClick={handleGithub}
                      title="github"
                    />
                  </>}
                </Space>
              </div>
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
                      <a href={`/ipns/${match.params.id}`} target="_blank" rel="noreferrer">{`${window.location.protocol}//${window.location.host}/ipns/${match.params.id}`}</a>
                    }
                  />
                  <Typography.Text type="secondary">replace{''}
                    <Typography.Text code>{window.location.protocol}{'//'}{window.location.host}</Typography.Text>
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

            <div style={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'row', position: 'relative' }} className="MapPage">
              <div style={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <FlowChart
                  ref={flowchartRef}
                  argument={initialArgument}
                  onChange={setInitialArgument}
                />
              </div>
            </div>
          </AppLayout>
        );
      }}
    </ContainerDimensions>
  );
}
