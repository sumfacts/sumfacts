import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.scss';
import { EditorPage } from './pages/Editor.page';
import { MainContext } from './context';

export const App: React.FC = () => {
  const [context, updateStateContext] = React.useState({});
  const setContext = React.useCallback((newContext: any) => {
    updateStateContext({ ...context, ...newContext });
  }, [context]);

  return (
    <MainContext.Provider value={{ context, setContext }}>
      <Switch>
        <Route exact={true} path="/" component={EditorPage} />
        <Route exact={true} path="/ipns/:id" component={EditorPage} />
      </Switch>
    </MainContext.Provider>
  );
};
