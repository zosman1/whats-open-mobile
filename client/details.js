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
import MyText from 'react-native-letter-spacing';
import { fetchData, isOpen, dayToString, milToStandard } from './data';


 
export class Details extends Component {
    constructor(props){
        super(props);
        // console.warn(this.props);
        this.state = {
            facility: this.props.navigation.state.params.facility,
            scheduleType: "main_schedule"
        }
    }
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.facility.facility_name
      });

    componentWillMount() {
        //special schedules stuff
        if(this.state.facility.special_schedules.id == null){
            //special schedules are in use
            this.setState({
                scheduleType: "special_schedules"
            });

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{marginLeft: '2%'}}>
                <Text style={styles.facilityType}>{this.state.facility.facility_category.name}</Text>
                <MyText letterSpacing={1.4} style={styles.facilityLocation}>{this.state.facility.facility_location.building.toUpperCase()}</MyText>
                {
                    this.state.scheduleType == "special_schedules" > 0 &&
                    <Text>Special Schedule!</Text>
                }
                </View> 

                <TableView>
                    <Section sectionTintColor='#F7F7F7' header='Hours'>
                        {
                            this.state.facility[this.state.scheduleType].twenty_four_hours > 0 &&
                            this.state.facility[this.state.scheduleType].open_times.map((schedule,i = 0) => {
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
        backgroundColor: '#F7F7F7'
    },
    facilityType: {
        fontSize: 31,
        fontWeight: 'bold',
        padding: 0,
        color: '#282828'
        // textAlign: 'center',
    },
    facilityLocation: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 0,
        color: '#75b4ff'
    },
    dayOfWeek: {
        fontSize: 20
    },
    hours: {
        fontSize: 15
    }
  });