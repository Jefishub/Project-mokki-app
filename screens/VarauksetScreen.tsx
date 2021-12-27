import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, FlatList } from 'react-native'
import { getDatabase, push, ref, onValue } from "firebase/database";

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { DatePicker } from '../components/DatePicker';
import Firebase from '../utils/firebase';
import uuid from 'react-native-uuid';

interface Reservation {
  startDate: Date,
  endDate: Date,
  reserver: string,
  info: string
}

interface ReservationFromFirebase {
  startDate: string,
  endDate: string,
  reserver: string,
  info: string
}

const app = Firebase();
const database = getDatabase(app);

export default function VarauksetScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [showReservation, setShowReservation] = useState(false)

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reserver, setReserver] = useState('');
  const [info, setInfo] = useState('');
  const [reservationList, setReservationList] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      console.log('test');
      const data = snapshot.val();
      setReservationList(Object.values(data));
    })
  }, []);

  const saveReservation = (reserveration: Reservation) => {
    const id = uuid.v4();
    console.log(reserveration);
    push(ref(database, 'items/'),
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
    console.log(startDate);
    return (
      <View style={styles.listcontainer}>
        <Text style={{ fontSize: 18 }}>{item.reserver}, {item.info}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mökkivaraukset</Text>
      {showReservation
        ? <DatePicker cancel={cancelReservation} save={(reserveration) => saveReservation(reserveration)} />
        : <Button onPress={() => setShowReservation(true)} title={"Tee uusi reserveration"} />
      }
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <FlatList
        style={{ marginLeft: "5%" }}
        keyExtractor={item => item["id"]}
        renderItem={({ item }) => listView(item)}
        data={reservationList}
        ItemSeparatorComponent={listSeparator}
      />
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
