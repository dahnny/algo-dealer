import slideImg1 from '../images/slide-img1.jpg'

const Banner = props => {
    return (

        <section className="banner-section bg_img" data-background={slideImg1}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-7">
                        <div className="banner-content">
                            <h1 className="title">Best Car Dealer</h1>
                            <p>We offer the best car service in the city. Dont miss out on this oppurtunity to be a car owner</p>
                            <a href="#0" className="cmn-btn">Buy/Sell your car</a>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="banner-img">
                            {/* <img src=alt="image" /> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>



    );
}

export default Banner;