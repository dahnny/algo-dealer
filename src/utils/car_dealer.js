import algosdk from "algosdk";
import {
  algodClient,
  indexerClient,
  marketplaceNote,
  minRound,
  myAlgoConnect,
  numGlobalBytes,
  numGlobalInts,
  numLocalBytes,
  numLocalInts,
} from "./constants";
/* eslint import/no-webpack-loader-syntax: off */
import approvalProgram from "!!raw-loader!../contracts/car_dealer_approval.teal";
import clearProgram from "!!raw-loader!../contracts/car_dealer_clear.teal";
import {
  base64ToUTF8String,
  getAddress,
  utf8ToBase64String,
} from "./conversions";

class Car {
  constructor(
    creator,
    name,
    image,
    model,
    mileage,
    transmission,
    additionalInfo,
    price,
    isUsed,
    isSale,
    isBought,
    appId,
    owner
  ) {
    this.creator = creator;
    this.name = name;
    this.image = image;
    this.model = model;
    this.mileage = mileage;
    this.transmission = transmission;
    this.additionalInfo = additionalInfo;
    this.price = price;
    this.isUsed = isUsed;
    this.isSale = isSale;
    this.isBought = isBought;
    this.appId = appId;
    this.owner = owner;
  }
}

const compileProgram = async (programSource) => {
  let encoder = new TextEncoder();
  let programBytes = encoder.encode(programSource);
  let compileResponse = await algodClient.compile(programBytes).do();
  return new Uint8Array(Buffer.from(compileResponse.result, "base64"));
};

// CREATE CAR: ApplicationCreateTxn
export const createCarAction = async (senderAddress, car) => {
  console.log("Adding car...");

  let params = await algodClient.getTransactionParams().do();

  // Compile programs
  const compiledApprovalProgram = await compileProgram(approvalProgram);
  const compiledClearProgram = await compileProgram(clearProgram);

  // Build note to identify transaction later and required app args as Uint8Arrays
  let note = new TextEncoder().encode(marketplaceNote);
  let name = new TextEncoder().encode(car.name);
  let image = new TextEncoder().encode(car.image);
  let model = new TextEncoder().encode(car.model);
  let mileage = algosdk.encodeUint64(Number(car.mileage));
  let transmission = new TextEncoder().encode(car.transmission);
  let isUsed = algosdk.encodeUint64(Number(car.isUsed));
  let additionalInfo = new TextEncoder().encode(car.additionalInfo);
  let price = algosdk.encodeUint64(Number(car.price));

  let appArgs = [
    name,
    image,
    model,
    mileage,
    transmission,
    isUsed,
    additionalInfo,
    price,
  ];

  // Create ApplicationCreateTxn
  let txn = algosdk.makeApplicationCreateTxnFromObject({
    from: senderAddress,
    suggestedParams: params,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    approvalProgram: compiledApprovalProgram,
    clearProgram: compiledClearProgram,
    numLocalInts: numLocalInts,
    numLocalByteSlices: numLocalBytes,
    numGlobalInts: numGlobalInts,
    numGlobalByteSlices: numGlobalBytes,
    note: note,
    appArgs: appArgs,
  });

  // Get transaction ID
  let txId = txn.txID().toString();

  // Sign & submit the transaction
  let signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
  console.log("Signed transaction with txID: %s", txId);
  await algodClient.sendRawTransaction(signedTxn.blob).do();

  // Wait for transaction to be confirmed
  let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

  // Get the completed Transaction
  console.log(
    "Transaction " +
      txId +
      " confirmed in round " +
      confirmedTxn["confirmed-round"]
  );

  // Get created application id and notify about completion
  let transactionResponse = await algodClient
    .pendingTransactionInformation(txId)
    .do();
  let appId = transactionResponse["application-index"];
  console.log("Created new app-id: ", appId);
  return appId;
};

// BUY car: Group transaction consisting of ApplicationCallTxn and PaymentTxn
export const buyCarAction = async (senderAddress, car) => {
  console.log("Buying car...", senderAddress);

  let params = await algodClient.getTransactionParams().do();

  // Build required app args as Uint8Array
  let buyArg = new TextEncoder().encode("buy");
  let appArgs = [buyArg];

  // Create ApplicationCallTxn
  let appCallTxn = algosdk.makeApplicationCallTxnFromObject({
    from: senderAddress,
    appIndex: car.appId,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams: params,
    appArgs: appArgs,
  });

  // Create PaymentTxn
  let paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: senderAddress,
    to: car.owner,
    amount: car.price,
    suggestedParams: params,
  });

  let txnArray = [appCallTxn, paymentTxn];

  // Create group transaction out of previously build transactions
  let groupID = algosdk.computeGroupID(txnArray);
  for (let i = 0; i < 2; i++) txnArray[i].group = groupID;

  // Sign & submit the group transaction
  let signedTxn = await myAlgoConnect.signTransaction(
    txnArray.map((txn) => txn.toByte())
  );
  console.log("Signed group transaction");
  let tx = await algodClient
    .sendRawTransaction(signedTxn.map((txn) => txn.blob))
    .do();

  // Wait for group transaction to be confirmed
  let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);

  // Notify about completion
  console.log(
    "Group transaction " +
      tx.txId +
      " confirmed in round " +
      confirmedTxn["confirmed-round"]
  );
};

