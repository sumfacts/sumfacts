import { useMemo, useRef, useEffect, useState, FC, useCallback } from 'react';
import { message, Button, Space, Upload, Popconfirm } from "antd";
import {
  DownOutlined,
  BranchesOutlined,
  GithubOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import { nanoid } from 'nanoid';
import { useHistory, useLocation } from 'react-router-dom';
import { parse } from 'query-string';
import Ajv from 'ajv';

import { AppLayout } from '../components/AppLayout.component';
import { About } from '../components/About.component';
import { FlowChart } from '../components/FlowChart.component';
import { useIpfs } from '../hooks/useIpfs.hook';
import { download } from '../util';
import { COLORS } from '../constants';
import argumentSchema from '../schema/v1/argument.json';

const SAVE_IMAGE = true;

const ajv = new Ajv();
const validate = ajv.compile(argumentSchema);

export const EditorPage: FC<RouteComponentProps<{ cid?: string }>> = ({ match }): JSX.Element | null => {
  const [showAbout, setShowAbout] = useState(false);
  const [argument, setArgument] = useState('');
  const { send, receive, ready, init /*, initError as ipfsInitError*/ } = useIpfs();
  const { push } = useHistory();
  const currentCidRef = useRef<string | null>(null);
  const flowchartRef = useRef<any>();
  const { search, pathname } = useLocation();

  const handleUpload = useCallback(({ file }: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file.originFileObj, "UTF-8");
    fileReader.onload = (e: any) => {
      try {
        const argument = JSON.parse(e.target.result);
        const valid = validate(argument);
        if (!valid) throw new Error('invalid JSON imported');
        setArgument(argument);
      } catch (error) {
        message.error(`Problem importing: ${error.message}.`)
      }
    };
  }, [setArgument]);

  useEffect(() => {
    init();
  });

  const searchQuery = useMemo(() => parse(search), [search])

  useEffect(() => {
    setShowAbout(searchQuery.about === 'true');
  }, [searchQuery])

  useEffect(() => {
    const handler = async () => {
      const { cid } = match.params;
      if (!cid || cid === currentCidRef.current || !ready) return;
      try {
        const argument = await receive(cid);
        if (argument) {
          setArgument(JSON.parse(argument));
        }
      } catch (error) {
        console.log(error);
      }
      // TODO error handling
      currentCidRef.current = cid;
    };
    handler();
  }, [ready, match.params, receive]);

  const handleCloseAbout = useCallback(async () => {
    push(pathname);
  }, [pathname, push]);

  const handleGetArgument = useCallback(async (saveImage?: boolean) => {
    if (!flowchartRef.current) return;
    const argument = await flowchartRef.current.toObject(saveImage);
    if (!argument.length) {
      message.error('Make an argument first...');
    } else {
      return argument;
    }
  }, []);

  const handleSave = useCallback(async () => {
    const argument = await handleGetArgument();
    const cid = await send(argument);
    const newTab = window.open(`/cid/${cid}`, '_blank');
    if (newTab) newTab.focus();
  }, [handleGetArgument, send]);

  const handleExport = useCallback(async () => {
    const argument = await handleGetArgument(SAVE_IMAGE);
    download(`sumfacts_${match.params.cid || `_${nanoid()}`}`, argument);
  }, [handleGetArgument, match]);

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

  return (
    <AppLayout
      headerContent={
        <Space>
          <Button
            icon={<PlusOutlined />}
            size="small"
            onClick={handleNew}
          >New</Button>
          <Upload onChange={handleUpload} showUploadList={false}>
            <Button
              icon={<UpOutlined />}
              size="small"
            >
              Import
            </Button>
          </Upload>
          <Button
            icon={<DownOutlined />}
            size="small"
            onClick={handleExport}
          >Export</Button>
          <Popconfirm
            placement="bottomRight"
            title="This will copy the current argument and save it as a new one."
            onConfirm={handleSave}
            okText="ok"
            cancelText="cancel"
            icon={<QuestionCircleOutlined style={{ color: COLORS.DARK_GREY }} />}
            okButtonProps={{ type: 'ghost' }}
          >
            <Button
              icon={<BranchesOutlined />}
              size="small"
            >Save</Button>
          </Popconfirm>
          <Button
            style={{
              fontWeight: 'bold',
            }}
            size="small"
            onClick={handleAbout}
          >About</Button>
          <Button
            icon={<GithubOutlined />}
            size="large"
            style={{ border: 'none' }}
            onClick={handleGithub}
          />
        </Space>
      }
    >

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
