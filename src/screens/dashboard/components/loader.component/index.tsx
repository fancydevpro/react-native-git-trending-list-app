import React, { useMemo, Fragment } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { range } from 'lodash';

import { Divider } from '../../../../components/divider.component';
import { LoadingRow, LOADER_HEIGHT } from './loading-row.component';

export const Loader: React.FC = () => {
  const rows = useMemo(
    (): number[] => range(Math.ceil(Dimensions.get('window').height / LOADER_HEIGHT)),
    [],
  );

  return (
    <View style={styles.container}>
      {rows.map((it) => (
        <Fragment key={it}>
          <LoadingRow />
          <Divider />
        </Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
