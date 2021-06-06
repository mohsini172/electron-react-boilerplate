import React from 'react';
import { VideoCameraOutlined } from '@ant-design/icons';
import styles from './VideoSelector.css';

export default function VideoSelector() {
  return (
    <div className={styles.container}>
      <VideoCameraOutlined className={styles.videoIcon} />
      <div>Click for live video record</div>
    </div>
  );
}
