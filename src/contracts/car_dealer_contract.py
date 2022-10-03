from pyteal import *


class CarDealer:

    class Variables:  # 6 bytes, 5 ints
        name = Bytes("NAME")  # bytes
        image = Bytes("IMAGE")  # bytes
        model = Bytes("MODEL")  # bytes
        mileage = Bytes("MILEAGE")  # uint64
        transmission = Bytes("TRANSMISSION")  # bytes
        isUsed = Bytes("ISUSED")  # uint64
        additonal_info = Bytes("ADDINFO")  # bytes
        price = Bytes("PRICE")  # uint64
        isSale = Bytes("ISSALE")  # uint64
        isBought = Bytes("ISBOUGHT")  # uint64
        owner = Bytes("OWNER")  # bytes

    class AppMethods:
        buyCar = Bytes("buy")
        sellCar = Bytes("sell")

    def application_creation(self):
        return Seq([
            Assert(
                And(
                    # check that application args in txn is equal to 8
                    Txn.application_args.length() == Int(8),
                    # check that note supplied matches carDealer:uv0003
                    Txn.note() == Bytes("carDealer:uv0003"),
                    # check that price supplied is greater than zero
                    Btoi(Txn.application_args[7]) > Int(0),
                )),

            # store variables
            App.globalPut(self.Variables.name, Txn.application_args[0]),
            App.globalPut(self.Variables.image, Txn.application_args[1]),
            App.globalPut(self.Variables.model, Txn.application_args[2]),
            App.globalPut(self.Variables.mileage,
                          Btoi(Txn.application_args[3])),
            App.globalPut(self.Variables.transmission,
                          Txn.application_args[4]),
            App.globalPut(self.Variables.isUsed,
                          Btoi(Txn.application_args[5])),
            App.globalPut(self.Variables.additonal_info,
                          Txn.application_args[6]),
            App.globalPut(self.Variables.price, Btoi(Txn.application_args[7])),
            App.globalPut(self.Variables.isSale, Int(1)),
            App.globalPut(self.Variables.isBought, Int(0)),
            App.globalPut(self.Variables.owner, Txn.sender()),
            Approve()
        ])

    def buy(self):
        return Seq([
            # first sanity checks to check transaction params
            Assert(
                And(
                    # check that there are two transactions in this group and that first one being the buy function and the second being the payment transactions
                    Global.group_size() == Int(2),
                    Txn.group_index() == Int(0),

                    # check that the isSale status is set to 1
                    App.globalGet(self.Variables.isSale) == Int(1)), ),

            # checks for second transaction
            Assert(
                And(
                    Gtxn[1].type_enum() == TxnType.Payment,
                    Gtxn[1].receiver() == App.globalGet(self.Variables.owner),
                    Gtxn[1].amount() == App.globalGet(self.Variables.price),
                    Gtxn[1].sender() == Gtxn[0].sender(),
                )),

            # The global state is updated using App.globalPut()
            App.globalPut(self.Variables.owner, Gtxn[1].sender()),
            App.globalPut(self.Variables.isSale, Int(0)),
            App.globalPut(self.Variables.isBought, Int(1)),
            Approve()
        ])

    def sell(self):
        return Seq([
            Assert(
                And(
                    # check that application args in txn is equal to 2
                    Txn.application_args.length() == Int(2),
                    # check that new price supplied is greater than 0
                    Btoi(Txn.application_args[1]) > Int(0),
                    # check that the isBought status is set to 1
                    App.globalGet(self.Variables.isBought) == Int(1),
                    # check that the person calling this transaction is equal to owner
                    App.globalGet(self.Variables.owner) == Txn.sender(),
                ), ),
            App.globalPut(self.Variables.price, Btoi(Txn.application_args[1])),
            App.globalPut(self.Variables.isSale, Int(1)),
            App.globalPut(self.Variables.isBought, Int(0)),
            Approve()
        ])

    def application_deletion(self):
        return Return(Txn.sender() == App.globalGet(self.Variables.owner))

    def application_start(self):
        return Cond(
            [Txn.application_id() == Int(0),
             self.application_creation()],
            [
                Txn.on_completion() == OnComplete.DeleteApplication,
                self.application_deletion()
            ],
            [Txn.application_args[0] == self.AppMethods.buyCar,
             self.buy()],
            [Txn.application_args[0] == self.AppMethods.sellCar,
             self.sell()],
        )

    def approval_program(self):
        return self.application_start()

    def clear_program(self):
        return Return(Int(1))
