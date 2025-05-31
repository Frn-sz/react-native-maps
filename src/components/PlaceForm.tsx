import React, { useState } from 'react';

import {
    Alert,
    Button,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { MarkerInfo } from '../interfaces/Marker';

interface PlaceFormProps {
    onAddPlace: (newPlace: MarkerInfo) => void;
    onCancel: () => void;
}

export const PlaceForm = ({ onAddPlace, onCancel }: PlaceFormProps) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [latitude, setLatitude] = useState<string>('');
    const [longitude, setLongitude] = useState<string>('');

    const handleSubmit = () => {
        if (!title.trim() || !latitude.trim() || !longitude.trim()) {
            Alert.alert('Erro', 'Título, Latitude e Longitude são obrigatórios.');
            return;
        }

        const latNum = parseFloat(latitude);
        const lonNum = parseFloat(longitude);

        if (isNaN(latNum) || isNaN(lonNum)) {
            Alert.alert('Erro', 'Latitude e Longitude devem ser números válidos.');
            return;
        }

        const newPlace: MarkerInfo = {
            coordinate: {
                latitude: latNum,
                longitude: lonNum,
            },
            title: title.trim(),
            description: description.trim() === '' ? undefined : description.trim(),
        };

        onAddPlace(newPlace);
        setTitle('');
        setDescription('');
        setLatitude('');
        setLongitude('');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.heading}>Cadastrar Novo Local</Text>

                <Text style={styles.label}>Título:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome do local"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Descrição (opcional):</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Breve descrição"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <Text style={styles.label}>Latitude:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="-31.3320"
                    keyboardType="numeric"
                    value={latitude}
                    onChangeText={setLatitude}
                />

                <Text style={styles.label}>Longitude:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="-54.0717"
                    keyboardType="numeric"
                    value={longitude}
                    onChangeText={setLongitude}
                />

                <View style={styles.buttonContainer}>
                    <Button title="Salvar Local" onPress={handleSubmit} />
                    <Button title="Cancelar" onPress={onCancel} color="red" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
});