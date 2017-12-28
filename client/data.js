import moment from 'moment';
import {
    isFacilityOpen,
    calcTimeTillOpen,
    calcTimeTillClose,
    getFacilityActiveSchedule
} from './isOpen';

export function sortFacilitys(facilitys) {
    // Sorts Facilities in a very stable manner
    let openFacilitys = [];
    let closedFacilitys = [];

    facilitys.forEach((facility) => {
        if (isFacilityOpen(facility)) {
            openFacilitys.push(facility);
        } else {
            closedFacilitys.push(facility);
        }
    })
    Array.prototype.push.apply(openFacilitys, closedFacilitys);
    return openFacilitys;
}


export async function fetchData() {
    // Fetches data from api 
    try {
        let response = await fetch('https://api.srct.gmu.edu/whatsopen/v2/facilities/?format=json')
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return;
    }
}

export function milToStandard(input) {
    // Takes in time in military format and returns it in standard format
    return moment(input, 'HH:mm:ss').format('h:mm:ss A');
}

export function dayToString(dayInt) {
    // Takes in a day as an int and returns the name of the day
    // In this case 0 would be Monday as that is how Whats Open Api is formatted 
    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days[dayInt];
}

export function timeTill(facility) {
    // returns the time till facility opens or closes
    if (isFacilityOpen(facility)) {
        const timeTillClose = calcTimeTillClose(getFacilityActiveSchedule(facility));
        if (timeTillClose <= 30) {
            return ['closing', Math.round(timeTillClose)]
        }
    } else {
        const timeTillOpen = calcTimeTillOpen(getFacilityActiveSchedule(facility));
        if (timeTillOpen <= 30) {
            return ['opening', Math.round(timeTillOpen)]
        }
    }
}