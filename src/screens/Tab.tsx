import React, { useCallback, useEffect, useState } from 'react';

import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { MarkerInfo } from '../interfaces/Marker';
import { About } from './About';
import { Favorites } from './Favorites';
import { Map } from './Map';
import { PlaceList } from './PlaceList';
import { Search } from './Search';
import { Database } from '../db/db';

const Tab = createBottomTabNavigator();

export const TabBar = () => {
  const [places, setPlaces] = useState<MarkerInfo[]>([]);
  const [mapRegion, setMapRegion] = useState<any | undefined>(undefined);

  const loadPlaces = useCallback(async () => {
    try {
      const storedPlaces = await Database.getAll();
      setPlaces(storedPlaces);
    } catch (error) {
      console.error("Failed to load places from database", error);
    }
  }, []);

  useEffect(() => {
    async function setupDatabase() {
      await Database.init();
      await loadPlaces();
    }
    setupDatabase();
  }, [loadPlaces]);

  const handleAddPlace = async (newPlace: Omit<MarkerInfo, 'id'>) => {
    await Database.addPlace(newPlace);
    await loadPlaces();

    setMapRegion({
      latitude: newPlace.coordinate.latitude,
      longitude: newPlace.coordinate.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleUpdatePlace = async (place: MarkerInfo) => {
    await Database.updatePlace(place);
    await loadPlaces();


    setMapRegion({
      latitude: place.coordinate.latitude,
      longitude: place.coordinate.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }

  const handleDeletePlace = async (place: MarkerInfo) => {
    if (!place.id) {
      console.error("Não é possível excluir um local sem id");
      return;
    };

    await Database.deletePlace(place.id);
    await loadPlaces();
  }

  const handlePlacePress = (place: MarkerInfo, navigation: any) => {
    setMapRegion({
      latitude: place.coordinate.latitude,
      longitude: place.coordinate.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    navigation.navigate('Mapa');
  };

  const handleToggleFavorite = async (placeToToggle: MarkerInfo) => {
    await Database.toggleFavorite(placeToToggle);
    await loadPlaces();
  };

  const favoritePlaces = places.filter(place => place.isFavorite);

  return (
    <SafeAreaView style={styles.fullScreen}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string;

              if (route.name === "Mapa") {
                iconName = focused ? "map" : "map-outline";
              } else if (route.name === "Locais") {
                iconName = focused ? "flag" : "flag-outline";
              } else if (route.name === "Favoritos") {
                iconName = focused ? "bookmark" : "bookmark-outline";
              } else if (route.name === "Busca") {
                iconName = focused ? "search" : "search-outline";
              } else if (route.name === "Sobre") {
                iconName = focused ? "information-circle" : "information-circle-outline";
              } else {
                iconName = "help-circle-outline";
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "blue",
            tabBarInactiveTintColor: "gray",
            headerShown: false,
          })}
        >
          <Tab.Screen name="Mapa">
            {() => <Map markers={places} initialRegion={mapRegion} />}
          </Tab.Screen>
          <Tab.Screen name="Locais">
            {({ navigation }) => (
              <PlaceList
                places={places}
                onAddPlace={handleAddPlace}
                onUpdatePlace={handleUpdatePlace}
                onPlacePress={(place) => handlePlacePress(place, navigation)}
                onToggleFavorite={handleToggleFavorite}
                onDeletePlace={handleDeletePlace}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Favoritos">
            {({ navigation }) => (
              <Favorites
                favoritePlaces={favoritePlaces}
                onPlacePress={(place) => handlePlacePress(place, navigation)}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </Tab.Screen>

          <Tab.Screen name="Busca">
            {({ navigation }) => (
              <Search
                allPlaces={places}
                onPlacePress={(place) => handlePlacePress(place, navigation)}
              />
            )}
          </Tab.Screen>

          <Tab.Screen name="Sobre" component={About} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  tab: { width: "100%", flexDirection: "row" },
});