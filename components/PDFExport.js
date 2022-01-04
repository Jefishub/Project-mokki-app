import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Button } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import HTMLcontentForPDF from '../utils/pdfExport';

export default PDFExport = (data) => {

    const createPDF = async () => {

        let filePath = await Print.printToFileAsync({
            html: HTMLcontentForPDF(data),
            width: 612,
            height: 792,
            base64: false
        });

        FileSystem.getContentUriAsync(filePath.uri).then(cUri => {
            console.log(cUri);
            IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                data: cUri,
                flags: 1,
            });
        });
    }

    return createPDF()
}

const styles = StyleSheet.create({
    Main: { marginTop: 100 }
});