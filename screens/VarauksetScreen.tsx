import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, FlatList, ScrollView, Alert, Dimensions } from 'react-native'
import { getDatabase, push, ref, onValue, update, set, remove } from "firebase/database";
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { DatePicker } from '../components/DatePicker';
import Firebase from '../utils/firebase';
import uuid from 'react-native-uuid';
import DateToString from '../utils/dateHelper';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';

interface Reservation {
  startDate: Date,
  endDate: Date,
  reserver: string,
  info: string
}

interface ReservationFromFirebase {
  id: string,
  startDate: string,
  endDate: string,
  reserver: string,
  info: string
}

const db = getDatabase(Firebase);

export default function VarauksetScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [showReservation, setShowReservation] = useState(false)
  const [reservationList, setReservationList] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => { 
    getData()
  }, []);

  const getData = () => {
    const itemsRef = ref(db, 'reservations/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setReservationList(Object.values(data));
      else setReservationList([]); 
    })
  }

  const saveReservation = (reserveration: Reservation) => {
    const id = uuid.v4();
    const itemsRef = ref(db, `reservations/${id}`);
    set(itemsRef, 
      {
        'id': id,
        'startDate': reserveration.startDate.toString(),
        'endDate': reserveration.endDate.toString(),
        'reserver': reserveration.reserver,
        'info': reserveration.info
      });
    setShowReservation(false)
  }

  const cancelReservation = () => {
    setShowReservation(false)
  }

  const removeReservation = (id: string) => {
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

  const listView = (item: ReservationFromFirebase) => {
    const startDate = new Date(Date.parse(item.startDate));
    const endDate = new Date(Date.parse(item.endDate));
    return (
      <View style={styles.listcontainer}>
          <Text style={{ fontSize: 18, backgroundColor: '#afffff', flex: 3 }}>{item.reserver}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#aaafff', flex: 5 }}>{DateToString(startDate)}</Text>
          <Text style={{ fontSize: 18, backgroundColor: '#ffffaa', flex: 5 }}>{DateToString(endDate)}</Text>
          <View style={{ flex: 2, alignItems: 'center' }}>
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
                      { text: "Poista", onPress: () => removeReservation(item.id) }
                    ]
                  )}
                name="trash"
                size={25}
                color={'red'}
                style={{ marginRight: 15 }}
              />
              : <FontAwesome
                onPress={() => Alert.alert('Muut tiedot:', item.info)}
                name="info-circle"
                size={25}
                color={'teal'}
                style={{ marginRight: 15 }}
              />
            }
          </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mökkivaraukset</Text>
      {showReservation
        ? <DatePicker cancel={cancelReservation} save={(reserveration) => saveReservation(reserveration)} />
        : <Button onPress={() => setShowReservation(true)} title={"Tee uusi varaus"} />
      }
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <FlatList
        style={{ marginLeft: "5%", marginRight: "5%" }}
        keyExtractor={item => item["id"]}
        renderItem={({ item }) => listView(item)}
        data={reservationList}
        ItemSeparatorComponent={listSeparator}
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={{ marginBottom: 30 }}>
        <Button onPress={
          () => setEditMode(!editMode)}
          title={editMode ? "Poistu muokkausmoodista" : "Muokkaa varauksia"}
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
  listcontainer: {
    paddingRight: '5%',
    width: Dimensions.get('window').width,
    flexDirection: 'row',
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
});
