import React, { useState } from 'react';
import { StyleSheet, Button } from 'react-native'

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { DatePicker } from '../components/DatePicker';

interface Varaus {
  tulo: Date,
  lahto: Date,
  varaaja: string,
  info: string
}

export default function VarauksetScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [showReservation, setShowReservation] = useState(false)

  const saveReservation = (varaus: Varaus) => {

  }

  const cancelReservation = () => {
    setShowReservation(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mökkivaraukset</Text>
      {showReservation
        ? <DatePicker cancel={cancelReservation} save={(varaus) => saveReservation(varaus)} />
        : <Button onPress={() => setShowReservation(true)} title={"Tee uusi varaus"} />
      }
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
