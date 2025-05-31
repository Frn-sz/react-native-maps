import React, { useState } from 'react';

import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { MarkerInfo } from '../interfaces/Marker';

interface SearchProps {
  allPlaces: MarkerInfo[];
  onPlacePress: (place: MarkerInfo) => void;
}

export const Search = ({ allPlaces, onPlacePress }: SearchProps) => {
  const [searchText, setSearchText] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState<MarkerInfo[]>([]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredPlaces([]);
      return;
    }

    const lowercasedText = text.toLowerCase();
    const results = allPlaces.filter(place =>
      (place.title && place.title.toLowerCase().includes(lowercasedText)) ||
      (place.description && place.description.toLowerCase().includes(lowercasedText))
    );
    setFilteredPlaces(results);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Serviços de Busca</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título ou descrição..."
          value={searchText}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />

        {searchText.trim() !== '' && filteredPlaces.length === 0 ? (
          <Text style={styles.noResultsText}>Nenhum resultado encontrado.</Text>
        ) : (
          <FlatList
            data={filteredPlaces}
            keyExtractor={(item, index) => item.title + index + item.coordinate.latitude}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.searchItem} onPress={() => onPlacePress(item)}>
                <View style={styles.placeInfo}>
                  <Text style={styles.placeTitle}>{item.title}</Text>
                  {item.description && (
                    <Text style={styles.placeDescription}>{item.description}</Text>
                  )}
                  <Text style={styles.placeCoords}>
                    Lat: {item.coordinate.latitude.toFixed(4)}, Lon: {item.coordinate.longitude.toFixed(4)}
                  </Text>
                </View>
                {item.isFavorite && (
                  <Icon name="bookmark" size={20} color="gold" style={styles.favoriteIcon} />
                )}
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
    paddingVertical: 50,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  searchItem: {
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
  favoriteIcon: {
    marginLeft: 10,
  },
});