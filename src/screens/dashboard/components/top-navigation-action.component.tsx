import React, { forwardRef } from 'react';
import { TouchableOpacity, TouchableOpacityProps, ImageProps } from 'react-native';

import { RenderProp } from '../../../model';

export interface TopNaivgationActionProps extends TouchableOpacityProps {
  icon?: RenderProp<Partial<ImageProps>>;
}

export type TopNavigationActionElement = React.ReactElement<TopNaivgationActionProps>;

export type TopNavigationActionRef = TouchableOpacity;

const TopNavigationActionFC = (
  { icon, ...props }: TopNaivgationActionProps,
  ref: React.Ref<TopNavigationActionRef>,
) => {
  return (
    <TouchableOpacity {...props} ref={ref}>
      {!!icon && icon()}
    </TouchableOpacity>
  );
};

export const TopNavigationAction = forwardRef<
  TopNavigationActionRef,
  TopNaivgationActionProps
>(TopNavigationActionFC);
