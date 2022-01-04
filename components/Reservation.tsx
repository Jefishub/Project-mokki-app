import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
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
    remove?(): void;
}

export const Reservation = (buttonFunctions: CalendarProps) => {
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
                    <Button
                        onPress={() => setPickerState(picker(true))}
                        title={"Tulo"}
                        color={'#457b9d'}
                    />
                </View>
                <View style={styles.textBox}>
                    <Text>{selectedStartDateString}</Text>
                </View>
            </View>
            <View style={styles.buttonRow}>
                <View style={styles.button}>
                    <Button
                        onPress={() => setPickerState(picker(false))}
                        title={"Lähtö"}
                        color={'#457b9d'}
                    />
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
                style={styles.inputLong}
                placeholder='Muut tiedot'
                onChangeText={setInfo}
                value={info}
            />
            <View style={styles.buttonRow}>
                <Button
                    onPress={() => buttonFunctions.save({
                        startDate: selectedStartDate,
                        endDate: selectedEndDate,
                        reserver: reserver,
                        info: info
                    })}
                    title={"Tallenna"}
                    color={'#457b9d'}
                />
                <View style={{ width: 12 }}></View>
                <Button onPress={buttonFunctions.cancel} title={"Peruuta"} color={'grey'} />
                <View style={{ width: 12 }}></View>
                {buttonFunctions.remove
                    && <Button
                        onPress={buttonFunctions.remove}
                        title={"Poista"}
                        color={'#e63946'}
                    />}
            </View>
            {pickerState}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#a8dadc',
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
    },
    inputLong: {
        backgroundColor: 'white',
        padding: 6,
        margin: 6,
        height: 80,
        width: 230,
        borderWidth: 1,
    }
})