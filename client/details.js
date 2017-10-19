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
        this.state = {
            facility: this.props.navigation.state.params.facility
        }
    }
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.facility.facility_name
      });

    render () {
        return (
            <ScrollView>
                {
                    this.state.facility.open_times.map((day) => {
                        return (
                            <Text> {dayToString(day.start_day)}</Text>
                        );

                    })
                }
                <Text> {JSON.stringify(this.state.facility)} </Text>
            </ScrollView>
        );
    }

}