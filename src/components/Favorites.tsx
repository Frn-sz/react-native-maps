import React from 'react';

import * as Speech from 'expo-speech';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { MarkerInfo } from '../interfaces/Marker';

interface FavoritesProps {
  favoritePlaces: MarkerInfo[];
  onPlacePress: (place: MarkerInfo) => void;
  onToggleFavorite: (placeId: string) => void;
}

export const Favorites = ({ favoritePlaces, onPlacePress, onToggleFavorite }: FavoritesProps) => {

  const speakDescription = (text: string | undefined) => {
    if (text) {
      Speech.speak(text, {
        language: 'pt-BR',
        pitch: 1.0,
        rate: 1.0,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Locais Favoritos</Text>

        {favoritePlaces.length === 0 ? (
          <Text style={styles.noFavoritesText}>Nenhum local favoritado ainda.</Text>
        ) : (
          <FlatList
            data={favoritePlaces}
            keyExtractor={(item, index) => item.title + index + item.coordinate.latitude}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.favoriteItem} onPress={() => onPlacePress(item)}>
                <View style={styles.placeInfo}>
                  <Text style={styles.placeTitle}>{item.title}</Text>
                  {item.description && (
                    <Text style={styles.placeDescription}>{item.description}</Text>
                  )}
                  <Text style={styles.placeCoords}>
                    Lat: {item.coordinate.latitude.toFixed(4)}, Lon: {item.coordinate.longitude.toFixed(4)}
                  </Text>
                </View>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity style={styles.speakButton} onPress={() => speakDescription(item.description || item.title)}>
                    <Icon name="volume-high-outline" size={24} color="purple" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.favoriteButton} onPress={() => onToggleFavorite(item.title)}>
                    <Icon
                      name={item.isFavorite ? 'bookmark' : 'bookmark-outline'}
                      size={24}
                      color={item.isFavorite ? 'gold' : 'gray'}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    paddingVertical: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noFavoritesText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  favoriteItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeInfo: {
    flex: 1,
    marginRight: 10,
  },
  placeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#007BFF',
  },
  placeDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  placeCoords: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speakButton: {
    padding: 5,
    marginRight: 10,
  },
  favoriteButton: {
    padding: 5,
  },
});