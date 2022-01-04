
import { View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import CONFIG from '../config/config';

const INITIAL_REGION = { latitude: 60.443346, longitude: 25.392492, latitudeDelta: 0.30, longitudeDelta: 0.30, };
const INITIAL_MARKER = { latitude: 60.443346, longitude: 25.392492 }
// location chosen randomly from map, 07150 Pornainen

type Selection = string | {latitude: number, longitude: number}

export default function MapScreen({ navigation }: RootTabScreenProps<'TabThree'>) {
    const [locationAddress, setLocationAddress] = useState('Kirjoita osoite');
    const [currentSelection, setCurrentSelection] = useState<Selection>('Helsinki');


    useEffect(() => {
        fetchCurrentLocation();
    }, []);

    const fetchCurrentLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('No permissionto get location');
            return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setCurrentSelection({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        })
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setLocationAddress}
                value={locationAddress}
            />
            <View style={{ width: 200, marginBottom: 16 }}>
                <Button
                    onPress={() => setCurrentSelection(locationAddress)}
                    title="Näytä reittiohjeet"
                />
            </View>
            <MapView initialRegion={INITIAL_REGION} style={styles.map}>
                <Marker coordinate={INITIAL_MARKER} />
                <MapViewDirections
                    lineDashPattern={[0]}
                    origin={currentSelection}
                    destination={INITIAL_MARKER}
                    strokeWidth={3}
                    strokeColor='hotpink'
                    apikey={CONFIG.google.google_api_key}
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        flex: 1,
        width: "100%",
        height: "100%"
    },
    input: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    }
});


