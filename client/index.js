import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Button from 'react-native-button';
import {fetchData, isOpen} from './data';
import {Details} from './details'

export class HomeScreen extends Component {
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
    //getting stored data on phone for offline use
    // if(this.state.Facilities == null){
    //   AsyncStorage.getItem('Facilities').then((localData) =>{
    //     this.setState({
    //       Facilities: JSON.parse(localData)
    //     });
    //   });
    // }

    //getting new data from server
    fetchData().then((data) => {
      // console.warn(data);
      if (!data) return;      
      this.setState({
        Facilities: data
      });
      AsyncStorage.setItem('Facilities', JSON.stringify(data));
     })
  }


  render() {
    const { navigate } = this.props.navigation;
    

    // if (this.state.Facilities != null){ 
    //   this.state.Facilities.sort((a,b) => {
    //     if (isOpen(a) == isOpen(b)) return 0;
    //     if (isOpen(a) && !isOpen(b)) return -1;
    //     if (!isOpen(a) && isOpen(b)) return 1;
    //   });
    // }
    return (
      <ScrollView style={styles.container}>
      {
        (this.state.Facilities != null) > 0 &&
        this.state.Facilities.map((facility) => {
          let statusStyle = styles.closed;
          if (facility.isOpen) statusStyle = styles.open;

          return (
            <Button
              key ={facility.slug}
              containerStyle={statusStyle}
              onPress={() => navigate('Details', { facility: facility })} 
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

 const App = StackNavigator({
  Home: { screen: HomeScreen },
  Details: { screen: Details }
});
export default App;