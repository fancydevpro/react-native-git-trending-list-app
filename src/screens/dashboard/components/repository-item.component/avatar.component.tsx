import React from 'react';
import { Image, ImageProps, StyleSheet } from 'react-native';

export type AvatarProps = ImageProps;

export const Avatar: React.FC<AvatarProps> = ({ style, ...props }) => (
  <Image {...props} style={[styles.image, style]} />
);

const styles = StyleSheet.create({
  image: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
