import React, { useState, useEffect } from 'react';
import { View, Button, Platform, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native-gesture-handler';
import DateToString from '../utils/dateHelper';

interface Reservation {
    startDate: Date,
    endDate: Date,
    reserver: string,
    info: string
}

interface CalendarProps {
    save(reserveration: Reservation): void,
    cancel(): void;
}

const weekdays = ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"]

export const DatePicker = (buttonFunctions: CalendarProps) => {
    const today = new Date();
    const [selectedStartDate, setSelectedStartDate] = useState(today);
    const [selectedStartDateString, setSelectedStartDateString] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState(today);
    const [selectedEndDateString, setSelectedEndDateString] = useState('');
    const [pickerState, setPickerState] = useState(<></>);
    const [reserver, setReserver] = useState('');
    const [info, setInfo] = useState('');

    useEffect(() =>
        setSelectedStartDateString(DateToString(selectedStartDate))
        , [selectedStartDate])

    useEffect(() =>
        setSelectedEndDateString(DateToString(selectedEndDate))
        , [selectedEndDate])

    const onChangeStartDate = (event: any, newDate: any) => {
        setSelectedStartDate(newDate);
        setPickerState(<></>);
    };

    const onChangeEndDate = (event: any, newDate: any) => {
        setSelectedEndDate(newDate);
        setPickerState(<></>);
    };

    const picker = (isStartDate: boolean) => {
        return (
            <DateTimePicker
                testID="dateTimePicker1"
                value={today}
                mode={"date"}
                onChange={(event: any, newDate: any) => {
                    isStartDate
                        ? onChangeStartDate(event, newDate)
                        : onChangeEndDate(event, newDate);
                }}
            />
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttonRow}>
                <View style={styles.button}>
                    <Button onPress={() => setPickerState(picker(true))} title={"Tulo"} />
                </View>
                <View style={styles.textBox}>
                    <Text>{selectedStartDateString}</Text>
                </View>
            </View>
            <View style={styles.buttonRow}>
                <View style={styles.button}>
                    <Button onPress={() => setPickerState(picker(false))} title={"Lähtö"} />
                </View>
                <View style={styles.textBox}>
                    <Text>{selectedEndDateString}</Text>
                </View>
            </View>
            <TextInput
                style={styles.input}
                placeholder='Varaaja'
                onChangeText={setReserver}
                value={reserver}
            />
            <TextInput
                style={styles.input}
                placeholder='Muut tiedot'
                onChangeText={setInfo}
                value={info}
            />
            <View style={styles.buttonRow}>
                <Button onPress={() => buttonFunctions.save({
                    startDate: selectedStartDate,
                    endDate: selectedEndDate,
                    reserver: reserver,
                    info: info
                })} title={"Tallenna reserveration"} />
                <View style={{ width: 12 }}></View>
                <Button onPress={buttonFunctions.cancel} title={"Peruuta"} color={'grey'} />
            </View>
            {pickerState}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: 12,
        backgroundColor: 'lightblue',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonRow: {
        flexDirection: "row"
    },
    button: {
        width: 80,
        height: 50
    },
    textBox: {
        backgroundColor: 'white',
        width: 150,
        height: 35,
        borderBottomColor: 'black',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        backgroundColor: 'white',
        padding: 6,
        margin: 6,
        height: 40,
        width: 230,
        borderWidth: 1,
    }
})