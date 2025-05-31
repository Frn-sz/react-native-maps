import React, { useState } from 'react';

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

const Tab = createBottomTabNavigator();

export const TabBar = () => {
  const [places, setPlaces] = useState<MarkerInfo[]>([{
    coordinate: { latitude: -31.33202828209838, longitude: -54.071768758918644 },
    description: "Instituto Federal de Ciência e Tecnologia - Campus Bagé",
    title: "IFSUL Bagé",
    isFavorite: true,
  }]);
  const [mapRegion, setMapRegion] = useState<any | undefined>(undefined);

  const handleAddPlace = (newPlace: MarkerInfo) => {
    setPlaces(prevPlaces => [...prevPlaces, newPlace]);
    setMapRegion({
      latitude: newPlace.coordinate.latitude,
      longitude: newPlace.coordinate.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handlePlacePress = (place: MarkerInfo, navigation: any) => {
    setMapRegion({
      latitude: place.coordinate.latitude,
      longitude: place.coordinate.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    navigation.navigate('Mapa');
  };

  const handleToggleFavorite = (placeTitle: string) => {
    setPlaces(prevPlaces =>
      prevPlaces.map(place =>
        place.title === placeTitle
          ? { ...place, isFavorite: !place.isFavorite }
          : place
      )
    );
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
            {() => <Map extraMarkers={places} initialRegion={mapRegion} />}
          </Tab.Screen>

          <Tab.Screen name="Locais">
            {({ navigation }) => (
              <PlaceList
                places={places}
                onAddPlace={handleAddPlace}
                onPlacePress={(place) => handlePlacePress(place, navigation)}
                onToggleFavorite={handleToggleFavorite}
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