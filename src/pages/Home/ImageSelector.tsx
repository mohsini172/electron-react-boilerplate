import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import styles from './ImageSelector.css';
import { useStoreActions } from '../../store/upload';

const { Dragger } = Upload;

export default function ImageSelector() {
  const setUploading = useStoreActions(
    (actions) => actions.uploading.setUploading
  );
  const setEmotions = useStoreActions((actions) => actions.results.setEmotions);
  const setImg = useStoreActions((actions) => actions.results.setImg);
  const config = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    action: 'http://localhost:8080/upload',
    onChange(info) {
      const { status } = info.file;
      console.log(status);
      if (status === 'uploading') {
        setUploading(true);
      }
      if (status === 'done') {
        // setImgResult(`data:image/jpeg;base64, ${info.file.response}`);
        setUploading(false);
        setEmotions(info.file.response.emotions);
        setImg(info.file.response.img);

        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        setUploading(false);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <>
      <Dragger {...config}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className={styles.uploadText}>Click or Drag image here</p>
      </Dragger>
    </>
  );
}
