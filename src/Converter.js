import React from 'react';
import './Converter.css';
import { RateChart } from './Exchange';
import { useState } from 'react';
import { rateRounder } from './utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faBars, faCircle, faEnvelope, faChessQueen, faPlusCircle, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'; 

library.add( fab, faBars, faCircle, faEnvelope, faChessQueen, faPlusCircle, faExchangeAlt );



const Converter = (props) => {
    const { primBase, altCurr, currencyList, fetchData } = props
    const [base, setBase] = useState(primBase)
    const [altBase, setAltBase] = useState(altCurr)
    const [altRate, setAltRate] = useState(fetchData[0][fetchData[1]][altCurr])
    const [baseAmount, setBaseAmount] = useState(1)
    const [sum, setSum] = useState(rateRounder(baseAmount * altRate))
    
    //Chart//
    const [rangeResults, setRangeResults] = useState(fetchData[0])
    const [chartKey, setChartKey] = useState(0)
    
    const today = fetchData[1]
    const startDate = fetchData[2]
    
    const primInfo = currencyList.data[0][primBase]
    const altInfo = currencyList.data[0][altBase]
    const currencies = currencyList.list
    
     const convertCalc = (e) => {
        if (e.target.value >= 0) {
            setBaseAmount(e.target.value)
            let sumMax = rateRounder(e.target.value * altRate)
            if (sumMax < 1000000000) {
                setSum(sumMax)
            } else {
                setSum("Too high")
            }
        }            
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-center align-items-center mt-4" id="contentsStyle">
                <div className="text-center currencyStyle">
                    <p className="mt-5 mb-0">{primInfo["country"]}</p>
                    <div className="dropdown btn-group my-2">
                        <div className="dropdown-toggle customBtn primaryBtn border" type="button" id="dropdownMenuButton" data-toggle="dropdown" style={{ position: "relative", }}>
                            <div className="btnBg" style={{backgroundImage: `url(https://flagcdn.com/64x48/${primInfo["key"]}.png)`}}></div>
                            <span className="btnTxt"><br/>{base}<br/></span>
                        </div>
                        <div className="dropdown-menu" >                            
                                {currencies.map((currency, index) => {
                                    if (currency !== base) {
                                        return <div key={index} className="customDropdownItem"><p key={index} currency={currency} type="button" onClick={() => props.onChangeBase(currency)}>{currency}</p></div>
                                    }
                                    return null;
                                })}                                  
                        </div>
                    </div>
                    <p>{primInfo["currency"]}</p>
                    <form>
                        <div className="input-group flex-item justify-content-center pb-3 converterBtn">
                            <div className="input-group-prepend inputButton">
                                <button className="btn border border-light rounded-left py-0 " type="submit" id="submitBtn">{base}</button>
                            </div>
                            <input type="number" min="0" name="baseAmount" onChange={convertCalc} placeholder={`${baseAmount} ${base}`} className="pl-2 border border-light border-left-0 rounded-right inputButton" id="inputBaseAmount"  />
                        </div>
                    </form>
                </div>
                <div>
                <button type="button" id="switchBtn" onClick={() => props.switchBase(base, altBase)}><FontAwesomeIcon className="aniMe" id="exchangeIcon" icon="exchange-alt" /></button>
                </div>
                <div className="text-center currencyStyle">
                    <p className="mt-5 mb-0">{altInfo["country"]}</p>
                    <div className="dropdown btn-group my-2">
                        <div className="dropdown-toggle customBtn primaryBtn border" type="button" id="dropdownMenuButton" data-toggle="dropdown" style={{ position: "relative", }}>
                            <div className="btnBg" style={{backgroundImage: `url(https://flagcdn.com/64x48/${altInfo["key"]}.png)`}}></div>
                            <span className="btnTxt"><br/>{altBase}<br/></span>
                        </div>
                        <div className="dropdown-menu" >                            
                                {currencies.map((currency, index) => {
                                    if (currency !== altBase && currency !== base) {
                                        return <div key={index} className="customDropdownItem"><p key={index} currency={currency} type="button" onClick={() => props.onChangeAltBase(currency)}>{currency}</p></div>
                                    }
                                    return null;
                                })}                                  
                        </div>
                    </div>
                    <p>{altInfo["currency"]}</p>
                    <div className="input-group flex-item justify-content-center pb-3" id="converterBtn">
                        <div className="input-group-prepend inputButton">
                                <button className="btn border border-light rounded-left py-0" type="button" id="altBtn">{altBase}</button>
                        </div>
                        <p className="pl-2 border border-light border-left-0 rounded-right inputStyle inputButton" id="inputBaseAmount">{sum}</p>
                    </div>
                </div>
                
            </div>   
            <div className="col-12">
                <div id="chartContainer">
                    <RateChart key={chartKey} rangeData={rangeResults} base={base} start={startDate} end={today} passAltBase={altBase} />
                </div>
            </div>
        </div>
    )
}


export default Converter; 