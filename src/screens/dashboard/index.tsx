import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  Image,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { get, unionBy, debounce } from 'lodash';

import { RootStackParamList } from '../../../types';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { Divider } from '../../components/divider.component';
import { TopNavigation } from './components/top-navigation.component';
import {
  TopNavigationAction,
  TopNavigationActionElement,
} from './components/top-navigation-action.component';
import { Loader } from './components/loader.component';
import { RepositoryItem } from './components/repository-item.component';
import { PageInfo, RepositoryModel } from '../../model';
import { apiGetRepositories } from '../../services/api.service';
import { LanguageColors } from '../../constants';

export type DashboardScreenRouteProp = StackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<DashboardScreenRouteProp> = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [canLoadMore, setLoadMore] = useState(true);
  const [showingMoreMenu, setShowingMoreMenu] = useState(false);
  const [data, setData] = useState<RepositoryModel[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 10,
    page: 1,
    sort: 'stars',
  });

  const showErrorMessage = useCallback((error) => {
    Alert.alert('Load Failed', error.message);
  }, []);

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
        console.log('error: ', error.response);
      }

      setLoading(false);
    },
    [showErrorMessage],
  );

  useEffect(() => {
    loadRepositories(pageInfo);
  }, []);

  const onMoreButton = useCallback((): void => {
    setShowingMoreMenu((prevState) => !prevState);
  }, []);

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

    return debounce(refresh, 300);
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

    return debounce(loadMore, 300);
  }, [loading, canLoadMore, pageInfo, loadRepositories]);

  const renderMoreAction = useCallback(
    (): TopNavigationActionElement => (
      <TopNavigationAction
        icon={() => (
          <Image
            source={require('../../../assets/images/more-black-24.png')}
            style={styles.moreIcon}
            resizeMode='center'
          />
        )}
        onPress={onMoreButton}
      />
    ),
    [],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<RepositoryModel>) => <RepositoryItem {...item} />,
    [],
  );

  const renderItemSeparator = useCallback(() => <Divider />, []);

  const ListFooterComponent = useMemo(
    () => (
      <>
        <Divider />
        {loading && <ActivityIndicator size='small' style={styles.bottomLoader} />}
      </>
    ),
    [loading],
  );

  return (
    <SafeAreaLayout style={styles.container} insets='top'>
      <TopNavigation title='Repository' accessoryRight={renderMoreAction} />
      <Divider />
      <FlatList
        contentContainerStyle={styles.listContentContainer}
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={renderItemSeparator}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={<Loader />}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        keyExtractor={(item: RepositoryModel) => `${item.id}`}
      />
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
