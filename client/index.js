import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  AsyncStorage,
  TouchableHighlight,
  FlatList
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Button from 'react-native-button';
import { fetchData, isOpen, sortFacilitys } from './data';
import { isFacilityOpen, calcTimeTillOpen, calcTimeTillClose } from './isOpen';
import { Details } from './details'

class ListItem extends Component {
  _onPressItem = (facility) => {
    this.props.onPress(facility);
  }
  render() {
    let facility = this.props.facility;
    return (
      <TouchableHighlight
        key={facility.slug}
        style={styles.facility}
        underlayColor={isFacilityOpen(facility) ? '#006633' : '#AC1D37'}
        onPress={() => this._onPressItem(facility)}
      >
        <View style={{justifyContent:'center', flexDirection: 'row'}}>
          <Text style={styles.facilityName}>{facility.facility_name}</Text>
          <View style={{justifyContent:'center', margin: 7}}>
            <View style={isFacilityOpen(facility) ? styles.openView : styles.closedView}> 
              <Text style={isFacilityOpen(facility) ? styles.openText : styles.closedText}>
                {isFacilityOpen(facility) ? 'Open' : 'Closed'} 
              </Text>
            </View>
          </View>
        </View> 
      </TouchableHighlight>
  )
  }
}
 
export class MainScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      facilities: null,
      refreshing: false
    }
  }
  static navigationOptions = {
    title: "What's Open?",
  };  
  componentWillMount(isUpdate) {
    // isUpdate should be true if
    // this is coming from inside
    // a component, or from an update

    // AsyncStorage.clear();
    
    // getting stored data on phone for offline use
    if(this.state.facilities == null){
      AsyncStorage.getItem('facilities').then((localData) => {
        this.setState({
          facilities: sortFacilitys(JSON.parse(localData)),
          refreshing: false        
        });
      });
    }
    

    //getting new data from server
    this._updateFromServer();
  }


  // updating dom from server
  _updateFromServer = () => {
    console.warn(1)
    //getting new data from server
    fetchData().then((data) => {
      if (!data) return;      
      this.setState({
        facilities: sortFacilitys(data),
        refreshing: false
      });
      AsyncStorage.setItem('facilities', JSON.stringify(data));
      })
  }
  // extracting keys from data for react natives sanity
  _keyExtractor = (item, index) => item.slug;

  // handling onclick for ListItem
  _onPressItem = (facility) => {
    // updater functions are preferred for transactional updates
    this.props.navigation.navigate('Details', {facility: facility })
  }

  // handling the pull down to refresh
  _handleRefresh = () => {
    this.setState({
      refreshing: true
    }, () => {
      this._updateFromServer();
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <View style={{height: 10}}/>  */}
        <FlatList
          data={this.state.facilities}
          keyExtractor={this._keyExtractor}
          renderItem={({item}) => (
            <ListItem facility={item} onPress={this._onPressItem}/>
          )}
          ListHeaderComponent={() => (
            <View style={{height: 10}}/>
          )}
          refreshing={this.state.refreshing}
          onRefresh={this._handleRefresh}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  facilityName: {
    flex: 1,
    margin: 10,
    fontSize: 19, 
    textAlign: 'center',
    textAlign: 'left'

  },
  openText: {
    fontSize: 15,
    fontWeight: 'bold',
    color:'green'
  },
  closedText: {
    fontSize: 15,
    fontWeight: 'bold',
    color:'red'
  },
  openView: {
      padding: 10,
      height: 30,
      justifyContent: 'center',
      // backgroundColor: 'green',
      borderRadius: 10,
      padding: 5,
      borderWidth: 2,
      borderColor: 'green'
    },
    closedView: {
      padding: 10,      
      height: 30,   
      justifyContent: 'center',      
      // backgroundColor: 'red',
      borderRadius: 10,
      padding: 5,
      borderWidth: 2,
      borderColor: 'red'
    },
    facility: {
      margin: 9,
      marginTop: 0,
      height: 70,
      overflow: 'hidden',
      backgroundColor: '#eaecef',
      borderRadius: 10,
      justifyContent: 'center'
    }
});

 const App = StackNavigator({
  Home: { screen: MainScreen },
  Details: { screen: Details }
});
export default App;