import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';
import Button from 'react-native-button';
import { Facilitys } from './data';


export default class App extends Component {
  render() {
    return (
      <ScrollView style={styles.container}>
      
      {
        Facilitys.map((facility) => {
          return (
            <Button
              containerStyle={{margin: 1, padding:10, height:70, overflow:'hidden'}}
            >
            <Text style={styles.facilityName}> {facility.facility_name} ❯ </Text>

            </Button>
          );
          console.warn('ran');
        })
      }

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  facilityName: {
    textAlign: 'center',
    fontSize:20,    
  }
});
