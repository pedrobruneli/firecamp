import create from 'zustand';
import createContext from 'zustand/context';
import _cloneDeep from 'lodash/cloneDeep';
import equal from 'react-fast-compare';

import {
  // request
  IRequestSlice,
  createRequestSlice,
  requestSliceKeys,

  // runtime
  IRuntime,
  IRuntimeSlice,
  createRuntimeSlice,

  // collection
  createCollectionSlice,
  ICollection,
  ICollectionSlice,

  // playground
  IPlaygrounds,
  IPlaygroundSlice,
  createPlaygroundsSlice,

  // connections logs
  IConnectionsLogsSlice,
  IConnectionsLogs,
  createConnectionsLogsSlice,

  // push actions
  IPushAction,
  IPushActionSlice,
  createPushActionSlice,
  IHandleConnectionExecutorSlice,
  createHandleConnectionExecutor,

  // pull
  IPullSlice,
  createPullActionSlice,

  // ui
  IUi,
  createUiSlice,
  IUiSlice,
} from './index';
import { _object } from '@firecamp/utils';
import { IWebSocket } from '@firecamp/types';
import { initialiseStoreFromRequest } from '../services/reqeust.service';

const {
  Provider: WebsocketStoreProvider,
  useStore: useWebsocketStore,
  useStoreApi: useWebsocketStoreApi,
} = createContext();

interface IWebsocketStoreState {
  request?: IWebSocket;
  collection?: ICollection;
  pushAction?: IPushAction;
  runtime?: IRuntime;
  playgrounds?: IPlaygrounds;
  connectionsLogs?: IConnectionsLogs;
  ui?: IUi;
}

interface IWebsocketStore
  extends IRequestSlice,
    IRuntimeSlice,
    ICollectionSlice,
    IPlaygroundSlice,
    IConnectionsLogsSlice,
    IPushActionSlice,
    IPullSlice,
    IHandleConnectionExecutorSlice,
    IUiSlice {
  last: any;

  initialise: (request: Partial<IWebSocket>) => void;

  setLast: (initialState: IWebsocketStoreState) => void;
  equalityChecker: (payload: any, reqKey_s: string) => void;
}

const createWebsocketStore = (initialState: IWebsocketStoreState) =>
  create<IWebsocketStore>((set, get): IWebsocketStore => {
    return {
      last: initialState,

      initialise: async (request: Partial<IWebSocket>) => {
        const initState = initialiseStoreFromRequest(request);
        // console.log(initState.request, 'initState.request');
        set((s) => ({
          ...s,
          ...initState,
          originalRequest: _cloneDeep(initState.request),
        }));
      },

      setLast: (initialState: IWebsocketStoreState) => {
        set((s) => ({
          ...s,
          last: initialState,
        }));
      },

      equalityChecker: (payload, reqKey_s) => {
        const state = get();
        console.log(state.originalRequest.connections[0][reqKey_s], payload);
        return equal(state.originalRequest.connections[0][reqKey_s], payload);
      },

      ...createRequestSlice(
        set,
        get,
        _object.pick(initialState.request, requestSliceKeys) as IWebSocket
      ),

      ...createRuntimeSlice(set, get, initialState.runtime),
      ...createCollectionSlice(set, get, initialState.collection),
      ...createPlaygroundsSlice(set, get, initialState.playgrounds),
      ...createConnectionsLogsSlice(set, get),
      ...createPushActionSlice(set, get),
      ...createHandleConnectionExecutor(set, get),
      ...createPullActionSlice(set, get),
      ...createUiSlice(set, get, initialState.ui),

      //   ...createPushActionSlice(set, get),
    };
  });

export {
  WebsocketStoreProvider,
  useWebsocketStore,
  useWebsocketStoreApi,
  createWebsocketStore,
  IWebsocketStore,
  IWebsocketStoreState,
};
