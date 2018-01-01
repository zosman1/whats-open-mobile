import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  AsyncStorage
} from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { StackNavigator } from "react-navigation";
import Button from "react-native-button";
import MyText from "react-native-letter-spacing";
import { dayToString, milToStandard, timeTill } from "./data";

export function ChangingIn(facility) {
  const timeTillVar = timeTill(facility);
  if (timeTillVar == null) return;

  let content;
  if (timeTillVar[0] == "opening") {
    //return for opening in x mins
    content = `Opening in ${timeTillVar[1]} minutes`;
  } else if (timeTillVar[0] == "closing") {
    content = `Closing in ${timeTillVar[1]} minutes`;
  }

  return (
    <View style={{ justifyContent: "center", margin: 7 }}>
      <View style={styles.changingView}>
        <Text style={styles.changingText}>{content}</Text>
      </View>
    </View>
  );
}

export class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      facility: this.props.navigation.state.params.facility,
      scheduleType: "main_schedule"
    };
  }
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.facility.facility_name
  });

  componentWillMount() {
    //special schedules stuff
    if (this.state.facility.special_schedules.id != null) {
      //special schedules are in use
      this.setState({
        scheduleType: "special_schedules"
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginLeft: "2%" }}>
          <Text style={styles.facilityType}>
            {this.state.facility.facility_category.name}
          </Text>
          <MyText letterSpacing={1.4} style={styles.facilityLocation}>
            {this.state.facility.facility_location.building.toUpperCase()}
          </MyText>
        </View>
        {!this.state.facility[this.state.scheduleType].twenty_four_hours ? (
          <View>
            {ChangingIn(this.state.facility)}
            <TableView>
              <Section sectionTintColor="#F7F7F7" header="Hours">
                {this.state.facility[this.state.scheduleType].open_times.map(
                  (schedule, i = 0) => {
                    return (
                      <Cell
                        cellStyle="RightDetail"
                        title={dayToString(schedule.start_day)}
                        detail={`${milToStandard(
                          schedule.start_time
                        )} - ${milToStandard(schedule.end_time)}`}
                        key={i}
                      />
                    );
                    i++;
                  }
                )}
              </Section>
            </TableView>
          </View>
        ) : (
          <View style={styles.twentyFourHours}>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>
              Always Open
            </Text>
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7"
  },
  facilityType: {
    fontSize: 31,
    fontWeight: "bold",
    padding: 0,
    color: "#282828"
    // textAlign: 'center',
  },
  facilityLocation: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 0,
    color: "#75b4ff"
  },
  changingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFCC00"
  },
  changingView: {
    padding: 10,
    height: 30,
    justifyContent: "center",
    // backgroundColor: 'green',
    borderRadius: 10,
    padding: 5,
    borderWidth: 2,
    borderColor: "#FFCC00"
  },
  twentyFourHours: {
    flex: 1,
    margin: 50
  },
  dayOfWeek: {
    fontSize: 20
  },
  hours: {
    fontSize: 15
  }
});
