import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styles from './Home.css';
import avatarImg from '../../../assets/hello.gif';
import welcomeImg from '../../../assets/welcome.svg';
import VideoSelector from './VideoSelector';
import ImageSelector from './ImageSelector';
import { Loading } from '../../shared/loading';
import { useStoreActions, useStoreState } from '../../store/upload';
import Chart from './Chart';

import angry from '../../../assets/angry.svg';
import disgust from '../../../assets/disgust.svg';
import fear from '../../../assets/fear.svg';
import happy from '../../../assets/happy.svg';
import neutral from '../../../assets/neutral.svg';
import sad from '../../../assets/sad.svg';
import surprise from '../../../assets/surprise.svg';

const emojis = {
  angry,
  disgust,
  fear,
  happy,
  neutral,
  sad,
  surprise,
};

export default function Home() {
  const uploading = useStoreState((state) => state.uploading.uploading);
  const cameraOn = useStoreState((state) => state.camera.on);
  const imgResult = useStoreState((state) => state.results.img);
  const mainEmotion = useStoreState((state) => state.results.mainEmotion);

  const reset = useStoreActions((actions) => actions.results.reset);

  return (
    <>
      <Row className={styles.cover}>
        <Col className={styles.selector} flex={4}>
          {uploading && (
            <div className={styles.loadingContainer}>
              <Loading />
            </div>
          )}

          <div className={`${uploading || imgResult ? 'hidden' : ''}`}>
            <div className={`${cameraOn ? 'hidden' : ''}`}>
              <ImageSelector />
            </div>
            <VideoSelector />
          </div>

          <div className={`${imgResult ? '' : 'hidden'}`}>
            <div>
              <Button
                onClick={() => reset()}
                shape="round"
                icon={<ArrowLeftOutlined />}
                size="middle"
              >
                Back
              </Button>
            </div>
            <img className={styles.imgResult} src={imgResult} alt="" />
          </div>
        </Col>
        <Col className={`${styles.sidebar} bg-white`} flex={1}>
          <img
            className={`${uploading || imgResult ? 'hidden' : ''}`}
            width="200px"
            alt="avatarImg"
            src={avatarImg}
          />
          <img
            className={`${uploading || imgResult ? 'hidden' : ''}`}
            width="300px"
            alt="icon"
            src={welcomeImg}
          />
          <div
            style={{
              width: 'calc(100% - 20px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              height: '100%',
            }}
            className={`${uploading || imgResult ? '' : 'hidden'}`}
          >
            <Chart />
            <div style={{ textAlign: 'center' }}>
              <img
                style={{ width: '250px' }}
                src={imgResult ? emojis[mainEmotion as string] : ''}
                alt=""
              />
              <h2>{mainEmotion.toUpperCase()}</h2>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
