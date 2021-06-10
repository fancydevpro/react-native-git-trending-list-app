import React from 'react';
import { FlexStyle, View, ViewProps } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

interface InsetProvider {
  toStyle: (insets: EdgeInsets) => FlexStyle;
}

type Inset = 'top' | 'bottom';

const InsetStyles: Record<Inset, InsetProvider> = {
  top: {
    toStyle: (insets: EdgeInsets): FlexStyle => ({
      paddingTop: insets.top,
    }),
  },
  bottom: {
    toStyle: (insets: EdgeInsets): FlexStyle => ({
      paddingBottom: insets.bottom,
    }),
  },
};

export interface SafeAreaLayoutProps extends ViewProps {
  insets?: Inset | Inset[];
}

export const SafeAreaLayout: React.FC<SafeAreaLayoutProps> = ({
  insets,
  style,
  ...props
}) => {
  const safeAreaInsets: EdgeInsets = useSafeAreaInsets();
  const insetStyles: FlexStyle[] = insets
    ? React.Children.map(insets, (inset) => InsetStyles[inset].toStyle(safeAreaInsets))
    : [];

  return <View {...props} style={[insetStyles, style]} />;
};
