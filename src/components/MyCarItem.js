const MyCarItem = props => {
    return (
        <div className="car-item col-lg-4 col-md-6 col-sm-12">
            <div className="thumb">
                <img src={props.car.image} alt="item" />
            </div>
            <div className="car-item-body">
                <div className="content">
                    <h4 className="title">{props.car.name}</h4>
                    <span className="price">Price:{props.car.price / 10 ** 6} ALGO</span>
                    <p>{props.car.description}</p>
                    {(props.car.isBought === 1) && <div>
                        <a onClick={() => props.sellCar(props.car)} className="cmn-btn">Sell Car</a>
                    </div>}

                </div>
                <div className="car-item-meta">
                    <ul className="details-list">
                        <li><i className="fa fa-car" />model 2014ib</li>
                        <li><i className="fa fa-tachometer" />32000 KM</li>
                        <li><i className="fa fa-sliders" />auto</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default MyCarItem;