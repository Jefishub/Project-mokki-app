import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, FlatList, Alert, Dimensions } from 'react-native'
import { getDatabase, ref, onValue, update } from "firebase/database";

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import Firebase from '../utils/firebase';
import DateToString from '../utils/dateHelper';
import { ReportSheet } from '../components/Reports';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';

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

const db = getDatabase(Firebase);

export default function RaportitScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [reportList, setReportList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [UpdateScreen, setUpdateScreen] = useState(<></>);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const itemsRef = ref(db, 'reservations/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setReportList(Object.values(data));
      else setReportList([]);
    })
  }

  const updateReport = (report: Report, id: string) => {
    const itemsRef = ref(db, `reservations/${id}`);
    update(itemsRef, {
      'id': id,
      'startDate': report.startDate.toString(),
      'endDate': report.endDate.toString(),
      'reserver': report.reserver,
      'electricityArrive': report.electricityArrive,
      'waterArrive': report.waterArrive,
      'electricityLeave': report.electricityLeave,
      'waterLeave': report.waterLeave,
      'info': report.info
    })
    setIsUpdating(false);
  }

  const cancelReport = () => {
    setIsUpdating(false);
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

  const showUpdateScreen = (id: string) => {
    setUpdateScreen(
      <View style={styles.container}>
        <ReportSheet cancel={cancelReport} save={(report) => updateReport(report, id)} />
      </View>
    );
    setIsUpdating(true);
  }

  const listView = (item: ReportFromFirebase) => {
    const startDate = new Date(Date.parse(item.startDate));
    const endDate = new Date(Date.parse(item.endDate));
    return (
      <View style={styles.containerReport}>
        <View style={styles.infoRow}>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', flex: 3 }}>{item.reserver}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#aaafff', flex: 5 }}>{DateToString(startDate)}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#ffffaa', flex: 5 }}>{DateToString(endDate)}</Text>
          <View style={{ flex: 3, alignItems: 'center' }}>
            {editMode
              ? <FontAwesome
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
                name="trash"
                size={25}
                color={'red'}
                style={{ marginRight: 15 }}
              />
              : <FontAwesome
                onPress={() => showUpdateScreen(item.id)}
                name="pencil"
                size={25}
                color={'teal'}
                style={{ marginRight: 15 }}
              />
            }
          </View>
        </View>
        <View style={styles.separatorItem} />
        {/* TODO Make string checks for numbers */}
        <View style={styles.infoRow}>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', flex: 3 }}>Sähkö:</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', flex: 5 }}>{item.electricityArrive}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', flex: 5 }}>{item.electricityLeave}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', flex: 3 }}>{Number(item.electricityLeave) - Number(item.electricityArrive)}</Text>
        </View>
        <View style={styles.separatorItem} />
        {/* TODO Make string checks for numbers */}
        <View style={styles.infoRow}>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', flex: 3 }}>Vesi:</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', flex: 5 }}>{Number(item.waterArrive).toFixed(3)}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', flex: 5 }}>{Number(item.waterLeave).toFixed(3)}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', flex: 3 }}>{(Number(item.waterLeave) - Number(item.waterArrive)).toFixed(3)}</Text>
        </View>
      </View>
    )
  }

  return (
    isUpdating
      ? UpdateScreen
      : (
        <View style={styles.container}>
          <Text style={styles.title}>Mökkivaraukset</Text>
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
              title={editMode ? "Takaisin" : "Poista raportteja"}              
            />
          </View>
        </View>
      )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerReport: {
    paddingRight: '5%',
    width: Dimensions.get('window').width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  separatorItem: {
    height: 1,
    width: '100%',
    backgroundColor: 'black'
  },
  infoRow: {
    flexDirection: "row",
    width: '100%'
  },
});
