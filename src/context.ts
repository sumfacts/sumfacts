import * as React from 'react';

export const MainContext = React.createContext({
  context: {} as any,
  setContext: (_: any) => {
    //
  },
});