import { FC } from 'react';
import { Spin as AntSpin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { COLORS } from '../constants';

const antIcon = <LoadingOutlined style={{ fontSize: 16, color: COLORS.DARK_GREY }} spin />;

export const Spin: FC = (() => <AntSpin indicator={antIcon} />);
