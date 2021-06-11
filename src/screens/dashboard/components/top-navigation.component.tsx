import React from 'react';
import { View, Text, ViewProps, StyleSheet } from 'react-native';

import { RenderProp } from '../../../model';

export interface TopNavigationProps extends ViewProps {
  title: string;
  accessoryLeft?: RenderProp;
  accessoryRight?: RenderProp;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  title,
  accessoryLeft,
  accessoryRight,
  style,
  ...props
}) => {
  return (
    <View {...props} style={[styles.container, style]}>
      <View style={styles.accessoryContainer}>{!!accessoryLeft && accessoryLeft()}</View>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.accessoryContainer, styles.accessoryRightContainer]}>
        {!!accessoryRight && accessoryRight()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  accessoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 24,
  },
  accessoryRightContainer: {
    justifyContent: 'flex-end',
  },
  title: {
    textAlign: 'center',
    fontSize: 21,
    lineHeight: 28,
    color: '#25282b',
  },
});
