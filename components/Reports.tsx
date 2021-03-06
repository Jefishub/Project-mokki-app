import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native-gesture-handler';
import DateToString from '../utils/dateHelper';

interface Report {
    startDate: Date,
    endDate: Date,
    reserver: string,
    electricityArrive: string,
    waterArrive: string,
    electricityLeave: string,
    waterLeave: string,
    info: string
}

interface ReportProps {
    save(report: Report): void,
    cancel(): void;
    remove(): void;
    report: Report;
}

export const ReportSheet = (reportProps: ReportProps) => {
    const today = new Date();
    const [selectedStartDate, setSelectedStartDate] = useState(reportProps.report.startDate);
    const [selectedStartDateString, setSelectedStartDateString] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState(reportProps.report.endDate);
    const [selectedEndDateString, setSelectedEndDateString] = useState('');
    const [pickerState, setPickerState] = useState(<></>);
    const [reserver, setReserver] = useState(reportProps.report.reserver);
    const [electricityArrive, setElectricityArrive] = useState(reportProps.report.electricityArrive);
    const [waterArrive, setWaterArrive] = useState(reportProps.report.waterArrive);
    const [electricityLeave, setElectricityLeave] = useState(reportProps.report.electricityLeave);
    const [waterLeave, setWaterLeave] = useState(reportProps.report.waterLeave);
    const [info, setInfo] = useState(reportProps.report.info);

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
                        title={"L??ht??"}
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
            <View style={styles.buttonRow}>
                <TextInput
                    style={styles.inputNumber}
                    placeholder='S??hk?? (tulo)'
                    onChangeText={setElectricityArrive}
                    value={electricityArrive}
                    keyboardType={'number-pad'}
                />
                <TextInput
                    style={styles.inputNumber}
                    placeholder='S??hk?? (l??ht??)'
                    onChangeText={setElectricityLeave}
                    value={electricityLeave}
                    keyboardType={'number-pad'}
                />
            </View>
            <View style={styles.buttonRow}>
                <TextInput
                    style={styles.inputNumber}
                    placeholder='Vesi (tulo)'
                    onChangeText={setWaterArrive}
                    value={waterArrive}
                    keyboardType={'number-pad'}
                />
                <TextInput
                    style={styles.inputNumber}
                    placeholder='Vesi (l??ht??)'
                    onChangeText={setWaterLeave}
                    value={waterLeave}
                    keyboardType={'number-pad'}
                />
            </View>
            <TextInput
                style={styles.inputLong}
                placeholder='Muut tiedot'
                onChangeText={setInfo}
                value={info}
            />
            <View style={styles.buttonRow}>
                <Button
                    onPress={() => reportProps.save({
                        startDate: selectedStartDate,
                        endDate: selectedEndDate,
                        reserver: reserver,
                        electricityArrive: electricityArrive,
                        waterArrive: waterArrive,
                        electricityLeave: electricityLeave,
                        waterLeave: waterLeave,
                        info: info
                    })}
                    title={"Tallenna"}
                    color={'#457b9d'} />
                <View style={{ width: 12 }}></View>
                <Button onPress={reportProps.cancel} title={"Peruuta"} color={'grey'} />
                <View style={{ width: 12 }}></View>
                <Button
                    onPress={reportProps.remove}
                    title={"Poista"}
                    color={'#e63946'}
                />
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
    },
    inputNumber: {
        backgroundColor: 'white',
        padding: 6,
        margin: 6,
        height: 40,
        width: 110,
        borderWidth: 1,
    }
})