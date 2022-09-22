import { Fragment } from 'react';
import SalesCarItem from './SalesCarItem';


const SalesCars = props => {

    return (
        <Fragment>
            <section className="choose-car-section pt-120 pb-120 section-bg">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="section-header text-center">
                                <h2 className="section-title">Cars for Sale</h2>
                                <p> Look through our equisite selection of cars and get one that fits your choice</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">

                        {props.cars.map(car => (car.isSale !== 0) && <SalesCarItem key={car.appId} car={car} buyCar={props.buyCar} />)}

                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="section-header text-center">
                                <h2 className="section-title">our awesome features</h2>
                                <p>These is what makes us at AlgoDealer special</p>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-none-30">
                        <div className="col-lg-4 col-sm-6">
                            <div className="icon-item text-center">
                                <div className="icon"><i className="fa fa-user" /></div>
                                <div className="content">
                                    <h4 className="title">New/Used Cars</h4>
                                    <p>We offer you the choice to choose between used and new cars</p>
                                </div>

                            </div>
                        </div>{/* icon-item end */}
                        <div className="col-lg-4 col-sm-6">
                            <div className="icon-item text-center">
                                <div className="icon"><i className="fa fa-rocket" /></div>
                                <div className="content">
                                    <h4 className="title">fast services</h4>
                                    <p>All our services are time and speed efficent </p>
                                </div>
                            </div>
                        </div>{/* icon-item end */}
                        <div className="col-lg-4 col-sm-6">
                            <div className="icon-item text-center">
                                <div className="icon"><i className="fa fa-volume-control-phone" /></div>
                                <div className="content">
                                    <h4 className="title">customer support</h4>
                                    <p>We offer 24/7 customer support </p>

                                </div>
                            </div>
                        </div>{/* icon-item end */}
                    </div>
                </div>
            </section>

        </Fragment>


    );
}

export default SalesCars;