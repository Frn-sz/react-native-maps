import React, { useState } from 'react';

import {
    Button,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { MarkerInfo } from '../interfaces/Marker';
import { PlaceForm } from './PlaceForm';

interface PlaceListProps {
    places: MarkerInfo[];
    onAddPlace: (newPlace: MarkerInfo) => void;
    onPlacePress: (place: MarkerInfo) => void;
    onToggleFavorite: (placeId: string) => void;
}

export const PlaceList = ({ places, onAddPlace, onPlacePress, onToggleFavorite }: PlaceListProps) => {
    const [showForm, setShowForm] = useState(false);

    const handleFormSubmit = (newPlace: MarkerInfo) => {
        onAddPlace(newPlace);
        setShowForm(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Locais Salvos</Text>
                <Button title="Adicionar Novo Local" onPress={() => setShowForm(true)} />
            </View>

            {places.length === 0 ? (
                <Text style={styles.noPlacesText}>Nenhum local cadastrado ainda.</Text>
            ) : (
                <FlatList
                    data={places}
                    keyExtractor={(item, index) => item.title + index + item.coordinate.latitude}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.placeItem} onPress={() => onPlacePress(item)}>
                            <View style={styles.placeInfo}>
                                <Text style={styles.placeTitle}>{item.title}</Text>
                                {item.description && (
                                    <Text style={styles.placeDescription}>{item.description}</Text>
                                )}
                                <Text style={styles.placeCoords}>
                                    Lat: {item.coordinate.latitude.toFixed(4)}, Lon: {item.coordinate.longitude.toFixed(4)}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.favoriteButton} onPress={() => onToggleFavorite(item.title)}>
                                <Icon
                                    name={item.isFavorite ? 'bookmark' : 'bookmark-outline'}
                                    size={24}
                                    color={item.isFavorite ? 'gold' : 'gray'}
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                />
            )}

            <Modal
                visible={showForm}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowForm(false)}
            >
                <PlaceForm
                    onAddPlace={handleFormSubmit}
                    onCancel={() => setShowForm(false)}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 50,
        paddingHorizontal: 15,
        backgroundColor: '#f0f0f0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    noPlacesText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
    },
    placeItem: {
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
    favoriteButton: {
        padding: 5,
    },
});