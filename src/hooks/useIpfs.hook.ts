import Ipfs from 'ipfs-core';
import { useContext, useCallback, useRef, useState, useEffect } from 'react';

import { MainContext } from '../context';

// declare var Ipfs: any;
// let ipfs: any = null;

// TODO error handling
export const useIpfs = () => {
  // initialise state variables, React hooks
  const { context, setContext } = useContext(MainContext);
  // const [ipfs, setIpfs] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return function cleanup() {
      if (context.ipfs?.stop) {
        console.log('Stopping IPFS');
        context.ipfs?.stop().catch((error: any) => console.error(error));
        setContext({ ipfs: null });
        setReady(false);
      }
    };
  }, []);

  const connect = useCallback(async () => {
    try {
      console.time('IPFS Started');
      const ipfs = await Ipfs.create(); // initialise IPFS daemon
      setContext({ ipfs });
      setReady(true);
      console.timeEnd('IPFS Started');
    } catch (error) {
      console.error('IPFS init error:', error);
      setContext({ ipfs: null });
      setError(error);
    }
  }, [setReady, context.ipfs, setContext, setError]);

  const init = useCallback(async () => {
    if (!ready) connect();
  }, [ready, connect]);

  const send = useCallback(async (data) => {
    if (!context.ipfs) {
      console.log('error sending');
      return;
    }
    const result = await context.ipfs.add(data);
    const cid = result.cid.toString();
    return cid;
  }, [context.ipfs]);

  const receive = useCallback(async (cid) => {
    if (!context.ipfs) {
      console.log('error receiving');
      return;
    }

    const stream = await context.ipfs.cat(cid)

    let data = '';

    for await (const chunk of stream) {
      const decodedChunk = new TextDecoder().decode(chunk);
      data += decodedChunk;
    }

    return data;
  }, [context.ipfs]);

  return { init, send, receive, ready, error }
};
