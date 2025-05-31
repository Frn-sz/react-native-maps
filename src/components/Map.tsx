import React, { ReactNode } from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';
import MapView, {
  Marker,
  Region,
} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

import { MarkerInfo } from '../interfaces/Marker';

interface MapProps {
  extraMarkers?: MarkerInfo[];
  initialRegion?: Region;
}

export const Map = ({ extraMarkers = [], initialRegion }: MapProps) => {
  const allMarkers: MarkerInfo[] = [...extraMarkers];

  const defaultInitialRegion: Region = {
    latitude: -31.331964682774906,
    longitude: -54.07185976262321,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        initialRegion={initialRegion || defaultInitialRegion}
        style={styles.map}
      >
        {allMarkers.map((marker: MarkerInfo, index: number): ReactNode =>
          <Marker
            key={index}
            coordinate={marker.coordinate}
            description={marker.description}
            title={marker.title}
          >
            <Icon
              name={marker.isFavorite ? 'location' : 'location-outline'}
              size={30}
              color={marker.isFavorite ? 'red' : 'blue'}
            />
          </Marker>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%"
  }
});