export const checkStatus = (response) => {
    if (response.ok) {
        return response;
    }
    throw new Error('Request was either 404 or 500');
}
  
export const json = (response) => response.json()


//export const dateBackTrack = (date) => {
//    const dateObj = new Date(date)
//    const objMilli = dateObj.getTime()
//    let milliBackTrack = objMilli
//    milliBackTrack = milliBackTrack - 86400000
//
//    let dateRaw = new Date(milliBackTrack)
//        let year = dateRaw.getFullYear()
//        let month = () => {
//            let mm = dateRaw.getMonth() + 1
//            if (mm.toString().length < 2) {
//                return '0' + mm
//            } 
//            return mm    
//        }
//        let day = () => {
//            let dd = dateRaw.getDate()
//            if (dd.toString().length < 2) {
//                return '0' + dd
//            } 
//            return dd
//        }
//        let dateJoin = [year, month(), day()].join('-');
//        return dateJoin;
//}

const wkendChk = (date) => {
    let weekendChk = new Date(date)
    let wkndMilli = weekendChk.getTime()

    while (weekendChk.getDay() > 5 || weekendChk.getDay() < 1) {
        wkndMilli = wkndMilli + 86400000
        weekendChk = new Date(wkndMilli)
        console.log(wkndMilli, ' and ', weekendChk)
    }
    return weekendChk;
}
//    let dd = weekendChk.getDate()
//    if (dd.toString().length < 2) {
//        return '0' + dd
//    } 
//    return dd
//}


export const dateIterate = (start, end) => {
    const endDate = new Date(end)
    const currentMilli = endDate.getTime()
    const startDate = wkendChk(start)
    
    const startMilli = startDate.getTime()
    const datesArray = []

    let milliDayCounter = startMilli

    while (milliDayCounter <= currentMilli) {
        milliDayCounter = milliDayCounter + 86400000
        let dateRaw = new Date(milliDayCounter)
        let year = dateRaw.getFullYear()
        let month = () => {
            let mm = dateRaw.getMonth() + 1
            if (mm.toString().length < 2) {
                return '0' + mm
            } 
            return mm    
        }
        let day = () => {
            let dd = dateRaw.getDate()
            if (dd.toString().length < 2) {
                return '0' + dd
            } 
            return dd
        }
        let date = [year, month(), day()].join('-');
        datesArray.push(date)
    }
    
    return datesArray
}


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
        let currentMilli = dateRaw.getTime()
// Weekend Check
        let weekendChk = new Date(currentMilli)

        while (weekendChk.getDay() > 5 || weekendChk.getDay() < 1) {
            currentMilli = currentMilli - 86400000
            weekendChk = new Date(currentMilli)
        }
//
        let dd = weekendChk.getDate()
        if (dd.toString().length < 2) {
            return '0' + dd
        } 
        return dd
    }
    const currentDate = [year, month(), day()].join('-');
    const startDate = [startyear, month(), day()].join('-');
    const date = [currentDate, "2020-10-03"]

    return date; 
}


export async function fetchFunction(base) {
    
    const response = []
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
        response.push(data.rates)
        response.push(currentDate)
        response.push(date[1])
    }).catch((error) =>  {
        console.log(error.message)
    })
    console.log("Fecth response: ", response)
    return response;
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
