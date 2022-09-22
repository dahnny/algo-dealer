
const SalesCarItem = props => {
    return (
        <div className="car-item col-lg-4 col-md-6 col-sm-12">
            <div className="thumb">
                <img src={props.car.image} alt="item" />
            </div>
            <div className="car-item-body">
                <div className="content">
                    <h4 className="title">{props.car.name}</h4>
                    <span className="price">Price:{props.car.price/ 10 **6} ALGO</span>
                    <p>{props.car.description}</p>
                    <a onClick={()=>props.buyCar(props.car)} className="cmn-btn">Buy Car</a>
                </div>
                <div className="car-item-meta">
                    <ul className="details-list">
                        <li><i className="fa fa-sliders" />{(props.car.isUsed === 1) ? 'Used' : 'New'}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SalesCarItem;