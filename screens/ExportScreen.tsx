
import { View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, Alert, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import CONFIG from '../config';
import ExportPdf from '../components/PDFExport';

const mockData: userData = {
    nights: 4,
    electricity: 100,
    water: 5
}

type userData = {
    nights: number,
    electricity: number,
    water: number
  }

export default function ExportScreen({ navigation }: RootTabScreenProps<'TabFour'>) {
    

    return (
        <View style={styles.container}>
            <Button title='Tee uusi lasku' onPress={() => ExportPdf(mockData)} />
        </View>
    )
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


