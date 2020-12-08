import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBlackTie } from '@fortawesome/free-brands-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useRef, useReducer } from 'react';
import { usePopper, createPopper } from 'react-popper';
import './ExchangeRates.css';
import { fetchFunction, rateRounder } from './utils';
import { useData, RateChart, useCustom, useCurrency, useDataReducer, currencyContext } from './Exchange';


library.add( faPlusCircle );

export const ExchangeRates = (props) => {
    const { baseInput, currList, currData, parentResults, handleAltChange } = props;
    const [base, setBase] = useState(baseInput)
    const [currencies, setCurrencies] = useState(currList)
    const [currencyData, setCurrencyData] = useState(currData)
    const [results, setResults] = useState(parentResults)

    const [isShown, setIsShown] = useState(false);
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);
    
    // Share Hook for Converter
  //  const [state, dispatch] = useReducer(useDataReducer, {
  //      list: currList,
  //      data: currData,
  //      results: parentResults,
  //      base: baseInput,
  //  })

    

    //POPPER
    const customBoundary = document.querySelector('#rateContainer')
    const { styles, attributes } = usePopper(referenceElement, popperElement, {    
        placement: 'right',
        modifiers: [
            { name: 'hide' }, 
            { name: 'applyStyles', options: { color: "green" }}, 
            { name: 'arrow', options: { element: arrowElement, padding: 8,  }}, 
            { name: 'offset', options: { offset: [0, 10]}}, 
            { name: 'preventOverflow', options: { mainAxis: true, altAxis: false, padding: 0, boundary: customBoundary}}, 
          ],
      });

    useEffect(() => {    
//        dispatch({ base: baseInput })
    }, [])

    const changeToggler = (key) => {
        setIsShown(!isShown)   
     }

    return (
        <div>
            <div className="justify-content-center border rounded bg-light mt-5" id="rateContainer"> 
                {(() => {

                    return currencies.map((currency) => {
                        for (var key in results) {                               
                            if (currency === key && currency !== base) {     

                                let rate = results[key]
                                //<button className={ (isShown) ? "rateBtn btnOn" : "rateBtn btnOff" } type="button" ref={setReferenceElement} value={currency} onFocus={ changeToggler(key) } onBlur={ changeToggler(key) } onClick={() => {props.handleAltChange(currency)}}> 
                            //    <div id="popper" className={ (isShown) ? "popperStyle" : "popperStyle-hidden" } ref={setPopperElement} style={styles.popper} {...attributes.popper} onClick={changeToggler} >
                            //    <span style={{ fontWeight: "700" }}>{currencyData[currency]["currency"]}</span><br />{currencyData[currency]["country"]}<br /><span style={{ fontSize: ".8rem" }}>- {currencyData[currency]["region"]} -</span><br /><img className="mt-2" src={`https://flagcdn.com/64x48/${currencyData[currency]["key"]}.png`} />
                            //    <div id="popper" className={ (isShown) ? "arrowStyle" : "arrowStyle-hidden" } ref={setArrowElement} style={styles.arrow} />
                            //</div> 
                                return (
                                    <>
                                        <button className="rateBtn" type="button" ref={setReferenceElement} value={currency} onFocus={ changeToggler } onBlur={ changeToggler } onClick={() => {props.handleAltChange(currency)}}> 
                                            <span className="rateStyle" value={currency}>{rateRounder(rate)}</span><br/><span className="rateCurr" value={currency}>{currency}</span>
                                        </button>
                                        <div id="popper" className={ (isShown) ? "popperStyle" : "popperStyle-hidden" } ref={setPopperElement} style={styles.popper} {...attributes.popper} onClick={changeToggler} >
                                            <span style={{ fontWeight: "700" }}>{currencyData[currency]["currency"]}</span><br />{currencyData[currency]["country"]}<br /><span style={{ fontSize: ".8rem" }}>- {currencyData[currency]["region"]} -</span><br /><img className="mt-2" src={`https://flagcdn.com/64x48/${currencyData[currency]["key"]}.png`} />
                                            <div id="popper" className={ (isShown) ? "arrowStyle" : "arrowStyle-hidden" } ref={setArrowElement} style={styles.arrow} />
                                        </div> 
                                    </>
                                );
//
                            }
                        }
                        return;
                    })
                })()}
            </div>  
        </div>
    )
}

export default ExchangeRates
    
