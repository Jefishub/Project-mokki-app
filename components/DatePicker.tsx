import React, { useState, useEffect } from 'react';
import { View, Button, Platform, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native-gesture-handler';

interface Varaus {
    tulo: Date,
    lahto: Date,
    varaaja: string,
    info: string
}

interface CalendarProps {
    save(varaus: Varaus): void,
    cancel(): void;
}

const weekdays = ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"]

export const DatePicker = (buttonFunctions: CalendarProps) => {
    const today = new Date();
    const [selectedDateTulo, setSelectedDateTulo] = useState(today);
    const [selectedDateStringTulo, setSelectedDateStringTulo] = useState('');
    const [selectedDateLahto, setSelectedDateLahto] = useState(today);
    const [selectedDateStringLahto, setSelectedDateStringLahto] = useState('');
    const [pickerState, setPickerState] = useState(<></>);
    const [varaaja, setVaraaja] = useState('');
    const [info, setInfo] = useState('');

    useEffect(() =>
        changeString(selectedDateTulo)
        , [selectedDateTulo])

    useEffect(() =>
        changeString(selectedDateLahto)
        , [selectedDateLahto])

    const changeString = (typeString: Date) => {
        const weekday = weekdays[typeString.getDay()]
        typeString == selectedDateTulo
            ? setSelectedDateStringTulo(
                `${weekday} ${selectedDateTulo.getUTCDate()}.${selectedDateTulo.getUTCMonth() + 1}.${selectedDateTulo.getUTCFullYear()}`
            )
            : setSelectedDateStringLahto(
                `${weekday} ${selectedDateLahto.getUTCDate()}.${selectedDateLahto.getUTCMonth() + 1}.${selectedDateLahto.getUTCFullYear()}`
            )
            ;
    };

    const onChangeTulo = (event: any, newDate: any) => {
        setSelectedDateTulo(newDate);
        setPickerState(<></>);
    };

    const onChangeLahto = (event: any, newDate: any) => {
        setSelectedDateLahto(newDate);
        setPickerState(<></>);
    };

    const picker = (isTulo: boolean) => {
        return (
            <DateTimePicker
                testID="dateTimePicker1"
                value={today}
                mode={"date"}
                onChange={(event: any, newDate: any) => {
                    isTulo
                        ? onChangeTulo(event, newDate)
                        : onChangeLahto(event, newDate);
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
                    <Text>{selectedDateStringTulo}</Text>
                </View>
            </View>
            <View style={styles.buttonRow}>
                <View style={styles.button}>
                    <Button onPress={() => setPickerState(picker(false))} title={"Lähtö"} />
                </View>
                <View style={styles.textBox}>
                    <Text>{selectedDateStringLahto}</Text>
                </View>
            </View>
            <TextInput
                style={styles.input}
                placeholder='Varaaja'
                onChangeText={setVaraaja}
                value={varaaja}
            />
            <TextInput
                style={styles.input}
                placeholder='Muut tiedot'
                onChangeText={setInfo}
                value={info}
            />
            <View style={styles.buttonRow}>
                <Button onPress={() => buttonFunctions.save({
                    tulo: selectedDateTulo,
                    lahto: selectedDateLahto,
                    varaaja: varaaja,
                    info: info
                })} title={"Tallenna varaus"} />
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