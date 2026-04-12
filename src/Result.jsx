export default function Result(props){

    const whiteColor = {color:" hsl(0, 0%, 100%)"}
    return(
        props.submitted ?
            <section section aria-label="result section" className="actual-result">
                <h3>Your results</h3>
                <p>Your results are shown below based on the information you provided. To adjust the results, edit the form and click "Calculate repayments" again.</p>
                <div className="result-box">
                    <div className="monthly-repayment">
                        <p>Your monthly Repayments</p>
                        <h1>£{props.repayment?.toFixed(2)}</h1>
                    </div>
                    <div className="total-repayment">
                        <p>Total you'll repay over the term</p>
                        <h3 style={whiteColor}>£{props.totalRepayment?.toFixed(2)}</h3>
                    </div>
                </div>
            </section> :
            <section aria-label="form instruction section" className="result-placeholder">
                <img src={`${import.meta.env.BASE_URL}/images/illustration-empty.svg`} alt="result placeholder image" />
                <h3 style={whiteColor}>Results shown here</h3>
                <p>Complete the form and click "Calculate repayments" to see what your monthly repayment will be</p>
            </section>
    )
    
}