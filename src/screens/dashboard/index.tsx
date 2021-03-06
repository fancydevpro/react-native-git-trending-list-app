import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import {
  Image,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Alert,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Platform,
  View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { get, unionBy, throttle } from 'lodash';

import { RootStackParamList } from '../../../types';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { Divider } from '../../components/divider.component';
import { TopNavigation } from './components/top-navigation.component';
import {
  TopNavigationAction,
  TopNavigationActionElement,
  TopNavigationActionRef,
} from './components/top-navigation-action.component';
import { Loader } from './components/loader.component';
import { RepositoryItem } from './components/repository-item.component';
import { Menu } from './components/menu.component';
import { MenuItem } from './components/menu-item.component';
import { NoInternet } from './components/no-internet.component';
import { PageInfo, RepositoryModel } from '../../model';
import { apiGetRepositories } from '../../services/api.service';
import { LanguageColors } from '../../constants';

export type DashboardScreenRouteProp = StackScreenProps<RootStackParamList, 'Dashboard'>;

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DashboardScreen: React.FC<DashboardScreenRouteProp> = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [canLoadMore, setLoadMore] = useState(true);
  const [showingMoreMenu, setShowingMoreMenu] = useState(false);
  const [showingError, setShowingError] = useState(false);
  const [data, setData] = useState<RepositoryModel[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 15,
    page: 1,
    sort: 'stars',
    order: 'desc',
    query: 'trending',
  });
  const [expandedItemId, setExpandedItemId] = useState<number>();
  const moreButtonRef = useRef<TopNavigationActionRef>(null);

  const showErrorMessage = useCallback(
    (error) => {
      if (error.response && !showingError) {
        setShowingError(true);
        Alert.alert('Load Failed', get(error, 'response.data.message', error.message), [
          {
            text: 'OK',
            onPress: () => setShowingError(false),
          },
        ]);
      }
      if (__DEV__) {
        console.log('error: ', error.response);
      }
    },
    [showingError],
  );

  const loadRepositories = useCallback(
    async (pInfo: PageInfo): Promise<void> => {
      setLoading(true);

      try {
        const repositories = await apiGetRepositories(pInfo);

        if (repositories.items.length) {
          const newData = repositories.items.map((it) => ({
            id: it.id,
            avatar: it.owner.avatar_url,
            owner: it.owner.login,
            name: it.name,
            description: it.description,
            language: it.language,
            languageColor: get(LanguageColors, [it.language, 'color']),
            stars: it.stargazers_count,
            forks: it.forks_count,
          }));

          setData((prevData) => unionBy(prevData, newData, 'id'));

          setPageInfo(pInfo);
        } else {
          setLoadMore(false);
        }
      } catch (error) {
        showErrorMessage(error);
      }

      setLoading(false);
    },
    [showErrorMessage],
  );

  useEffect(() => {
    loadRepositories(pageInfo);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onMoreButton = useCallback((): void => {
    setShowingMoreMenu((prevState) => !prevState);
  }, []);

  const hideMenu = useCallback((): void => {
    setShowingMoreMenu(false);
  }, []);

  const onSortByStars = useCallback(async (): Promise<void> => {
    hideMenu();
    if (pageInfo.sort !== 'stars') {
      const newPageInfo: PageInfo = {
        ...pageInfo,
        sort: 'stars',
        order: 'desc',
      };
      setData([]);
      setLoadMore(true);
      await loadRepositories(newPageInfo);
    }
  }, [hideMenu, loadRepositories, pageInfo]);

  const onSortByName = useCallback(async (): Promise<void> => {
    hideMenu();
    if (pageInfo.sort !== 'name') {
      const newPageInfo: PageInfo = {
        ...pageInfo,
        sort: 'name',
        order: 'asc',
      };
      setData([]);
      setLoadMore(true);
      await loadRepositories(newPageInfo);
    }
  }, [hideMenu, loadRepositories, pageInfo]);

  const onRefresh = useMemo(() => {
    const refresh = async (): Promise<void> => {
      if (refreshing || loading) {
        return;
      }

      setRefreshing(true);

      setData([]);
      setLoadMore(true);
      const newPageInfo = {
        ...pageInfo,
        page: 1,
      };

      await loadRepositories(newPageInfo);

      setRefreshing(false);
    };

    return throttle(refresh, 800);
  }, [refreshing, loading, pageInfo, loadRepositories]);

  const onEndReached = useMemo(() => {
    const loadMore = async (): Promise<void> => {
      if (loading || !canLoadMore) {
        return;
      }

      await loadRepositories({
        ...pageInfo,
        page: pageInfo.page + 1,
      });
    };

    return throttle(loadMore, 800);
  }, [loading, canLoadMore, pageInfo, loadRepositories]);

  const onRetry = useMemo(() => {
    const load = async (): Promise<void> => {
      if (loading || !canLoadMore) {
        return;
      }

      await loadRepositories(pageInfo);
    };

    return throttle(load, 800) as () => Promise<void>;
  }, [loading, canLoadMore, pageInfo, loadRepositories]);

  const renderMoreAction = useCallback(
    (): TopNavigationActionElement => (
      <TopNavigationAction
        ref={moreButtonRef}
        icon={() => (
          <Image
            source={require('../../../assets/images/more-black-24.png')}
            style={styles.moreIcon}
            resizeMode='center'
          />
        )}
        hitSlop={{ left: 16, right: 16 }}
        style={styles.moreButton}
        onPress={onMoreButton}
      />
    ),
    [onMoreButton],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<RepositoryModel>) => (
      <RepositoryItem
        {...item}
        expanded={item.id === expandedItemId}
        onPress={() => {
          LayoutAnimation.configureNext({
            ...LayoutAnimation.Presets.easeInEaseOut,
            duration: 200,
          });
          setExpandedItemId((prevId) => (prevId === item.id ? undefined : item.id));
        }}
      />
    ),
    [expandedItemId],
  );

  const ListFooterComponent = useMemo(
    () =>
      loading ? <ActivityIndicator size='small' style={styles.bottomLoader} /> : null,
    [loading],
  );

  return (
    <SafeAreaLayout style={styles.container} insets='top'>
      <TopNavigation title='Trending' accessoryRight={renderMoreAction} />
      <Divider />
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.listContentContainer}
          data={data}
          renderItem={renderItem}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={<Loader />}
          scrollEnabled={data.length > 0 || !loading}
          onRefresh={onRefresh}
          refreshing={refreshing}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          keyExtractor={(item: RepositoryModel) => `${item.id}`}
        />
        <NoInternet onRetry={onRetry} />
      </View>
      <Menu anchor={moreButtonRef} show={showingMoreMenu} onTapOutside={hideMenu}>
        <MenuItem
          title='Sort by stars'
          active={pageInfo.sort === 'stars'}
          onPress={onSortByStars}
        />
        <MenuItem
          title='Sort by name'
          active={pageInfo.sort === 'name'}
          onPress={onSortByName}
        />
      </Menu>
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  moreButton: {
    opacity: 1, // To make measure() method work on Android
  },
  moreIcon: {
    height: 24,
  },
  listContentContainer: {
    paddingBottom: 32,
  },
  bottomLoader: {
    alignSelf: 'center',
    marginTop: 16,
  },
});

export default DashboardScreen;
