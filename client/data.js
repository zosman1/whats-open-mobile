export async function fetchData() {
    try {
        let response = await fetch('https://api.srct.gmu.edu/whatsopen/v2/facilities/?format=json');
        let responseJson = await response.json();
        return responseJson;
      } catch(error) {
        console.error(error);
      }
  
}
 
