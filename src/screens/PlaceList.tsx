import React, { useState } from 'react';

import * as Speech from 'expo-speech';
import {
    Alert,
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
    onUpdatePlace: (place: MarkerInfo) => void;
    onPlacePress: (place: MarkerInfo) => void;
    onToggleFavorite: (place: MarkerInfo) => void;
    onDeletePlace: (place: MarkerInfo) => void;
}



export const PlaceList = ({ places, onAddPlace, onUpdatePlace, onPlacePress, onToggleFavorite, onDeletePlace }: PlaceListProps) => {
    const [modalVisivel, toggleModal] = useState(false);
    const [localSendoEditado, setUpdatingPlace] = useState<MarkerInfo | null>(null);

    const handleDelete = (place: MarkerInfo) => {
        Alert.alert(
            "Confirmar Exclusão",
            `Você tem certeza que deseja excluir o local "${place.title}"?`,
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Exclusão cancelada"),
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    onPress: () => onDeletePlace(place),
                    style: "destructive"
                }
            ]
        );
    };

    const handleFormSubmit = (placeData: MarkerInfo) => {
        if (placeData.id) {
            onUpdatePlace(placeData);
        } else {
            onAddPlace(placeData);
        }
        toggleModal(false);
    };

    const handleAdd = () => {
        setUpdatingPlace(null);
        toggleModal(true);
    };

    const handleEdit = (place: MarkerInfo) => {
        setUpdatingPlace(place);
        toggleModal(true);
    };


    const speakDescription = (text: string | undefined) => {
        if (text) {
            Speech.speak(text, { language: 'pt-BR' });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Locais Salvos</Text>
                <Button title="Adicionar Novo Local" onPress={handleAdd} />
            </View>

            {places.length === 0 ? (
                <Text style={styles.noPlacesText}>Nenhum local cadastrado ainda.</Text>
            ) : (
                <FlatList
                    data={places}
                    keyExtractor={(item) => item.id!.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.placeItem}>
                            <TouchableOpacity style={styles.placeInfo} onPress={() => onPlacePress(item)}>
                                <Text style={styles.placeTitle}>{item.title}</Text>
                                {item.description && (
                                    <Text style={styles.placeDescription}>{item.description}</Text>
                                )}
                                <Text style={styles.placeCoords}>
                                    Lat: {item.coordinate.latitude.toFixed(4)}, Lon: {item.coordinate.longitude.toFixed(4)}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.actionsContainer}>
                                <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item)}>
                                    <Icon name="pencil" size={24} color="#007BFF" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item)}>
                                    <Icon name="trash-outline" size={24} color="red" />
                                </TouchableOpacity>


                                <TouchableOpacity style={styles.actionButton} onPress={() => speakDescription(item.description || item.title)}>
                                    <Icon name="volume-high-outline" size={24} color="purple" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionButton} onPress={() => onToggleFavorite(item)}>
                                    <Icon
                                        name={item.isFavorite ? 'bookmark' : 'bookmark-outline'}
                                        size={24}
                                        color={item.isFavorite ? 'gold' : 'gray'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}

            <Modal
                visible={modalVisivel}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => toggleModal(false)}
            >
                <PlaceForm
                    onSubmit={handleFormSubmit}
                    initialData={localSendoEditado}
                    onCancel={() => toggleModal(false)}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: '#f0f0f0',
        paddingVertical: 50,
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
        paddingVertical: 15,
        paddingHorizontal: 10,
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
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    actionButton: {
        padding: 5,
        marginLeft: 10,
    },
});