// import Ipfs from 'ipfs-core';
 import Ipfs from 'ipfs-http-client';
import { useContext, useCallback, useState, useEffect } from 'react';
import { notification } from 'antd';
import { nanoid } from 'nanoid';

import { MainContext } from '../context';

// TODO error handling
export const useIpfs = () => {
  const { context, setContext } = useContext(MainContext);
  const [hasStartedConnecting, setHasStartedConnecting] = useState(Boolean(context.ipfs));
  const [error, setError] = useState(null);

  useEffect(() => {
    return function cleanup() {
      if (context.ipfs?.stop) {
        notification.info({
          message: 'Stopping IPFS',
        });
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
      // const ipfs = await Ipfs.create({ repo: 'sumfacts' });
      const ipfs = Ipfs.create({ url: process.env.REACT_APP_IPFS_API_URL || 'http://localhost:5001' });

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

  const create = useCallback(async (data) => {
    if (!context.ipfs) {
      notification.error({
        message: 'no ipfs',
      });
      return {};
    }
    const block = await context.ipfs.add(JSON.stringify(data, null, 2));
    const cid = block.cid.toString();
    const secret = nanoid();

    const options = {
      resolve: true,
      // lifetime: '24h',
      // ttl: '10s',
      key: secret,
      // allowOffline: true
      timeout: 5 * 60 * 1000,
    }

    await context.ipfs.key.gen(secret, { type: 'rsa', size: 2048 });
    const result = await context.ipfs.name.publish(cid, options);

    const { name } = result;

    notification.success({
      message: 'Created argument.',
    });

    return { id: name, secret };
  }, [context.ipfs]);

  const update = useCallback(async (secret, data) => {
    if (!context.ipfs) {
      notification.error({
        message: 'no ipfs',
      });
      return;
    }
    const block = await context.ipfs.add(JSON.stringify(data, null, 2));
    const cid = block.cid.toString();

    const options = {
      resolve: true,
      // lifetime: '24h',
      // ttl: '10s',
      key: secret,
      // allowOffline: true,
      timeout: 5 * 60 * 1000,
    };

    const { id } = await context.ipfs.name.publish(cid, options);

    notification.success({
      message: 'Updated argument.',
    });

    return { id, secret };
  }, [context.ipfs]);

  const resolve = useCallback(async (name, onResolve) => {
    if (!context.ipfs) {
      notification.error({
        message: 'no ipfs',
      });
      return;
    }

    try {
      for await (const cid of context.ipfs.name.resolve(`/ipns/${name}`)) {
        const stream = await context.ipfs.cat(cid);

        let data = '';

        for await (const chunk of stream) {
          try {
            const decodedChunk = new TextDecoder().decode(chunk);
            data += decodedChunk;
          } catch (error) {
            console.error(error);
          }
        }

        onResolve(data ? JSON.parse(data) : null);
      }
    } catch (error) {
      notification.error({
        message: 'Could not find argument.',
      });
    }
  }, [context.ipfs]);

  return { init, create, update, resolve, ready: Boolean(context.ipfs), error }
};
