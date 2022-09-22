import MyCarItem from './MyCarItem';

const MyCar = props => {
    return (
        <section className="choose-car-section pt-120 pb-120 section-bg">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="section-header text-center">
                                <h2 className="section-title">Bought Cars</h2>
                                
                            </div>
                        </div>
                    </div>
                    <div className="row">

                        {props.cars.map(car => <MyCarItem key={car.index} car={car} sellCar = {props.sellCar}/>)}

                    </div>
                </div>
            </section>
    )
}

export default MyCar;