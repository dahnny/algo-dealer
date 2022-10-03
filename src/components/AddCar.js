import { useState } from "react";
import { stringToMicroAlgos } from "../utils/conversions";

const AddCar = (props) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [model, setModel] = useState("");
  const [mileage, setMileage] = useState(0);
  const [transmission, setTransmission] = useState("Manual");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [price, setPrice] = useState(0);
  const [isUsed, setIsUsed] = useState("false");

  const submitHandler = (event) => {
    event.preventDefault();
    props.addToCars({
      name,
      image,
      model,
      mileage,
      transmission,
      isUsed,
      additionalInfo,
      price,
    });
    setName("");
    setImage("");
    setPrice("");
    setModel("");
    setAdditionalInfo("");
  };
  const convertToBool = (text) => {
    if (text === "true") {
      return 1;
    } else if (text === "false") {
      return 0;
    }
  };

  return (
    <section id="0" className=" pt-120 pb-120">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Add Car</h2>
          {/* <p> Look through our equisite selection of cars and get one that fits your choice</p> */}
        </div>
        <form className="reservation-form" onSubmit={submitHandler}>
          <div className="content-block"></div>
          <div className="content-block">
            <div className="row">
              <div className="col-lg-6 form-group">
                <input
                  type="text"
                  placeholder="Car Name"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="col-lg-6 form-group">
                <input
                  type="text"
                  placeholder="Image URL"
                  required
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
              <div className="col-lg-6 form-group">
                <input
                  type="text"
                  placeholder="Car Model"
                  required
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
              <div className="col-lg-6 form-group">
                <input
                  type="text"
                  placeholder="Mileage"
                  required
                  onChange={(e) => setMileage(e.target.value)}
                />
              </div>
              <div className="col-lg-6 form-group">
                <select onChange={(e) => setTransmission(e.target.value)}>
                  <option>Transmission System</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <div className="col-lg-6 form-group">
                <input
                  type="number"
                  placeholder="Price"
                  required
                  onChange={(e) => setPrice(stringToMicroAlgos(e.target.value))}
                />
              </div>
              <div className="col-lg-6 form-group">
                <select
                  onChange={(e) => setIsUsed(convertToBool(e.target.value))}
                >
                  <option>is Used</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            </div>
          </div>
          <div className="content-block">
            <div className="row">
              <div className="col-lg-12 form-group">
                <textarea
                  value={additionalInfo}
                  placeholder="Additional Info"
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                />
              </div>
              <div className="col-lg-12">
                <button type="submit" className="cmn-btn">
                  Add your Car
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddCar;
