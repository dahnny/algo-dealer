import one from '../image/money-method/1.png';
import two from '../image/money-method/2.png';
import three from '../image/money-method/3.png';

const Footer = props => {
    return (
        <div className="footer-bottom" style = {{backgroundColor: "#363636"}}>
            <div className="container">
                <div className="row justify-content-between">
                    <div className="col-sm-6">
                        <p className="copy-right-text"><a href="#">AlgoDealer</a></p>
                    </div>
                    <div className="col-sm-6">
                        <ul className="payment-method d-flex justify-content-end">
                            <li>We accept</li>
                            <li><img src={one} alt="one" /></li>
                            <li><img src={two} alt="two" /></li>
                            <li><img src={three} alt="three" /></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Footer;