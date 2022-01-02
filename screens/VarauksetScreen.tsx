import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, FlatList, ScrollView, Alert, Dimensions } from 'react-native'
import { getDatabase, ref, onValue, update, set, remove, orderByChild, query, limitToLast } from "firebase/database";
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { Reservation } from '../components/Reservation';
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
  startDate: number,
  endDate: number,
  reserver: string,
  info: string
}

const db = getDatabase(Firebase);

export default function VarauksetScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [showReservation, setShowReservation] = useState(false)
  const [reservationList, setReservationList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateId, setUpdateId] = useState('');

  useEffect(() => {
    getData()
  }, []);

  const getData = () => {
    const itemsRef = query(ref(db, 'reservations'), orderByChild('startDate'), limitToLast(100));
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setReservationList(Object.values(data));
      }
      else setReservationList([]);
    })
  }

  const saveReservation = (reserveration: Reservation) => {
    const id = (Date.parse(reserveration.startDate.toString())).toString() + uuid.v4();
    const itemsRef = ref(db, `reservations/${id}`);
    set(itemsRef,
      {
        'id': id,
        'startDate': Date.parse(reserveration.startDate.toString()),
        'endDate': Date.parse(reserveration.endDate.toString()),
        'reserver': reserveration.reserver,
        'info': reserveration.info
      });
    setShowReservation(false)
  }

  const updateReport = (reserveration: Reservation, id: string) => {
    const itemsRef = ref(db, `reservations/${id}`);
    update(itemsRef, {
      'id': id,
      'startDate': Date.parse(reserveration.startDate.toString()),
      'endDate': Date.parse(reserveration.endDate.toString()),
      'reserver': reserveration.reserver,
      'info': reserveration.info
    })
    setShowUpdate(false);
  }

  const cancelReservation = () => {
    setShowReservation(false)
  }

  const cancelUpdate = () => {
    setShowUpdate(false)
  }

  const removeReservation = (id: string) => {
    Alert.alert(
      'Poista tämä varaus:',
      'Oletko varma, että haluat poistaa varauksen ?',
      [
        {
          text: "peruuta",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Poista", onPress: () => {
            const itemsRef = ref(db, `reservations/${id}`);
            remove(itemsRef);
            setShowUpdate(false);
          }
        }
      ]
    )
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

  const toggleUpdate = (id: string) => {
    setUpdateId(id);
    setShowUpdate(true);
  }

  const listView = (item: ReservationFromFirebase) => {
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    return (
      <View style={styles.listcontainer}>
        <Text numberOfLines={1} style={{ fontSize: 18, backgroundColor: '#a8dadc', flex: 3, borderColor: 'black', borderBottomWidth: 1 }}>{item.reserver}</Text>
        <Text style={{ fontSize: 18, backgroundColor: '#a8dadc', flex: 5, borderColor: 'black', borderBottomWidth: 1 }}>{DateToString(startDate)}</Text>
        <Text style={{ fontSize: 18, backgroundColor: '#a8dadc', flex: 5, borderColor: 'black', borderBottomWidth: 1 }}>{DateToString(endDate)}</Text>
        <View style={{ flex: 2, alignItems: 'center' }}>
          {editMode
            ? <FontAwesome
              onPress={() => toggleUpdate(item.id)}
              name="pencil"
              size={25}
              color={'#457b9d'}
              style={{ marginRight: 15 }}
            />
            : <FontAwesome
              onPress={() => Alert.alert('Muut tiedot:', item.info)}
              name="info-circle"
              size={25}
              color={'#457b9d'}
              style={{ marginRight: 15 }}
            />
          }
        </View>
      </View>
    )
  }

  const firstColumn = () => {
    return (
      <View style={styles.firstColumn}>
        <Text style={{ color:'white',fontSize: 18, backgroundColor: '#457b9d', flex: 3 }}>Varaaja</Text>
        <Text style={{ color:'white',fontSize: 18, backgroundColor: '#457b9d', flex: 5 }}>Tulo</Text>
        <Text style={{ color:'white',fontSize: 18, backgroundColor: '#457b9d', flex: 5 }}>Lähtö</Text>
        <View style={{ flex: 1 }}></View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {showReservation
        ? <Reservation
          cancel={cancelReservation}
          save={(reserveration) => saveReservation(reserveration)}
        />
        :
        showUpdate ? <Reservation
          cancel={cancelUpdate}
          save={(reservation) => updateReport(reservation, updateId)}
          remove={() => removeReservation(updateId)}
        />
          :
          <>
            <View style={{ width: 150, alignSelf: 'center' }}>
              <Button onPress={() => setShowReservation(true)} title={"Tee uusi varaus"} color={'#457b9d'} />
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            {firstColumn()}
            <FlatList
              style={{ marginLeft: "5%", marginRight: "5%" }}
              keyExtractor={item => item["id"]}
              renderItem={({ item }) => listView(item)}
              data={reservationList}
              ItemSeparatorComponent={listSeparator}
            />
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <View style={{ marginBottom: 30, width: 150, alignSelf: 'center' }}>
              <Button onPress={
                () => setEditMode(!editMode)}
                title={editMode ? "Poistu muokkausmoodista" : "Muokkaa varauksia"}
                color={'#457b9d'}
              />
            </View>
          </>
      }
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
  firstColumn: {
    flexDirection: 'row',
    marginLeft: "5%",
    marginRight: "6.2%"
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
