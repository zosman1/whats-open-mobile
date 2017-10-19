
function parseTime(time){
    //takes in time ex "23:00:00"
    //returns a value that can be directly compared with < > == etc
    return Date.parse(`01/01/2011 ${time}`);
}

function findSchedule(day, open_times){ // 0-6 0 being monday
    //this function finds what day applies to us, and returns that
    open_times.forEach((element) =>  {
        if (element.start_day != element.end_day) {
            throw "start day != end day"
            return;
        }
        if(element.start_day == day){
            return element;
        }
    });
}
function isInTimes (realTime, startTime, endTime){ // all in 21:00:00 format
    if((parseTime(realTime) >= parseTime(startTime)) && (parseTime(realTime) < parseTime(endTime))){
        return true; 
    }
    return false;
}

export function isOpen(facility) {
    if(facility.special_schedule[0] != null){
        //stuff

        return;
    }
    if(facility.main_schedule.twenty_four_hours) return true;
    let now = new Date();
    let dayOfWeek = now.getDay() - 1;
    let openTimes = facility.main_schedule.open_times;

    let nowSchedule = findSchedule(dayOfWeek, openTimes);
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
        console.error(error);
      }
  
}
 
