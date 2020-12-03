export const checkStatus = (response) => {
    if (response.ok) {
        return response;
    }
    throw new Error('Request was either 404 or 500');
}
  
export const json = (response) => response.json()


const dateFormat = () => {
    const dateRaw = new Date();
    let year = dateRaw.getFullYear()
    let startyear = year - 1
    const month = () => {
        let mm = dateRaw.getMonth() + 1
        if (mm.toString().length < 2) {
            return '0' + mm
        } 
        return mm
       
    }
      
    const day = () => {
        let dd = dateRaw.getDate()
        if (dd.toString().length < 2) {
            return '0' + dd
        } 
        return dd
    }

    console.log(day())


    const currentDate = [year, month(), day()].join('-');
    const startDate = [startyear, month(), day()].join('-');
    const date = [currentDate, startDate]

    return date; 
}

export async function fetchFunction(base) {
    const fetchedResponse = []
    const date = dateFormat()
    const currentDate = date[0]
    const startDate = date[1]
    console.log(currentDate, startDate)
    const url = `https://alt-exchange-rate.herokuapp.com/latest?base=${base}`
    const rUrl = `https://alt-exchange-rate.herokuapp.com/history?start_at=${startDate}&end_at=${currentDate}&base=${base}`

    if (!base) {
        return console.log("No Base Currency Set for Fetch")
    }
    await fetch(rUrl)
    .then(checkStatus)
    .then(json)
    .then((data) => {
        fetchedResponse.push(data.rates)
        fetchedResponse.push(currentDate)
    }).catch((error) =>  {
        console.log(error.message)
    })

    return fetchedResponse;
}

export async function fetchCurrencyList() {
   
    const currencyJSON = await fetch("./currencylist.json")
    .then(checkStatus)
    .then(json)
    .then((data) => {
        return data;
    }).catch((error) =>  {
        console.log(error.message)
    })

    return currencyJSON;
}

export const rateRounder = (rate) => {
    if (rate < 1000) {
        return Math.round((rate * 1000)) / 1000;        
    } 
    if (rate < 10000 && rate >= 1000 ) {
        return Math.round((rate * 100)) / 100;
    } 
    if (rate < 100000 && rate >= 10000) {
        return Math.round((rate * 10)) / 10;
    } 
    if (rate > 100000) {
        return Math.round(rate);
    } 
    return;
}
export default fetchFunction;
