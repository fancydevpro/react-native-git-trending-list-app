import React from 'react';
import { StatusBar } from 'react-native';

import { AppNavigator } from '../navigation/app.navigator';

export const App: React.FC = () => {
  return (
    <>
      <StatusBar />
      <AppNavigator />
    </>
  );
};
