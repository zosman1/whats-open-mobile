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
import { fetchData, isOpen, dayToString } from './data';

 
export class Details extends Component {
    constructor(props){
        super(props);
        // console.warn(this.props);
        this.state = {
            facility: this.props.navigation.state.params.facility
        }
    }
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.facility.facility_name
      });

    render () {
        return (
            <View style={{flex:1,backgroundColor: '#A0C9C1'}}>
                <Text style={styles.facilityType}> {this.state.facility.facility_category.name} </Text>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={{height:2}}></View>
                    {
                        this.state.facility.main_schedule.open_times.map((day) => {
                            return (
                                <View 
                                style={styles.scheduleContainer}
                                key={day.start_day}
                                >
                                <Text style={styles.dayOfWeek}> {dayToString(day.start_day)}</Text>
                                <Text style={styles.hours}> {day.start_time} - {day.end_time}</Text>
                                </View>
                                
                            );

                        })
                    }
                </ScrollView>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    scrollContainer: {
      backgroundColor: '#A0C9C1',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    scheduleContainer: {
        margin: 6,
        padding: 10,
        height: 70,
        backgroundColor: 'darkgrey',
        // justifyContent: 'center',
        alignItems: 'center',
        
        },
    facilityType: {
        fontSize: 30,
        // textAlign: 'center',
    },
    dayOfWeek: {
        fontSize: 20
    },
    hours: {
        fontSize: 15
    }
    // facilityName: {
    //   textAlign: 'center',
    //   fontSize:20,    
    // },
    // open: {
    //     margin: 1,
    //     padding: 10,
    //     height: 70,
    //     overflow: 'hidden',
    //     backgroundColor: 'green'
    //   },
    //   closed: {
    //     margin: 1,
    //     padding: 10,
    //     height: 70,
    //     overflow: 'hidden',
    //     backgroundColor: 'red'
    //   }
  });