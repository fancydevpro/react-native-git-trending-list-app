import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

const WINDOW_DIMENSIONS = Dimensions.get('window');
const PADDING_LEFT = 16;
const PADDING_RIGHT = 36;
const LOADER_WIDTH = WINDOW_DIMENSIONS.width - PADDING_LEFT - PADDING_RIGHT;
const LOADER_AVATAR_SIZE = 32;
const LOADER_LINE_1_WIDTH = 100;
const LOADER_LINE_2_WIDTH = LOADER_WIDTH - LOADER_AVATAR_SIZE - 16;
const LOADER_PADDING_VERTICAL = 21;
export const LOADER_HEIGHT = LOADER_AVATAR_SIZE + 2 * LOADER_PADDING_VERTICAL;

export const LoadingRow: React.FC = () => {
  return (
    <View style={styles.container}>
      <ContentLoader
        viewBox={`0 0 ${LOADER_WIDTH} ${LOADER_AVATAR_SIZE}`}
        style={styles.loader}
        backgroundColor='#d7d7da'
      >
        <Circle
          cx={LOADER_AVATAR_SIZE / 2}
          cy={LOADER_AVATAR_SIZE / 2}
          r={LOADER_AVATAR_SIZE / 2}
        />
        <Rect x={48} y={0} rx={4} ry={4} width={LOADER_LINE_1_WIDTH} height={8} />
        <Rect x={48} y={24} rx={4} ry={4} width={LOADER_LINE_2_WIDTH} height={8} />
      </ContentLoader>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: PADDING_LEFT,
    paddingRight: PADDING_RIGHT,
    paddingVertical: LOADER_PADDING_VERTICAL,
  },
  loader: {
    height: LOADER_AVATAR_SIZE,
  },
});
