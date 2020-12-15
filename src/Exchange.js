import React from 'react';
import './Exchange.css';
import ExchangeRates from './ExchangeRates';
import { dateIterate, dateFormat } from './utils';
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';


export const RateChart = (props) => {
    const { rangeData, base, start, end, passAltBase } = props;
    const [chartData, setChartData] = useState({})
    const [dateArray, setDateArray] = useState(dateFormat())
    const altBase = passAltBase
    const [range, setRange] = useState(dateArray[1])
    const [rangeArray, setRangeArray] = useState(dateIterate(dateArray[1], end))
    const [rangeTitle, setRangeTitle] = useState("1 Year")
    const [chKey, setChKey] = useState(1)
    const [selectKey, setSelectKey] = useState(200)

    const handleChartRange = (e) => {      
        e.preventDefault();
        let startdate = []
        let cap = ''
        switch (e.target.value) {
            case "1":
                cap = "1 Week"
                startdate = dateArray[2]
                break;
            case "2":
                cap = "1 Month"
                startdate = dateArray[3]
                break;
            case "3":
                cap = "6 Month"
                startdate = dateArray[4]
                break;
            case "4":
                cap = "1 Year"
                startdate = dateArray[1]
                break;
            default: 
                break;
        }
        setRange(startdate)
        setRangeTitle(cap);
        const newDateRange = dateIterate(startdate, end)
        console.log('Date Range ', newDateRange)
        let dataArray = processData(newDateRange)
        chart(dataArray, newDateRange)  
        setRangeArray(newDateRange)      
    }

    const chart = (data, arr) => {
        setChartData({
            labels: arr,
            datasets: [
                {
                    label: `${base}-${altBase} Exchange Range`,
                    borderColor: "darkgrey",
                    pointBackgroundColor: "white",
                    pointBorderWidth: 0,
                    pointRadius: 2,
                    data: data,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)'
                    ],
                    borderwidth: 4,
                    spanGaps: true,
                }
            ]
        })
    }

    const processData = (arr) => {
        const dataArray = []
        arr.forEach(date => {
            if (!rangeData[date]) {
                dataArray.push(null)
            }
            if (rangeData[date]) {
                let rate = rangeData[date][altBase]
                let datapoint = { x: date, y: rate } 
                dataArray.push(datapoint)
            } 
        })
        return dataArray
    }

    useEffect(() => {
        let dataArray = processData(rangeArray)
        chart(dataArray, rangeArray)
    }, [])

    return(
        <div id="chartStyle">
            <Line key={chKey} data={chartData} 
            options={{
                height: "250px",
                title: {text: `${rangeTitle} Rate Trend`, display: true, fontColor: "white"},
                legend: {
                    labels: {
                        fontColor: 'lightgray',
                    }
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                autoSkip: true,
                                autoSkipPadding: 15,
                                fontColor: 'lightgray',
                                padding: 0,
                            }, 
                            gridLines: {
                                display: false
                            }
                        }],
                    xAxes: [
                        {
                            ticks: {
                                autoSkip: true,
                                autoSkipPadding: 5,
                                maxRotation: 30,
                                fontColor: 'lightgray',
                                padding: -2,
                            },
                            gridLines: {
                                display: false
                            }
                        }
                    ]
                }
            }} />
            <div className="sliderContainer" key={selectKey}> 
                <input type="range" min="1" max="4" className="mt-2 slider" id="chartRange" onChange={handleChartRange}  />
                <p className="" id="rangeTitle">Chart Range: {rangeTitle}</p>
            </div> 
        </div>
    )
}


class Exchange extends React.Component {
    constructor(props) {
        super(props);
        const { base, altCurr } = props
        this.state = { 
            primaryCurrency: base,
            altBase: altCurr,
            exchangeRate: '',
            amount: '',
            currencies: [],
            currencyData: {},
            rateKey: 0,
            chartKey: 100,
            currencyType: "US Dollar",
            currencyCountry: "USA",
            currencyKey: "us",
            currencyRegion: "AMERICAS",
            todayResults: '',
            loading: true,
            today: '',
            startDate: '',
            rangeResults: ''
        }
        this.onLiftAltBase = this.onLiftAltBase.bind(this)
        this.fetchProcess = this.fetchProcess.bind(this)
        this.currencyListProcess = this.currencyListProcess.bind(this)
        
    }

