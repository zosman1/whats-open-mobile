import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  AsyncStorage,
  FlatList
} from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { StackNavigator } from 'react-navigation';
import Button from 'react-native-button';
import { fetchData, isOpen, dayToString, milToStandard } from './data';


 
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

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.facilityType}> {this.state.facility.facility_category.name} </Text>
                <TableView>
                    <Section sectionTintColor='white' header='Hours'>
                        {
                            this.state.facility.main_schedule.open_times.map((schedule,i = 0) => {
                                return (
                                    <Cell
                                        cellStyle="RightDetail"
                                        title={dayToString(schedule.start_day)}
                                        detail={`${milToStandard(schedule.start_time)} - ${milToStandard(schedule.end_time)}`}
                                        key={i}

                                    />
                                )
                                i++;
                            })
                        }
                    </Section>


                </TableView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    facilityType: {
        fontSize: 30,
        fontWeight: 'bold',
        padding: 10
        // textAlign: 'center',
    },
    dayOfWeek: {
        fontSize: 20
    },
    hours: {
        fontSize: 15
    }
  });