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
        /*amountChange({ target: { value: "" } });
        termChange({ target: { value: "" } });
        rateChange({ target: { value: "" } });*/
    }

    //console.log("Repayment: " + repaymentMonthly);
    //console.log("Total Repayment: " + repaymentTotal);
    console.log(errorState);
    

    return(
        <div className="main-container">
            <div className="form">
            <div className="first-liner">
                <h3>Mortgage Calculator</h3>
                <h5 onClick={clear}>Clear All</h5>
            </div>
            <form action="">
                <div className="amount-grp">
                    <p>Mortgage Amount</p>
                    <span className="amount">
                        <div className="euro" style={errorState.amount ? redIndicator : null}><h5>£</h5></div>
                        <input name="amount" id="amount" value={amount} onChange={amountChange} />
                    </span>
                    <h6 style={errorState.amount ? show : null}>{errorMessage}</h6>
                </div>

                <div className="term-rate">
                    <div className="grp">
                        <p>Mortgage Term</p>
                        <span className="term">
                            <input name="term" value={term} id="" onChange={termChange} />
                            <div className="years" style={errorState.term ? redIndicator : null}><h5>years</h5></div>
                        </span>
                        <h6 style={errorState.term ? show : null}>{errorMessage}</h6>
                    </div>

                    <div className="grp">
                        <p>Interest rate</p>
                        <span className="rate">
                            <input name="rate" value={rate} id="" onChange={rateChange} />
                            <div className="percent" style={errorState.rate ? redIndicator : null}><h5>%</h5></div>
                        </span>
                        <h6 style={errorState.rate ? show : null}>{errorMessage}</h6>
                    </div>
                </div>

                <div className="type-grp">
                    <p>Mortgage Type</p>
                    <div className="type" tabIndex="0" onClick={repaymentChecked}>
                        <input type="radio" name="" id="" checked={isChecked1} onChange={repaymentChecked} />
                        <label htmlFor="type"><h4>Repayment</h4></label>
                    </div>
                    <div className="type" tabIndex="0" onClick={interestOnlyChecked}>
                        <input type="radio" name="" id="" checked={isChecked2} onChange={interestOnlyChecked} />
                        <label htmlFor="type"><h4>Interest Only</h4></label>
                    </div>
                    <h6 style={errorState.type ? show : null}>{errorMessage}</h6>
                </div>
                <button type="submit" onClick={calculate} >
                    <img src="/images/icon-calculator.svg" alt="calculator icon" />
                    <h4>Calculate Repayments</h4>
                </button>
            </form>
            </div>
            <Result
                checkStatus={isChecked1 || isChecked2}
                repayment={repayment}
                totalRepayment={totalRepayment}
                submitted={repayment ? true : false}
            />
        </div>
    )
}