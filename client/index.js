import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  AsyncStorage,
  TouchableHighlight
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Button from 'react-native-button';
import { fetchData, isOpen, sortFacilitys } from './data';
import { isFacilityOpen, calcTimeTillOpen, calcTimeTillClose } from './isOpen';
import { Details } from './details'

export class MainScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      Facilities: null
    }
  }
  static navigationOptions = {
    title: "What's Open?",
  };  

  componentWillMount() {
    // AsyncStorage.clear();
    // getting stored data on phone for offline use
    if(this.state.Facilities == null){
      AsyncStorage.getItem('Facilities').then((localData) => {
        this.setState({
          Facilities: sortFacilitys(JSON.parse(localData))          
        });
      });
    }
    //getting new data from server
    fetchData().then((data) => {
      if (!data) return;      
      this.setState({
        Facilities: sortFacilitys(data)
      });
      AsyncStorage.setItem('Facilities', JSON.stringify(data));
     })
  }



  render() {
    const { navigate } = this.props.navigation;
    

    // if (this.state.Facilities != null){ 
    //   this.state.Facilities.sort((a,b) => {
    //     if (isFacilityOpen(a) == isFacilityOpen(b)) return 0;
    //     if (isFacilityOpen(a) && !isFacilityOpen(b)) return -1;
    //     if (!isFacilityOpen(a) && isFacilityOpen(b)) return 1;
    //   });
    // }
    // sortFacilitys(this.state.Facilities);
    return (
      <ScrollView style={styles.container}>
      {
        (this.state.Facilities != null) > 0 &&
        this.state.Facilities.map((facility) => {
          // let statusStyle = styles.closed;
          // if (isFacilityOpen(facility)) statusStyle = styles.open;

          return (
            // <Button
            //   key={facility.slug}
            //   containerStyle={statusStyle}
            //   onPress={() => navigate('Details', { facility: facility })} 
            // >
            // <Text style={styles.facilityName}> {facility.facility_name} ❯ </Text>
            
            // </Button>

            <TouchableHighlight
            key={facility.slug}
            style={styles.facility}
            underlayColor={isFacilityOpen(facility) ? '#006633' : '#AC1D37'}
            onPress={() => navigate('Details', {facility: facility })}
            >
            <View style={{justifyContent:'center', flexDirection: 'row'}}>
              <Text style={styles.facilityName}>{facility.facility_name} ❯ </Text>
              <View style={{justifyContent:'center', margin: 7}}>
                <View style={isFacilityOpen(facility) ? styles.open : styles.closed}> 
                  <Text style={{color: '#FFCC33', fontSize: 15, fontWeight: 'bold'}}> {isFacilityOpen(facility) ? 'Open' : 'Closed'} </Text>
                </View>
              </View>
            </View> 
            </TouchableHighlight>
          );
        })
      }
      <View style={{height: 10}} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: 10,
  },
  facilityName: {
    // padding: 20,
    flex: 1,
    margin: 10,
    fontSize: 19, 
    textAlign: 'center',
    textAlign: 'left'

  },
  open: {
      padding: 10,
      height: 30,
      justifyContent: 'center',
      backgroundColor: 'green',
      borderRadius: 10,
      padding: 5
    },
    closed: {
      padding: 10,      
      height: 30,   
      justifyContent: 'center',      
      backgroundColor: 'red',
      borderRadius: 10,
      padding: 5
    },
    facility: {
      margin: 9,
      marginTop: 0,
      height: 70,
      overflow: 'hidden',
      backgroundColor: '#e8e3be',
      borderRadius: 10,
      justifyContent: 'center'
    }
});

 const App = StackNavigator({
  Home: { screen: MainScreen },
  Details: { screen: Details }
});
export default App;