export const sellCarAction = async (senderAddress, car, newPrice) => {
  console.log("Selling car...");

  let params = await algodClient.getTransactionParams().do();

  // Build required app args as Uint8Array
  let sellArg = new TextEncoder().encode("sell");
  let price = algosdk.encodeUint64(newPrice);

  let appArgs = [sellArg, price];

  // Create ApplicationCallTxn
  let appCallTxn = algosdk.makeApplicationCallTxnFromObject({
    from: senderAddress,
    appIndex: car.appId,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams: params,
    appArgs: appArgs,
  });

  let txId = appCallTxn.txID().toString();

  // Sign & submit the transaction
  let signedTxn = await myAlgoConnect.signTransaction(appCallTxn.toByte());
  console.log("Signed transaction with txID: %s", txId);
  await algodClient.sendRawTransaction(signedTxn.blob).do();

  // Wait for transaction to be confirmed
  let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

  // Get the completed Transaction
  console.log(
    "Transaction " +
      txId +
      " confirmed in round " +
      confirmedTxn["confirmed-round"]
  );
};

export const deleteProductAction = async (senderAddress, index) => {
  console.log("Deleting application...");

  let params = await algodClient.getTransactionParams().do();

  // Create ApplicationDeleteTxn
  let txn = algosdk.makeApplicationDeleteTxnFromObject({
    from: senderAddress,
    suggestedParams: params,
    appIndex: index,
  });

  // Get transaction ID
  let txId = txn.txID().toString();

  // Sign & submit the transaction
  let signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
  console.log("Signed transaction with txID: %s", txId);
  await algodClient.sendRawTransaction(signedTxn.blob).do();

  // Wait for transaction to be confirmed
  const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

  // Get the completed Transaction
  console.log(
    "Transaction " +
      txId +
      " confirmed in round " +
      confirmedTxn["confirmed-round"]
  );

  // Get application id of deleted application and notify about completion
  let transactionResponse = await algodClient
    .pendingTransactionInformation(txId)
    .do();
  let appId = transactionResponse["txn"]["txn"].apid;
  console.log("Deleted app-id: ", appId);
};

export const getCarsAction = async () => {
  console.log("Fetching cars...");
  let note = new TextEncoder().encode(marketplaceNote);
  let encodedNote = Buffer.from(note).toString("base64");

  // Step 1: Get all transactions by notePrefix (+ minRound filter for performance)
  let transactionInfo = await indexerClient
    .searchForTransactions()
    .notePrefix(encodedNote)
    .txType("appl")
    .minRound(minRound)
    .do();
  let cars = [];
  for (const transaction of transactionInfo.transactions) {
    let appId = transaction["created-application-index"];
    if (appId) {
      // Step 2: Get each application by application id
      let car = await getApplication(appId);
      if (car) {
        cars.push(car);
      }
    }
  }
  console.log("Cars fetched.");
  return cars;
};

const getApplication = async (appId) => {
  try {
    // 1. Get application by appId
    let response = await indexerClient
      .lookupApplications(appId)
      .includeAll(true)
      .do();
    if (response.application.deleted) {
      return null;
    }
    let globalState = response.application.params["global-state"];

    // 2. Parse fields of response and return product
    let creator = response.application.params.creator;
    let name = "";
    let image = "";
    let model = "";
    let mileage = 0;
    let transmission = "";
    let additionalInfo = "";
    let owner = "";
    let price = 0;
    let isUsed = 0;
    let isSale = 0;
    let isBought = 0;

    const getField = (fieldName, globalState) => {
      return globalState.find((state) => {
        return state.key === utf8ToBase64String(fieldName);
      });
    };

    if (getField("NAME", globalState) !== undefined) {
      let field = getField("NAME", globalState).value.bytes;
      name = base64ToUTF8String(field);
    }

    if (getField("IMAGE", globalState) !== undefined) {
      let field = getField("IMAGE", globalState).value.bytes;
      image = base64ToUTF8String(field);
    }

    if (getField("MODEL", globalState) !== undefined) {
      let field = getField("MODEL", globalState).value.bytes;
      model = base64ToUTF8String(field);
    }

    if (getField("MILEAGE", globalState) !== undefined) {
      mileage = getField("MILEAGE", globalState).value.uint;
    }

    if (getField("TRANSMISSION", globalState) !== undefined) {
      let field = getField("TRANSMISSION", globalState).value.bytes;
      transmission = base64ToUTF8String(field);
    }

    if (getField("ADDINFO", globalState) !== undefined) {
      let field = getField("ADDINFO", globalState).value.bytes;
      additionalInfo = base64ToUTF8String(field);
    }

    if (getField("PRICE", globalState) !== undefined) {
      price = getField("PRICE", globalState).value.uint;
    }

    if (getField("ISUSED", globalState) !== undefined) {
      isUsed = getField("ISUSED", globalState).value.uint;
    }

    if (getField("ISSALE", globalState) !== undefined) {
      isSale = getField("ISSALE", globalState).value.uint;
    }

    if (getField("ISBOUGHT", globalState) !== undefined) {
      isBought = getField("ISBOUGHT", globalState).value.uint;
    }

    if (getField("OWNER", globalState) !== undefined) {
      let field = getField("OWNER", globalState).value.bytes;
      owner = getAddress(field);
    }

    return new Car(
      creator,
      name,
      image,
      model,
      mileage,
      transmission,
      additionalInfo,
      price,
      isUsed,
      isSale,
      isBought,
      appId,
      owner
    );
  } catch (err) {
    return null;
  }
};
