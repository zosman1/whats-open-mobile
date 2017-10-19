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
import {fetchData, isOpen} from './data';

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
      AsyncStorage.getItem('Facilities').then((localData) =>{
        this.setState({
          Facilities: JSON.parse(localData)
        });
      });
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
    // let openFacilities = [];
    // let closedFacilities = [];
    // this.state.Facilities.forEach((facility) => {
    //   if(isOpen(facility)){
    //     openFacilities.push(facility);
    //   } else {
    //     closedFacilities.push(facility);
    //   }
    // });

    // this.state.Facilities.forEach((facility) => {
    //   facility["isOpen"] = isOpen(facility);
    // })

    if (this.state.Facilities != null){ 
      this.state.Facilities.sort((a,b) => {
        if (isOpen(a) == isOpen(b)) return 0;
        if (isOpen(a) && !isOpen(b)) return -1;
        if (!isOpen(a) && isOpen(b)) return 1;
      });
    }
    return (
      <ScrollView style={styles.container}>
      {
        (this.state.Facilities != null) > 0 &&
        this.state.Facilities.map((facility) => {
          let statusStyle = styles.closed;
          if (isOpen(facility)) statusStyle = styles.open;

          return (
            <Button
              containerStyle={statusStyle}
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
  },
  open: {
      margin: 1,
      padding: 10,
      height: 70,
      overflow: 'hidden',
      backgroundColor: 'green'
    },
    closed: {
      margin: 1,
      padding: 10,
      height: 70,
      overflow: 'hidden',
      backgroundColor: 'red'
    }
});
