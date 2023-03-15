// CSS start- Follow the css orders here...
import 'awesome-notifications/dist/index.var';
import 'awesome-notifications/dist/style.css';
// CSS end

// Todo: put it on above css order after reviewing the @firecamp/ui css implementation
import '../sass/_index.sass';

import { FC, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Row, RootContainer, EditorApi } from '@firecamp/ui';
import { EFirecampAgent } from '@firecamp/types';
import { _misc } from '@firecamp/utils';

import Crisp from '../components/common/Crisp';
import Analytics from '../components/common/Analytics';
import SidebarContainer from '../components/containers/SidebarContainer';
import TabsContainer from '../components/containers/TabsContainer';
import StatusBarContainer from '../components/status-bar/StatusBarContainer';
import { ModalContainer } from '../components/modals-v3/ModalContainer';
import { EnvSidebarContainer } from '../components/sidebar';
import ErrorPopup from '../components/common/error-boundary/ErrorPopup';
import RealtimeEventManager from '../components/common/realtime/Realtime';
import platformContext from '../services/platform-context';

// Initialise Firecamp languages settings
EditorApi.init();

const App: FC<any> = () => {
  // useMonacoWorkers();

  useEffect(() => {
    const init = async () => {
      setTimeout(async () => {
        await platformContext.app.initApp();
        // await initApp();
      }, 100);
    };
    init();
    return () => {
      if (_misc.firecampAgent() === EFirecampAgent.Desktop)
        //@ts-ignore
        window.fc.dialog.openErrorDialog();
      else alert('I am unmounting');
    };
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorPopup}
      onError={(error) => {
        console.log({ error });
      }}
    >
      <RootContainer
        flex={1}
        overflow="auto"
        className="h-screen w-screen bg-appBackground text-appForeground"
      >
        <Row flex={1}>
          <SidebarContainer />
          <TabsContainer />
        </Row>

        <RealtimeEventManager />
        <ModalContainer />
        <EnvSidebarContainer />
        <StatusBarContainer className="border-t focus-outer2" />
      </RootContainer>

      <Crisp />
      <Analytics />
    </ErrorBoundary>
  );
};

export default App;
