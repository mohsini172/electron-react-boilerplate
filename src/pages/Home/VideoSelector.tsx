/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { VideoCameraOutlined, CameraOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import styles from './VideoSelector.css';
import { useStoreActions, useStoreState } from '../../store/upload';

function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1]);
  else byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

export default function VideoSelector() {
  const setUploading = useStoreActions(
    (actions) => actions.uploading.setUploading
  );
  const setEmotions = useStoreActions((actions) => actions.results.setEmotions);
  const setImg = useStoreActions((actions) => actions.results.setImg);
  const setCameraOn = useStoreActions((actions) => actions.camera.setOn);
  const cameraOn = useStoreState((state) => state.camera.on);
  // const [cameraOn, setCameraOn] = useState(false);
  let videoRef: HTMLVideoElement;
  const constraints = {
    video: true,
  };
  function turnOnCamera() {
    setCameraOn(true);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        videoRef.srcObject = stream;
      })
      .catch((error) => {
        console.error('Camera is not working');
        console.error(error);
      });
  }

  function onCapture() {
    setUploading(true);
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', '320');
    canvas.setAttribute('height', '240');
    const context = canvas.getContext('2d');
    context?.drawImage(videoRef, 0, 0, canvas?.width, canvas?.height);
    // setImgResult(canvas.toDataURL());
    const image = dataURItoBlob(canvas.toDataURL());
    const formData = new FormData();
    formData.append('file', image, 'file.jpg');
    // .replace(/^data:image\/(png|jpg);base64,/, '');
    fetch('http://localhost:8080/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((res) => {
        setEmotions(res.emotions);
        setImg(res.img);
      })
      .finally(() => {
        setUploading(false);
      })
      .catch((res) => {
        message.error(
          'Unable to upload image. Please check if server is running :('
        );
      });

    videoRef.pause();
    videoRef.src = '';
    (videoRef.srcObject as MediaStream)?.getTracks().forEach((track) => {
      track.stop();
    });
    setCameraOn(false);
  }
  return (
    <>
      {!cameraOn && (
        <div onClick={() => turnOnCamera()} className={styles.container}>
          <VideoCameraOutlined className={styles.videoIcon} />
          <div>Click for live video record</div>
        </div>
      )}

      <div className={`camera ${!cameraOn ? 'hidden' : ''}`}>
        <video
          className={styles.video}
          ref={(input) => {
            if (input) {
              videoRef = input;
            }
          }}
          autoPlay
        >
          <track kind="captions" srcLang="en" label="english_captions" />
        </video>
        <Button
          className={styles.capture}
          shape="circle"
          size="large"
          onClick={() => onCapture()}
          icon={<CameraOutlined />}
        />
      </div>
    </>
  );
}
