import moment from 'moment';
import { isFacilityOpen } from './isOpen';

export function sortFacilitys(facilitys){
    let openFacilitys = [];
    let closedFacilitys = [];

    facilitys.forEach((facility) => {
        if (isFacilityOpen(facility)){
            openFacilitys.push(facility);
        } else {
            closedFacilitys.push(facility);
        }
    })
    Array.prototype.push.apply(openFacilitys, closedFacilitys);
    return openFacilitys;

}


export async function fetchData() {
    try {
        let response = await fetch('https://api.srct.gmu.edu/whatsopen/v2/facilities/?format=json')
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return;
    }
}

export function milToStandard(input){
    return moment(input, 'HH:mm:ss').format('h:mm:ss A');
}
 
export function dayToString(dayInt){
    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days[dayInt];
}