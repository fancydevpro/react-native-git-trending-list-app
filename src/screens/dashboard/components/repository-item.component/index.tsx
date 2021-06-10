import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  Image,
} from 'react-native';

import { Avatar } from './avatar.component';
import { RepositoryModel } from '../../../../model';

export type RepositoryItemProps = TouchableOpacityProps & RepositoryModel;

export const RepositoryItem: React.FC<RepositoryItemProps> = ({
  avatar,
  owner,
  name,
  extended,
  description,
  language,
  languageColor,
  stars,
  forks,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity {...props} style={[styles.container, style]}>
      <View style={styles.mainContent}>
        <Avatar source={{ uri: avatar }} />
        <View style={styles.ownerAndName}>
          <Text style={styles.ownerText} numberOfLines={1}>
            {owner}
          </Text>
          <Text style={styles.nameText} numberOfLines={1}>
            {name}
          </Text>
        </View>
      </View>
      <View style={styles.extendedContent}>
        <Text style={styles.descText} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.attributes}>
          {!!language && (
            <View style={styles.attribute}>
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.languageIcon,
                    !!languageColor && { backgroundColor: languageColor },
                  ]}
                />
              </View>
              <Text style={styles.attributeText}>{language}</Text>
            </View>
          )}
          {!!stars && (
            <View style={styles.attribute}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../../../../assets/images/star-yellow-16.png')}
                  resizeMode='center'
                />
              </View>
              <Text style={styles.attributeText}>{stars}</Text>
            </View>
          )}
          {!!forks && (
            <View style={styles.attribute}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../../../../assets/images/fork-black-16.png')}
                  resizeMode='center'
                />
              </View>
              <Text style={styles.attributeText}>{forks}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
  },
  ownerAndName: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 16,
  },
  ownerText: {
    fontSize: 12,
    color: '#52575c',
  },
  nameText: {
    marginTop: 6,
    fontSize: 15,
    color: '#52575c',
  },
  extendedContent: {
    marginLeft: 48,
    marginTop: 8,
  },
  descText: {
    fontSize: 12,
    color: '#52575c',
  },
  attributes: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  attribute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 16,
    height: 16,
  },
  languageIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff7070',
  },
  icon: {
    width: 12,
    height: 12,
  },
  attributeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#52575c',
  },
});
