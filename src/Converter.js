import React from 'react';
import './Converter.css';
import { useDataReducer, useData } from './Exchange';
import { useState, useEffect, useRef, useReducer } from 'react';



const Converter = (props) => {
    const { base, altCurr, currencyList, fetchData } = props
    const [primBase, setBase] = useState(base)
    const [altBase, setAltBase] = useState(altCurr)
    const [list, setList] = useState(currencyList)
    const [results, setResults] = useState(fetchData)
    const primInfo = currencyList.data[0][primBase]
    const altInfo = currencyList.data[0][altBase]
    const currencies = currencyList.list


    useEffect(() => {

    }, [])
    //const data = useDataReducer()
    //console.log("Converter data: ", data)

    return (
        <div className="container">
            <div className="row text-center">
                <div className="col-lg-12">
                    <div>
                        <p className="mt-5 mb-0">{primInfo["country"]}</p>
                        <div className="dropdown btn-group my-2">
                            <div className="dropdown-toggle customBtn primaryBtn border" type="button" id="dropdownMenuButton" data-toggle="dropdown" style={{ position: "relative", }}>
                                <div className="btnBg" style={{backgroundImage: `url(https://flagcdn.com/64x48/${primInfo["key"]}.png)`}}></div>
                                <span className="btnTxt">1<br/>{base}<br/></span>
                            </div>
                            <div className="dropdown-menu customMenu rounded" >                            
                                    {currencies.map((currency, index) => {
                                        if (currency !== base) {
                                            return <div className="dropdown-item customDropdownItem col-3"><p key={index} currency={currency} type="button" className="btn customBtn" onClick={() => this.props.onChangeBase(currency)}>{currency}</p></div>
                                        }
                                        return;
                                    })}                                  
                            </div>
                        </div>
                        <p>{primInfo["currency"]}</p>
                    </div>
                    <div>
                        <p className="mt-5 mb-0">{altInfo["country"]}</p>
                        <div className="dropdown btn-group my-2">
                            <div className="dropdown-toggle customBtn primaryBtn border" type="button" id="dropdownMenuButton" data-toggle="dropdown" style={{ position: "relative", }}>
                                <div className="btnBg" style={{backgroundImage: `url(https://flagcdn.com/64x48/${altInfo["key"]}.png)`}}></div>
                                <span className="btnTxt">1<br/>{base}<br/></span>
                            </div>
                            <div className="dropdown-menu customMenu rounded" >                            
                                    {currencies.map((currency, index) => {
                                        if (currency !== base) {
                                            return <div className="dropdown-item customDropdownItem col-3"><p key={index} currency={currency} type="button" className="btn customBtn" onClick={() => this.props.onChangeBase(currency)}>{currency}</p></div>
                                        }
                                        return;
                                    })}                                  
                            </div>
                        </div>
                        <p>{altInfo["currency"]}</p>
                    </div>
                </div>          
            </div>
        </div>
    )
}


export default Converter; 