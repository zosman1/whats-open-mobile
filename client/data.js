
export function isOpen(facility) {
    if(facility.special_schedule[0] != null){
        //stuff

        return;
    }
    if(facility.main_schedule.twenty_four_hours) return true;
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
 
