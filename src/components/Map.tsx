import { ReactNode } from 'react';

import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { MarkerInfo } from '../interfaces/Marker';

const markers: MarkerInfo[] = [{
    coordinate: { latitude: -31.33202828209838, longitude: -54.071768758918644 },
    description: "Instituto Federal de Ciência e Tecnologia - Campus Bagé",
    title: "IFSUL Bagé"
}]

export const Map = () => {
    return (
        <>
            <MapView initialRegion={
                { latitude: -31.331964682774906, longitude: -54.07185976262321, latitudeDelta: 0.01, longitudeDelta: 0.01 }
            } style={styles.map}>
                {markers.map((marker: MarkerInfo, index: number): ReactNode =>
                    <Marker key={index} coordinate={marker.coordinate} description={marker.description} title={marker.title}></Marker>
                )}
            </MapView>
        </>
    )
}



const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: "100%"
    }
})