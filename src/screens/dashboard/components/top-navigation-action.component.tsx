import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ImageProps } from 'react-native';

import { RenderProp } from '../../../model';

export interface TopNaivgationActionProps extends TouchableOpacityProps {
  icon?: RenderProp<Partial<ImageProps>>;
}

export type TopNavigationActionElement = React.ReactElement<TopNaivgationActionProps>;

export const TopNavigationAction: React.FC<TopNaivgationActionProps> = ({
  icon,
  ...props
}) => {
  return <TouchableOpacity {...props}>{!!icon && icon()}</TouchableOpacity>;
};
