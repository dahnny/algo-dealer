import React, { useState } from "react";
import { stringToMicroAlgos } from "../utils/conversions";
import { Button, FloatingLabel, Form } from "react-bootstrap";

const MyCarItem = (props) => {
  const [newPrice, setNewPrice] = useState(0);
  return (
    <div className="car-item col-lg-4 col-md-6 col-sm-12">
      <div className="thumb">
        <img src={props.car.image} alt="item" />
      </div>
      <div className="car-item-body">
        <div className="content">
          <h4 className="title">{props.car.name}</h4>
          <span className="price">Price:{props.car.price / 10 ** 6} ALGO</span>
          <p>{props.car.additionalInfo}</p>
          {props.car.isBought === 1 && (
            <div className="d-flex flex-column text-center">
              <Form className="d-flex align-content-center flex-row gap-2">
                <FloatingLabel
                  controlId="inputPrice"
                  label="Price"
                  className="w-25"
                >
                  <Form.Control
                    type="number"
                    value={newPrice}
                    min="1"
                    onChange={(e) => {
                      setNewPrice(e.target.value);
                    }}
                  />
                </FloatingLabel>
                <Button
                  variant="outline-dark"
                  disabled={newPrice === 0}
                  onClick={() =>
                    props.sellCar(props.car, stringToMicroAlgos(newPrice))
                  }
                  className="w-75 py-3 "
                >
                  Sell car for {newPrice} Algos
                </Button>
              </Form>
            </div>
          )}
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

export default MyCarItem;
