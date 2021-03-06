import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Alert, Dimensions } from 'react-native'
import { getDatabase, ref, onValue, update, remove } from "firebase/database";

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import firebase from 'firebase/compat/app';
import DateToString from '../utils/dateHelper';
import { ReportSheet } from '../components/Reports';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import CONFIG from '../config/config';
import ExportPdf from '../components/PDFExport';

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
  startDate: number,
  endDate: number,
  reserver: string,
  electricityArrive: string,
  waterArrive: string,
  electricityLeave: string,
  waterLeave: string,
  info: string
}

type userData = {
  nights: number,
  electricity: number,
  water: number
}

const firebaseApp = firebase.initializeApp(CONFIG.firebase.firebaseConfig)
const db = getDatabase(firebaseApp);

export default function RaportitScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [reportList, setReportList] = useState([]);
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
      'startDate': Date.parse(report.startDate.toString()),
      'endDate': Date.parse(report.endDate.toString()),
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

  const removeReport = (id: string) => {
    const itemsRef = ref(db, `reservations/${id}`);
    remove(itemsRef);
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

  const showUpdateScreen = (report: Report, id: string) => {
    setUpdateScreen(
      <View style={styles.container}>
        <ReportSheet
          cancel={cancelReport}
          save={(updatedReport) => updateReport(updatedReport, id)}
          remove={() => removeReservation(id)}
          report={report}
        />
      </View>
    );
    setIsUpdating(true);
  }

  const removeReservation = (id: string) => {
    Alert.alert(
      'Poista t??m?? varaus:',
      'Oletko varma, ett?? haluat poistaa varauksen ?',
      [
        {
          text: "peruuta",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Poista", onPress: () => {
            removeReport(id);
            setIsUpdating(false);
          }
        }
      ]
    )
  }

  const dateDiff = (d1: Date, d2: Date) => {
    var t2 = d2.getTime();
    var t1 = d1.getTime();

    return Math.floor((t2 - t1) / (24 * 3600 * 1000));
  }


  const ExportData = (item: ReportFromFirebase) => {
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    const nights = dateDiff(startDate, endDate);
    const currentReport: userData = {
      'nights': nights,
      'electricity': Number(item.electricityLeave) - Number(item.electricityArrive),
      'water': Number(item.waterLeave) - Number(item.waterArrive),
    }
    ExportPdf(currentReport)
  }

  const listView = (item: ReportFromFirebase) => {
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    const currentReport = {
      'startDate': startDate,
      'endDate': endDate,
      'reserver': item.reserver,
      'electricityArrive': item.electricityArrive,
      'waterArrive': item.waterArrive,
      'electricityLeave': item.electricityLeave,
      'waterLeave': item.waterLeave,
      'info': item.info
    }

    return (
      <View style={styles.containerReport}>
        <View style={styles.infoRow}>
          <Text numberOfLines={1} style={{ fontSize: 18, backgroundColor: '#a8dadc', flex: 3 }}>{item.reserver}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#a8dadc', flex: 4 }}>{DateToString(startDate)}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#a8dadc', flex: 4 }}>{DateToString(endDate)}</Text>
          <View style={{ flex: 3, alignItems: 'center', flexDirection: "row" }}>
            <FontAwesome
              onPress={() => showUpdateScreen(currentReport, item.id)}
              name="pencil"
              size={25}
              color={'#457b9d'}
              style={{ marginHorizontal: 6 }}
            />
            <FontAwesome
              onPress={() => ExportData(item)}
              name="save"
              size={25}
              color={'#457b9d'}
              style={{ marginRight: 6 }}
            />
          </View>
        </View>
        <View style={styles.separatorItem} />
        {/* TODO Make string checks for numbers */}
        <View style={styles.infoRow}>
          <Text style={{ fontSize: 18, backgroundColor: '#a8dadc', flex: 3 }}>S??hk??:</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#a8dadc', flex: 4 }}>{item.electricityArrive}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#a8dadc', flex: 4 }}>{item.electricityLeave}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#f1faee', flex: 3 }}>{Number(item.electricityLeave) - Number(item.electricityArrive)}</Text>
        </View>
        <View style={styles.separatorItem} />
        {/* TODO Make string checks for numbers */}
        <View style={styles.infoRow}>
          <Text style={{ fontSize: 18, backgroundColor: '#a8dadc', flex: 3 }}>Vesi:</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#a8dadc', flex: 4 }}>{Number(item.waterArrive).toFixed(3)}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#a8dadc', flex: 4 }}>{Number(item.waterLeave).toFixed(3)}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#f1faee', flex: 3 }}>{(Number(item.waterLeave) - Number(item.waterArrive)).toFixed(3)}</Text>
        </View>
      </View>
    )
  }

  const firstColumn = () => {
    return (
      <View style={styles.firstColumn}>
        <Text style={{ color: 'white', fontSize: 18, backgroundColor: '#457b9d', flex: 3 }}>Varaaja</Text>
        <Text style={{ color: 'white', fontSize: 18, backgroundColor: '#457b9d', flex: 4 }}>Tulo</Text>
        <Text style={{ color: 'white', fontSize: 18, backgroundColor: '#457b9d', flex: 4 }}>L??ht??</Text>
        <Text style={{ color: 'white', fontSize: 18, backgroundColor: '#457b9d', flex: 3 }}>Erotus</Text>
      </View>
    )
  }

  return (
    isUpdating
      ? UpdateScreen
      : (
        <View style={styles.container}>
          {firstColumn()}
          <FlatList
            style={{ marginLeft: "5%", marginRight: "5%" }}
            keyExtractor={item => item["id"]}
            renderItem={({ item }) => listView(item)}
            data={reportList}
            ItemSeparatorComponent={listSeparator}
          />
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
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
  firstColumn: {
    flexDirection: 'row',
    marginLeft: "5%",
    marginRight: "5%"
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
