import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  AsyncStorage
} from 'react-native';
import Button from 'react-native-button';
import {fetchData} from './data';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      Facilities: null
    }
  }
  componentWillMount() {
    //getting stored data on phone for offline use
    if(this.state.Facilities == null){
      let localData = await AsyncStorage.getItem('Facilities');
      this.setState({
        Facilities: localData
      })
    }

    //getting new data from server
    fetchData().then((data) => {
      this.setState({
        Facilities: data
      });
      AsyncStorage.setItem('Facilities', JSON.stringify(data));
     })
  }
  render() {
    return (
      <ScrollView style={styles.container}>
      {
        (this.state.Facilities != null) > 0 &&
        this.state.Facilities.map((facility) => {
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
