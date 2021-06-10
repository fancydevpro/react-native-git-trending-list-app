import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

export interface MenuProps {
  anchor: React.RefObject<TouchableOpacity>;
  show?: boolean;
  onTapOutside?: () => void;
}

export const Menu: React.FC<MenuProps> = ({
  anchor,
  show = false,
  children,
  onTapOutside,
}) => {
  const [menuPosition, setMenuPosition] =
    useState<{ left?: number; top?: number; right?: number; bottom?: number }>();

  useEffect(() => {
    anchor.current?.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({
        top: pageY + height,
        right: Dimensions.get('window').width - pageX - width,
      });
    });
  }, [show, anchor.current]);

  return (
    <TouchableWithoutFeedback onPress={onTapOutside}>
      <View style={styles.overlay} pointerEvents={show ? 'auto' : 'none'}>
        {show && !!menuPosition && (
          <View style={[styles.container, menuPosition]}>{children}</View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
  },
  container: {
    position: 'absolute',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    elevation: 2,
  },
});