    componentDidMount () {
        this.fetchProcess()
        this.currencyListProcess()
    }

    fetchProcess() {
        const { fetchData } = this.props
        if (fetchData) {
            this.setState({
                loading: false,
                todayResults: fetchData[0][fetchData[1]],
                today: fetchData[1],
                startDate: fetchData[2],
                rangeResults: fetchData[0]
            })
        }
    }

    currencyListProcess() {
        const { primaryCurrency, rateKey } = this.state;
        const { currencyList } = this.props
        if (currencyList) {
            const currJSON = currencyList
            const primaryKey = rateKey + 1;

            const jsonData = currJSON.data[0][primaryCurrency];
            
            this.setState({
                loading: false,
                currencies: currJSON.list,
                currencyData: currJSON.data[0],
                currencyKey: jsonData["key"],
                currencyType: jsonData["currency"],
                currencyCountry: jsonData["country"],
                currencyRegion: jsonData["region"],
                rateKey: primaryKey, 
            })
        }
    }

    onLiftAltBase(altCurrency) {
        const { chartKey, rateKey } = this.state;
        const chKey = chartKey + 1
        const rKey = rateKey + 1
        
        this.props.onChangeAltBase(altCurrency)

        this.setState({
            altBase: altCurrency,
            chartKey: chKey,
            rateKey: rKey
        })
    }

    handleClick(currency) {   
        const { rateKey, chartKey, currencyData } = this.state;
        const exKey = rateKey + 1
        const chKey = chartKey + 1
        const currencyUpdate = currencyData[currency];

        this.setState({ 
            primaryCurrency: currency,
            rateKey: exKey, 
            chartKey: chKey,
            currencyKey: currencyUpdate["key"],
            currencyType: currencyUpdate["currency"],
            currencyCountry: currencyUpdate["country"],
            currencyRegion: currencyUpdate["region"],
        });
    }

    render () {
        const {  altBase, primaryCurrency, currencies, currencyType, currencyKey, currencyCountry, currencyData, chartKey, todayResults, loading, today, startDate, rangeResults } = this.state;

        return (
            <div className="container">
                <div className="row text-center">
                    <div className="col-lg-6">
                        <p className="mt-5 mb-0">{currencyCountry}</p>
                        <div className="dropdown btn-group my-2">
                            <div className="dropdown-toggle customBtn primaryBtn border" type="button" id="dropdownMenuButton" data-toggle="dropdown" style={{ position: "relative", }}>
                                <div className="btnBg" style={{backgroundImage: `url(https://flagcdn.com/64x48/${currencyKey}.png)`}}></div>
                                <span className="btnTxt">1<br/>{primaryCurrency}<br/></span>
                            </div>
                            <div className="dropdown-menu" onChange={this.handleChange}>                            
                                    {currencies.map((currency, index) => {
                                        if (currency !== primaryCurrency) {
                                            return <div key={index} className="customDropdownItem"><p key={index} currency={currency} type="button" onClick={() => this.props.onChangeBase(currency)}>{currency}</p></div>
                                        }
                                        return null;
                                    })}                                  
                            </div>
                        </div>
                        <p>{currencyType}</p>
                        {(() => {
                            if (!loading) {
                               return <RateChart key={chartKey} rangeData={rangeResults} base={primaryCurrency} start={startDate} end={today} passAltBase={altBase} />
                            }
                         })()}
                        
                    </div>
                    <div className="col-lg-6 exRates">
                    {(() => {
                        if (loading) {
                            return <div className="d-flex flex-row flex-lg-column justify-content-center border rounded bg-light mt-5 rateContainer"><p>Loading data...</p></div>;
                        }
                        if (!loading) {
                            return (
                                <div className="d-flex border my-5" id="rateContainer">            
                                    {(() => {
                                        return currencies.map((currency) => {
                                            for (var key in todayResults) {                               
                                                if (currency === key && currency !== primaryCurrency) {     
                                                    let rate = todayResults[key] 
                                                    return <ExchangeRates key={key} currData={currencyData} passCurrency={currency} passAltBase={altBase} passRate={rate} handleAltChange={this.onLiftAltBase} />                                        
                                                }
                                            }
                                            return null;
                                        })
                                    })()}
                                </div>
                            )
                        }
                    })()}
                    </div>                    
                </div>
            </div>
        )
    }
}

export default Exchange
