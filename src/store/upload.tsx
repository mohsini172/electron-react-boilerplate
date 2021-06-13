import { Action, action, createStore, createTypedHooks } from 'easy-peasy';

const results: IResultsModel = {
  img: '',
  emotions: {
    angry: 0,
    disgust: 0,
    fear: 0,
    happy: 0,
    neutral: 0,
    sad: 0,
    surprise: 0,
  },
  mainEmotion: '',
  setImg: action((state, payload) => {
    state.img = payload;
  }),
  setEmotions: action((state, payload) => {
    state.emotions = payload;

    let max = -1;
    let mainEmotion = '';

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(payload)) {
      if (value > max) {
        max = value;
        mainEmotion = key;
      }
    }
    state.mainEmotion = max > 0 ? mainEmotion : '';
  }),
  reset: action((state) => {
    state.img = '';
    state.emotions = {
      angry: 0,
      disgust: 0,
      fear: 0,
      happy: 0,
      neutral: 0,
      sad: 0,
      surprise: 0,
    };
    state.mainEmotion = '';
  }),
};

const uploading: IUploadingModel = {
  uploading: false,
  setUploading: action((state, payload) => {
    state.uploading = payload;
  }),
};

const camera: ICameraModel = {
  on: false,
  setOn: action((state, payload) => {
    state.on = payload;
  }),
};

const error: IErrorModel = {
  isError: false,
  message: '',
  setIsError: action((state, payload) => {
    state.isError = payload;
  }),
  setMessage: action((state, payload) => {
    state.message = payload;
  }),
};

export const store = createStore<IStoreModel>({
  uploading,
  error,
  results,
  camera,
});

const typedHooks = createTypedHooks<IStoreModel>();

export const { useStoreActions, useStoreDispatch, useStoreState } = typedHooks;

export interface IStoreModel {
  uploading: IUploadingModel;
  camera: ICameraModel;
  error: IErrorModel;
  results: IResultsModel;
}

export interface IResultsModel {
  img: string;
  emotions: {
    angry: number;
    disgust: number;
    fear: number;
    happy: number;
    neutral: number;
    sad: number;
    surprise: number;
  };
  mainEmotion: string;
  reset: Action<IResultsModel, void>;
  setImg: Action<IResultsModel, string>;
  setEmotions: Action<
    IResultsModel,
    {
      angry: number;
      disgust: number;
      fear: number;
      happy: number;
      neutral: number;
      sad: number;
      surprise: number;
    }
  >;
}

export interface IUploadingModel {
  uploading: boolean;
  setUploading: Action<IUploadingModel, boolean>;
}

export interface ICameraModel {
  on: boolean;
  setOn: Action<ICameraModel, boolean>;
}

export interface IErrorModel {
  isError: boolean;
  message: string;
  setIsError: Action<IErrorModel, boolean>;
  setMessage: Action<IErrorModel, string>;
}
