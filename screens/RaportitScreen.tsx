import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, FlatList, ScrollView, Alert } from 'react-native'
import { getDatabase, push, ref, onValue } from "firebase/database";

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import Firebase from '../utils/firebase';
import uuid from 'react-native-uuid';
import DateToString from '../utils/dateHelper';
import { ReportSheet } from '../components/Reports';

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

interface ReportFromFirebase {
  id: string,
  startDate: string,
  endDate: string,
  reserver: string,
  electricityArrive: string,
  waterArrive: string,
  electricityLeave: string,
  waterLeave: string,
  info: string
}

const app = Firebase();
const database = getDatabase(app);

export default function RaportitScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [showReport, setShowReport] = useState(false)
  const [reportList, setReportList] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const itemsRef = ref(database, 'reports/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      setReportList(Object.values(data));
    })
  }, []);

  const saveReport = (report: Report) => {
    const id = uuid.v4();
    console.log(report);
    push(ref(database, 'reports/'),
      {
        'id': id,
        'startDate': report.startDate.toString(),
        'endDate': report.endDate.toString(),
        'reserver': report.reserver,
        'electricityArrive': report.electricityArrive,
        'waterArrive': report.waterArrive,
        'electricityLeave': report.electricityLeave,
        'waterLeave': report.waterLeave,
        'info': report.info
      });
    setShowReport(false)
  }

  const cancelReport = () => {
    setShowReport(false)
  }

  const removeReport = () => {
    // TODO
    console.log("removed");
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  const listView = (item: ReportFromFirebase) => {
    const startDate = new Date(Date.parse(item.startDate));
    const endDate = new Date(Date.parse(item.endDate));
    return (
      <View style={styles.containerReport}>
        <View style={styles.infoRow}>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', flex: 3 }}>{item.reserver}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#aaafff', flex: 5 }}>{DateToString(startDate)}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#ffffaa', flex: 5 }}>{DateToString(endDate)}</Text>
          <View style={{flex: 2}}>
            {editMode
              ? <Button
                onPress={() =>
                  Alert.alert(
                    'Poista tämä varaus:',
                    'Oletko varma, että haluat poistaa varauksen ?',
                    [
                      {
                        text: "peruuta",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      { text: "Poista", onPress: () => removeReport() }
                    ]
                  )}
                title={'DEL'}
                color={'red'}
              />
              : <Button onPress={() => Alert.alert('Muut tiedot:', item.info)} title={'info'} />
            }
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', width: 70 }}>Sähkö:</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', width: 100 }}>{item.electricityArrive}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', width: 100 }}>{item.electricityLeave}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', width: 100 }}>{Number(item.electricityLeave) - Number(item.electricityArrive)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', width: 70 }}>Vesi:</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', width: 100 }}>{Number(item.waterArrive).toFixed(3)}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', width: 100 }}>{Number(item.waterLeave).toFixed(3)}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', width: 100 }}>{(Number(item.waterLeave) - Number(item.waterArrive)).toFixed(3)}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mökkivaraukset</Text>
      {showReport
        ? <ReportSheet cancel={cancelReport} save={(report) => saveReport(report)} />
        : <Button onPress={() => setShowReport(true)} title={"Tee uusi raportti"} />
      }
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <FlatList
        style={{ marginLeft: "5%", marginRight: "5%" }}
        keyExtractor={item => item["id"]}
        renderItem={({ item }) => listView(item)}
        data={reportList}
        ItemSeparatorComponent={listSeparator}
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={{ marginBottom: 30 }}>
        <Button onPress={
          () => setEditMode(!editMode)}
          title={editMode ? "Poistu muokkausmoodista" : "Muokkaa raportteja"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerReport: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  listcontainer: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  title: {
    marginBottom: 12,
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  infoRow: {
    flexDirection: "row"
  },
});
