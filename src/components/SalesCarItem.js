import { Button } from "react-bootstrap";

const SalesCarItem = (props) => {
  return (
    <div className="car-item col-lg-4 col-md-6 col-sm-12">
      <div className="thumb">
        <img src={props.car.image} alt="item" />
      </div>
      <div className="car-item-body">
        <div className="content">
          <h4 className="title">{props.car.name}</h4>
          <span className="price">Price: {props.car.price / 10 ** 6} ALGO</span>
          <p>{props.car.additionalInfo}</p>
          <Button onClick={() => props.buyCar(props.car)} className="cmn-btn">
            Buy Car
          </Button>
        </div>
        <div className="car-item-meta">
          <ul className="details-list">
            <li>
              <i className="fa fa-refresh" />
              {props.car.isUsed === 1 ? "Used" : "New"}
            </li>
            <li>
              <i className="fa fa-car" />
              {props.car.model}
            </li>
            <li>
              <i className="fa fa-tachometer" />
              {props.car.mileage}
            </li>
            <li>
              <i className="fa fa-cogs" />
              {props.car.transmission}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SalesCarItem;
