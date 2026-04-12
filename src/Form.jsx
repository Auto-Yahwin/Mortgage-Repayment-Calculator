import { useState } from "react";
import Result from "./Result";

export default function Form(){
    let errorMessage = "This field is required";
    const [errorState, setErrorState] = useState({
        amount: true,
        term: true,
        rate: true,
        type: true
    });

    const [show, setShow] = useState({});
    const [redIndicator, setRedIndicator] = useState({})
    const [redBorder, setRedBorder] = useState({})
    const [amount, setAmount] = useState("");
    const [term, setTerm] = useState("");
    const [rate, setRate] = useState("");
    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);
    const [repayment, setRepayment] = useState(null);
    const [totalRepayment, setTotalRepayment] = useState(null);

    function amountChange(e){
        let value = e.target.value;
        setErrorState(prevState =>(
            !value ? {...prevState, amount: true} : {...prevState, amount: false}
        ))
        setAmount(value);
    }

    function termChange(e){
        let value = e.target.value;
        setErrorState(prevState =>(
            !value ? {...prevState, term: true} : {...prevState, term: false}
        ))
        setTerm(value);
    }

    function rateChange(e){
        let value = e.target.value;
        setErrorState(prevState =>(
            !value ? {...prevState, rate: true} : {...prevState, rate: false}
        ))
        setRate(value);
    }

    let r = parseFloat(rate)/100/12
    let n = parseFloat(term)*12
    let p = parseFloat(amount)
    

    function calcRepayment() {
        let numerator = r*((1 + r)**n)
        let denominator = ((1 + r)**n) - 1
        let repayment = p * (numerator/denominator)
        let totalRepayment = repayment*n
        //console.log("Total Repayment: " + totalRepayment);
        return {repayment, totalRepayment};
    }

    function calcInterestOnly() {
        let repayment = p * r
        let totalRepayment = (repayment*n) + p;
        return {repayment, totalRepayment};
    }

    function repaymentChecked(){
        setIsChecked1(true);
        setIsChecked2(false);
        setErrorState(prevState =>
            ({...prevState, type: false})
        )
    }

    function interestOnlyChecked(){
        setIsChecked1(false); setIsChecked2(true);
        setErrorState(prevState =>(
            {...prevState, type: false}
        ))
    }

    function calculate(e) {
        e.preventDefault();
        setShow({display: "block"});
        setRedIndicator(
            {
                backgroundColor: "hsl(4, 69%, 50%)",
                color: "hsl(0, 0%, 100%)"
            }
        )
        setRedBorder({border: "1px solid hsl(4, 69%, 50%)"})

        if (!errorState.amount && !errorState.term && !errorState.rate && (isChecked1 || isChecked2)) {
            if (isChecked1) {
            setRepayment(calcRepayment().repayment);
            setTotalRepayment(calcRepayment().totalRepayment);
        } else if (isChecked2) {
            setRepayment(calcInterestOnly().repayment);
            setTotalRepayment(calcInterestOnly().totalRepayment);
        }
        }
    }

    function clear() {
        setAmount("");
        setTerm("");
        setRate("");
        setIsChecked1(false);
        setIsChecked2(false);
        setRepayment(null);
        setTotalRepayment(null);
        setErrorState({
            amount: true,
            term: true,
            rate: true,
            type: true
        })
        setShow({
            display: "none"
        })
        setRedIndicator({})
        setRedBorder({})
    }

    return(
        <main role="main">
            <form aria-label="form field" className="form">
            <header aria-label="banner">
                <h1>Mortgage Calculator</h1>
                <p onClick={clear}>Clear All</p>
            </header>
            <form action="" aria-label="form">
                <section aria-label="mortgage amount" className="amount-grp">
                    <label htmlFor="amount">Mortgage Amount</label>
                    <span className="amount" style={errorState.amount ? redBorder : null}>
                        <span className="euro" style={errorState.amount ? redIndicator : null}><h5>£</h5></span>
                        <input type="number" min="1" name="amount" id="amount" value={amount} onChange={amountChange} />
                    </span>
                    <h6 style={errorState.amount ? show : null}>{errorMessage}</h6>
                </section>

                <section aria-label="mortgage term" className="term-rate">
                    <section aria-label="term input" className="grp">
                        <label htmlFor="term">Mortgage Term</label>
                        <span className="term" style={errorState.term ? redBorder : null}>
                            <input type="number" min="0" name="term" value={term} id="term" onChange={termChange} />
                            <span className="years" style={errorState.term ? redIndicator : null}><h5>years</h5></span>
                        </span>
                        <h6 style={errorState.term ? show : null}>{errorMessage}</h6>
                    </section>

                    <section aria-label="rate input" className="grp">
                        <label htmlFor="rate">Interest rate</label>
                        <span className="rate" style={errorState.rate ? redBorder : null}>
                            <input type="number" min="0" name="rate" value={rate} id="rate" onChange={rateChange} />
                            <span className="percent" style={errorState.rate ? redIndicator : null}><h5>%</h5></span>
                        </span>
                        <h6 style={errorState.rate ? show : null}>{errorMessage}</h6>
                    </section>
                </section>

                <fieldset aria-label="mortgage type" className="type-grp">
                    <legend>Mortgage Type</legend>
                    <section aria-label="repayment radio option" className="type" tabIndex="0" onClick={repaymentChecked}>
                        <input type="radio" name="repayment-type" id="repayment-type" checked={isChecked1} onChange={repaymentChecked} />
                        <label htmlFor="repayment-type"><h4>Repayment</h4></label>
                    </section>
                    <section aria-label="interest only radio option" className="type" tabIndex="0" onClick={interestOnlyChecked}>
                        <input type="radio" name="interest-only-type" id="interest-only-type" checked={isChecked2} onChange={interestOnlyChecked} />
                        <label htmlFor="interest-only-type"><h4>Interest Only</h4></label>
                    </section>
                    <h6 style={errorState.type ? show : null}>{errorMessage}</h6>
                </fieldset>
                <button type="submit" onClick={calculate} >
                    <img src={`${import.meta.env.BASE_URL}/images/icon-calculator.svg`} alt="calculator icon" />
                    Calculate Repayments
                </button>
            </form>
            </form>
            <Result
                checkStatus={isChecked1 || isChecked2}
                repayment={repayment}
                totalRepayment={totalRepayment}
                submitted={repayment ? true : false}
            />
        </main>
    )
}