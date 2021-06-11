import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  LayoutAnimation,
  StyleSheet,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import { SafeAreaLayout } from '../../../components/safe-area-layout.component';

export interface NoInternetProps {
  onRetry?: () => Promise<void>;
}

export const NoInternet: React.FC<NoInternetProps> = ({ onRetry }) => {
  const [offline, setOffline] = useState<boolean>();

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      if (typeof state.isInternetReachable === 'boolean') {
        const offline = !(state.isConnected && state.isInternetReachable);
        setOffline((prevState) => {
          if ((!prevState && offline) || (prevState && !offline)) {
            LayoutAnimation.configureNext({
              ...LayoutAnimation.Presets.linear,
              duration: 200,
            });
          }
          if (prevState && !offline && onRetry) {
            onRetry();
          }
          return offline;
        });
      }
    });

    return () => removeNetInfoSubscription();
  }, []);

  const onRetryWithOfflineCheck = useCallback(async (): Promise<void> => {
    const state = await NetInfo.fetch();
    const offline = !(state.isConnected && state.isInternetReachable);
    setOffline((prevState) => {
      if ((!prevState && offline) || (prevState && !offline)) {
        LayoutAnimation.configureNext({
          ...LayoutAnimation.Presets.linear,
          duration: 200,
        });
      }
      if (prevState && !offline && onRetry) {
        onRetry();
      }
      return offline;
    });
  }, []);

  if (!offline) {
    return null;
  }

  return (
    <SafeAreaLayout style={styles.container} insets='bottom'>
      <View style={styles.contentContainer}>
        <Image
          source={require('../../../../assets/images/nointernet_connection.png')}
          style={styles.illustation}
          resizeMode='contain'
        />
        <Text style={styles.title}>Something went wrong...</Text>
        <Text style={styles.description}>An alien is probably blocking your signal.</Text>
      </View>
      <TouchableOpacity style={styles.retryButton} onPress={onRetryWithOfflineCheck}>
        <Text style={styles.retryText}>RETRY</Text>
      </TouchableOpacity>
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    backgroundColor: '#f7f7fa',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustation: {
    height: 240,
  },
  title: {
    marginTop: 24,
    fontSize: 18,
    color: '#4a4a4a',
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    color: '#929292',
    textAlign: 'center',
  },
  retryButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#31b057',
    borderRadius: 4,
  },
  retryText: {
    fontSize: 15,
    color: '#31b057',
  },
});
