import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';

export default class App extends Component {

  async createPDF() {

    let filePath = await Print.printToFileAsync({
      html: "<h1>PDF TEST</h1>",
      width : 612,
      height : 792,
      base64 : false
    });
    console.log(filePath.uri);

    FileSystem.getContentUriAsync(filePath.uri).then(cUri => {
        console.log(cUri);
        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: cUri,
          flags: 1,
        });
      });

    alert('PDF Generated', filePath.uri);
  }

  render() {
    return(
      <View>
        <TouchableHighlight onPress={this.createPDF} style={styles.Main}>
          <Text>Create PDF test</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Main : { marginTop : 100 }
});