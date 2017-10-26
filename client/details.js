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
            <View style={{flex:1,backgroundColor: '#4318AD'}}>   
            
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={{height:2}}></View>
                    {
                        this.state.facility.main_schedule.open_times.map((day) => {
                            // console.warn(day);
                            return (
                                <View 
                                style={styles.scheduleContainer}
                                key={day.start_day}
                                >
                                <Text style={styles.dayOfWeek}> {dayToString(day.start_day)}</Text>
                                <Text style={styles.hours}>Start Time: {day.start_time}</Text>
                                <Text style={styles.hours}>End Time: {day.end_time}</Text>
                                
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
      backgroundColor: '#4318AD',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    scheduleContainer: {
        margin: 4,
        padding: 10,
        backgroundColor: 'yellow',
        // justifyContent: 'center',
        alignItems: 'center',
        
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