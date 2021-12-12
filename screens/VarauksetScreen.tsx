import React from 'react';
import { StyleSheet } from 'react-native'

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { DatePicker } from '../components/DatePicker';

export default function VarauksetScreen({ navigation }: RootTabScreenProps<'TabOne'>) {


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mökkivaraukset</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <DatePicker name="Tulo" />
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
