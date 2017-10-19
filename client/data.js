
function parseTime(time){
    //takes in time ex "23:00:00"
    //returns a value that can be directly compared with < > == etc
    return Date.parse(`01/01/2011 ${time}`);
}

export function findSchedule(day, open_times){ // 0-6 0 being monday
    //this function finds what day applies to us, and returns that
    let result = -1; 
    open_times.forEach((element) => {
        if((day >= element.end_day) && (day <= element.start_day)){
            result = element;
        }
    });
    return result;
}

function isInTimes (realTime, startTime, endTime){ // all in 21:00:00 format
    if((parseTime(realTime) >= parseTime(startTime)) && (parseTime(realTime) < parseTime(endTime))){
        return true; 
    }
    return false;
}

export function isOpen(facility, inDate) {
    if(facility.special_schedules[0] != null){
        //stuff
        return;
    }
    if(facility.main_schedule.twenty_four_hours) return true;
    let now = inDate || new Date(); //for testing
    let dayOfWeek = now.getDay() - 1;
    let openTimes = facility.main_schedule.open_times;
    
    let nowSchedule = findSchedule(dayOfWeek, openTimes);
    if(nowSchedule == -1){ 
        //this is an edge case 
        //where there is no schedule that day (closed today)
        return false;
    }
    let nowTime = now.toLocaleTimeString('en-US', { hour12: false });// ex 17:00:00

    if(isInTimes(nowTime, nowSchedule.start_time, nowSchedule.end_time)){
        return true;
    } else {
        return false;
    }

}


export async function fetchData() {
    try {
        let response = await fetch('https://api.srct.gmu.edu/whatsopen/v2/facilities/?format=json');
        let responseJson = await response.json();
        return responseJson;
      } catch(error) {
          return;
      }
  
}
 
export function dayToString(dayInt){
    switch(dayInt){
        case 0:
            return "Monday";
            break;
        case 1:
            return "Tuesday";
            break;
        case 2:
            return "Wensday";
            break;
        case 3:
            return "Thursday";
            break;
        case 4:
            return "Friday";
            break;
        case 5:
            return "Saturday";
            break;
        case 6:
            return "Sunday";
            break;
        default:
            return -1;
            break;
    }
}