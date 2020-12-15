import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { usePopper } from 'react-popper';
import './ExchangeRates.css';
import { rateRounder } from './utils';

library.add( faPlusCircle );

export const ExchangeRates = (props) => {
    const { passCurrency, currData, passRate, passAltBase } = props;
    const [currency, setCurrency] = useState(passCurrency)
    const [currencyData, setCurrencyData] = useState(currData)
    const [rate, setRate] = useState(passRate)
    const [altBase, setAltBase] = useState(passAltBase)
    const [isShown, setIsShown] = useState(false);
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);

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
    }, [])

    const changeToggler = (e) => {
        setIsShown(!isShown)
     }

    return (
        <>
            <button className="rateBtn" type="button" ref={setReferenceElement} value={currency} style={ (altBase === currency) ? { backgroundColor: "rgba(75, 192, 192, 0.6)"} : {backgroundColor: "rgba(166, 168, 175, 0.6)"}} onTouchStart={changeToggler} onTouchEnd={changeToggler} onMouseEnter={changeToggler} onMouseLeave={changeToggler} onClick={() => { if (altBase !== currency) {props.handleAltChange(currency)}}}> 
                <span className="rateStyle" value={currency}>{rateRounder(rate)}</span><br/><span className="rateCurr" value={currency}>{currency}</span>
            </button>
            <div id={currency} className={ (isShown) ? "popperStyle" : "popperStyle-hidden" } ref={setPopperElement} style={styles.popper} {...attributes.popper} onClick={changeToggler} >
                <span style={{ fontWeight: "700" }}>{currencyData[currency]["currency"]}</span><br />{currencyData[currency]["country"]}<br /><span style={{ fontSize: ".8rem" }}>- {currencyData[currency]["region"]} -</span><br /><img className="mt-2" alt={`${currencyData[currency]["key"]}-Flag`} src={`https://flagcdn.com/64x48/${currencyData[currency]["key"]}.png`} />
                <div id={"popper"} className={ (isShown) ? "arrowStyle" : "arrowStyle-hidden" } ref={setArrowElement} style={styles.arrow} />
            </div> 
        </>           
    )
}

export default ExchangeRates
    
