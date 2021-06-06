import React from 'react';
import { Upload, message, Row, Col } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import styles from './Home.css';
import avatarImg from '../../../assets/hello.gif';
import welcomeImg from '../../../assets/welcome.svg';
import VideoSelector from './VideoSelector';

const { Dragger } = Upload;
const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

export default function Home() {
  return (
    <>
      <Row className={styles.cover}>
        <Col className={styles.selector} flex={4}>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className={styles.uploadText}>Click or Drag image here</p>
          </Dragger>
          <VideoSelector />
        </Col>
        <Col className={`${styles.sidebar} bg-white`} flex={1}>
          <img width="200px" alt="avatarImg" src={avatarImg} />
          <img width="300px" alt="icon" src={welcomeImg} />
        </Col>
      </Row>
    </>
  );
}
