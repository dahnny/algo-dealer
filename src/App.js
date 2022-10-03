import React, { useState, useEffect } from "react";
import "./App.css";
import {
  buyCarAction,
  createCarAction,
  getCarsAction,
  sellCarAction,
} from "./utils/car_dealer";
import Header from "./components/Header";
import Banner from "./components/Banner";
import SalesCars from "./components/SalesCars";
import AddCar from "./components/AddCar";
import Footer from "./components/Footer";
import MyCar from "./components/MyCar";
import Loader from "./components/Loader";
import { indexerClient, myAlgoConnect } from "./utils/constants";
import Cover from "./components/Cover";

const App = function AppWrapper() {
  const [address, setAddress] = useState(null);
  const [name, setName] = useState(null);
  const [balance, setBalance] = useState(0);
  const [cars, setCars] = useState([]);
  const [myCars, setMyCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBalance = async (accountAddress) => {
    indexerClient
      .lookupAccountByID(accountAddress)
      .do()
      .then((response) => {
        const _balance = response.account.amount;
        setBalance(_balance);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const connectWallet = async () => {
    myAlgoConnect
      .connect()
      .then((accounts) => {
        const _account = accounts[0];
        setAddress(_account.address);
        setName(_account.name);
        fetchBalance(_account.address);
        if (_account.address) getCars(_account.address);
      })
      .catch((error) => {
        console.log("Could not connect to MyAlgo wallet");
        console.error(error);
      });
  };

  const disconnect = () => {
    setAddress(null);
    setName(null);
    setBalance(null);
  };

  const buyCar = (car) => {
    setLoading(true);
    buyCarAction(address, car)
      .then(() => {
        getCars(address);
        fetchBalance(address);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const sellCar = (car, newPrice) => {
    setLoading(true);
    sellCarAction(address, car, newPrice)
      .then(() => {
        getCars(address);
        fetchBalance(address);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const addtoCars = async (data) => {
    setLoading(true);
    createCarAction(address, data)
      .then(() => {
        getCars(address);
        fetchBalance(address);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const getCars = async (_address) => {
    setLoading(true);
    try {
      const cars = await getCarsAction();
      setCars(cars);
      const myCars = cars.filter(
        (car) => car.owner === _address && car.isSale === 0
      );
      setMyCars(myCars);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  return (
    <>
      {address ? (
        <div className="content">
          <Header
            name={name}
            balance={balance}
            disconnect={disconnect}
            address={address}
          />
          {!loading ? (
            <>
              <Banner />
              <SalesCars cars={cars} buyCar={buyCar} />
              <AddCar addToCars={addtoCars} />
              <MyCar cars={myCars} sellCar={sellCar} />
              <Footer />
            </>
          ) : (
            <Loader />
          )}
        </div>
      ) : (
        <Cover
          name={"Algo Dealer"}
          coverImg={
            "https://images.unsplash.com/photo-1605152322258-210926fd2faf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          }
          connect={connectWallet}
        />
      )}
    </>
  );
};

export default App;

// impact, category, announce, song, caught, among, expand, morning, habit, armor, athlete, fiscal, update, bachelor, luggage, render, holiday, plate, asthma, decade, relief, opinion, horror, ability, circle
