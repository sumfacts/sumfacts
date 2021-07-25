import Ipfs from 'ipfs-core';
import { useContext, useCallback, useState, useEffect } from 'react';

import { MainContext } from '../context';

// TODO error handling
export const useIpfs = () => {
  const { context, setContext } = useContext(MainContext);
  const [hasStartedConnecting, setHasStartedConnecting] = useState(Boolean(context.ipfs));
  const [error, setError] = useState(null);

  useEffect(() => {
    return function cleanup() {
      if (context.ipfs?.stop) {
        console.log('Stopping IPFS');
        context.ipfs?.stop().catch((error: any) => console.error(error));
        setContext({ ipfs: null });
        setHasStartedConnecting(false);
      }
    };
  }, [context.ipfs, setContext]);

  const connect = useCallback(async () => {
    setHasStartedConnecting(true);
    try {
      console.time('IPFS Started');
      const ipfs = await Ipfs.create({ repo: 'sumfacts' }); // initialise IPFS daemon
      setContext({ ipfs });
      console.timeEnd('IPFS Started');
    } catch (error) {
      console.error('IPFS init error:', error);
      setContext({ ipfs: null });
      setError(error);
    }
  }, [setHasStartedConnecting, setContext, setError]);

  const init = useCallback(async () => {
    if (!hasStartedConnecting) await connect();
  }, [hasStartedConnecting, connect]);

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

    const stream = await context.ipfs.cat(cid);

    debugger
    let data = '';

    for await (const chunk of stream) {
      try {
        const decodedChunk = new TextDecoder().decode(chunk);
        data += decodedChunk;
      } catch (error) {
        console.error(error);
      }
    }

    return data;
  }, [context.ipfs]);

  return { init, send, receive, ready: Boolean(context.ipfs), error }
};
