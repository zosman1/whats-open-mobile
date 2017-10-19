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
                <Text> {JSON.stringify(this.state.facility)} </Text>
            </ScrollView>
        );
    }

}