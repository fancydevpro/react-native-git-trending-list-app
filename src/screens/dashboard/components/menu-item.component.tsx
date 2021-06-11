import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, StyleSheet } from 'react-native';

export interface MenuItemProps extends TouchableOpacityProps {
  title: string;
  active?: boolean;
}

export type MenuItemElement = React.ReactElement<MenuItemProps>;

export const MenuItem: React.FC<MenuItemProps> = ({
  title,
  active = false,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      style={[styles.container, active && styles.activeContainer, style]}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  activeContainer: {
    backgroundColor: '#efeff7',
  },
  title: {
    fontSize: 16,
    color: '#52575c',
  },
});
