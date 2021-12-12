import React, { useState, useEffect } from 'react';
import { View, Button, Platform, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface CalendarProps {
    name: string;
}

const weekdays = ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"]

export const DatePicker = ({ name }: CalendarProps) => {
    const today = new Date();
    const [selectedDateTulo, setSelectedDateTulo] = useState(today);
    const [selectedDateStringTulo, setSelectedDateStringTulo] = useState('');
    const [selectedDateLahto, setSelectedDateLahto] = useState(today);
    const [selectedDateStringLahto, setSelectedDateStringLahto] = useState('');
    const [showTulo, setShowTulo] = useState(false);
    const [showLahto, setShowLahto] = useState(false);
    const [pickerState, setPickerState] = useState(<></>)

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
        changeString(selectedDateTulo);
        setPickerState(<></>);
    };

    const onChangeLahto = (event: any, newDate: any) => {
        setShowLahto(false);
        setSelectedDateLahto(newDate);
        changeString(selectedDateLahto);
    };

    const picker = () => {
        return (
            <DateTimePicker
                testID="dateTimePicker1"
                value={today}
                mode={"date"}
                onChange={(event: any, newDate: any) => {
                    onChangeTulo(event, newDate);                   
                }}
            />
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttonRow}>
                <View style={styles.button}>
                    <Button onPress={() => setPickerState(picker())} title={"Tulo"} />
                </View>
                <View style={styles.textBox}>
                    <Text>{selectedDateStringTulo}</Text>
                </View>
            </View>
            <View style={styles.buttonRow}>
                <View style={styles.button}>
                    <Button onPress={() => setShowLahto(true)} title={"Lähtö"} />
                </View>
                <View style={styles.textBox}>
                    <Text>{selectedDateStringLahto}</Text>
                </View>
            </View>
            {pickerState}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 100,
        height: 50,
        alignItems: 'center',
    },
    buttonRow: {
        flex: 1,
        flexDirection: "row"
    },
    button: {
        width: 80,
        height: 50
    },
    textBox: {
        width: 150,
        height: 35,
        borderBottomColor: 'black',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})