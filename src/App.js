import React, { useState, useEffect } from "react";
import './App.css';
import { buyCarAction, createCarAction, getCarsAction, sellCarAction } from "./utils/marketplace";
import Header from './components/Header';
import Banner from './components/Banner';
import SalesCars from './components/SalesCars';
import AddCar from './components/AddCar';
import Footer from './components/Footer';
import MyCar from './components/MyCar';
import { indexerClient, myAlgoConnect } from "./utils/constants";
import Cover from "./components/Cover";

const App = function AppWrapper() {


  const [address, setAddress] = useState(null);
  const [name, setName] = useState(null);
  const [balance, setBalance] = useState(0);
  const [cars, setCars] = useState([])
  const [myCars, setMyCars] = useState([])

  const fetchBalance = async (accountAddress) => {
    indexerClient.lookupAccountByID(accountAddress).do()
      .then(response => {
        const _balance = response.account.amount;
        setBalance(_balance);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const connectWallet = async () => {
    myAlgoConnect.connect()
      .then(accounts => {
        const _account = accounts[0];
        console.log(_account)
        setAddress(_account.address);
        setName(_account.name);
        fetchBalance(_account.address);
        if (_account.address) getCars(_account.address);
      }).catch(error => {
        console.log('Could not connect to MyAlgo wallet');
        console.error(error);
      })
  };


  const buyCar = (car) => {
    buyCarAction(address, car)
      .then(() => {
        getCars(address);
        fetchBalance(address);
      })
      .catch(error => {
        console.log(error)
      })
  }


  const sellCar = (car) => {
    sellCarAction(address, car)
      .then(() => {
        getCars(address);
        fetchBalance(address);
      })
      .catch(error => {
        console.log(error)
      })
  }


  const addtoCars = async (data) => {
    console.log(data);
    createCarAction(address, data)
      .then(() => {
        getCars(address);
        fetchBalance(address);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const getCars = async (_address) => {
    try {
      const cars = await getCarsAction();
      setCars(cars);
      const myCars = cars.filter(car => car.owner === _address && (car.isSale === 0))
      console.log(myCars);
      setMyCars(myCars);
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <>
      {address ? <div className="content">
        <Header balance={balance} />
        <Banner />
        <SalesCars cars={cars} buyCar={buyCar} />
        <AddCar addToCars={addtoCars} />
        <MyCar cars={myCars} sellCar={sellCar} />
        <Footer />
      </div> : <Cover name={"Algo Dealer"} coverImg={"https://images.unsplash.com/photo-1605152322258-210926fd2faf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"} connect={connectWallet} />}
    </>
  );
}

export default App;


// impact, category, announce, song, caught, among, expand, morning, habit, armor, athlete, fiscal, update, bachelor, luggage, render, holiday, plate, asthma, decade, relief, opinion, horror, ability, circle