import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';

export interface DividerProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({ size, color, style }) => {
  const dividerStyle = useMemo(
    (): ViewStyle => ({
      ...style,
      height: size,
      backgroundColor: color,
    }),
    [size, color],
  );

  return <View style={dividerStyle} />;
};

Divider.defaultProps = {
  size: 1,
  color: '#e8e8e8',
};
