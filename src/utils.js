export const checkStatus = (response) => {
    if (response.ok) {
        return response;
    }
    throw new Error('Request was either 404 or 500');
}
  
export const json = (response) => response.json()

const wkendChk = (date) => {
    let newDate = new Date(date)
    let utcDate = newDate.setUTCHours(12)
    let weekendChk = new Date(utcDate)
    let wkndMilli = weekendChk.getTime()

    while (weekendChk.getDay() > 5 || weekendChk.getDay() < 1) {
        wkndMilli = wkndMilli + 86400000
        weekendChk = new Date(wkndMilli)
    }
    return weekendChk;
}

export const dateIterate = (start, end) => {
    let dateArray = []
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


export const dateFormat = () => {
    const dateRaw = new Date();
    let year = dateRaw.getFullYear()
    let startyear = year - 1
    const month = () => {
        const mmString = (month) => {
            if (month.toString().length < 2) {
                return '0' + month
            } else {
                return month
            }
        }

        let mm = mmString(dateRaw.getMonth() + 1)
        let mmRange2 = mmString(dateRaw.getMonth())
        let mmRange3 = mmString(dateRaw.getMonth() - 5)

        return [mm, mmRange2, mmRange3]
    }
    
    const day = () => {
        let presentMilli = dateRaw.getTime()
        let range1Milli = dateRaw.getTime()
        range1Milli = range1Milli - 604800000

// Weekend Check
        const weekndr = (milli) => {
            let currentMilli = milli
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

        const currentDay = weekndr(presentMilli)
        const range1Day = weekndr(range1Milli)
        return [currentDay, range1Day]
    }

    const dayOutput = day()
    const monthOutput = month()

    const currentDate = [year, monthOutput[0], dayOutput[0]].join('-');
    const startDate = [startyear, monthOutput[0], dayOutput[0]].join('-');
    const startRange1 = [year, monthOutput[0], dayOutput[1]].join('-');
    const startRange2 = [year, monthOutput[1], dayOutput[0]].join('-');
    const startRange3 = [year, monthOutput[2], dayOutput[0]].join('-');

    const date = [currentDate, startDate, startRange1, startRange2, startRange3]
    return date; 
}


export async function fetchFunction(base) {
    
    const response = []
    const date = dateFormat()
    const currentDate = date[0]
    const startDate = date[1]
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
