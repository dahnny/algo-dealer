from pyteal import *


class CarDealer:
    class Variables:
        name = Bytes("NAME")
        description = Bytes("DESCRIPTION")
        image = Bytes("IMAGE")
        price = Bytes("PRICE")
        isUsed = Bytes("ISUSED")
        isSale = Bytes("ISSALE")
        isBought = Bytes("ISBOUGHT")
        address = Bytes("ADDRESS")
        owner = Bytes("OWNER")

    class AppMethods:
        buyCar = Bytes("buy")
        sellCar = Bytes("sell")

    def application_creation(self):
        return Seq([
            Assert(Txn.application_args.length() == Int(7)),
            Assert(Txn.note() == Bytes("carDealer:uv0001")),
            Assert(Btoi(Txn.application_args[3]) > Int(0)),
            App.globalPut(self.Variables.name, Txn.application_args[0]),
            App.globalPut(self.Variables.description, Txn.application_args[1]),
            App.globalPut(self.Variables.image, Txn.application_args[2]),
            App.globalPut(self.Variables.price, Btoi(Txn.application_args[3])),
            App.globalPut(self.Variables.isUsed,
                          Btoi(Txn.application_args[4])),
            App.globalPut(self.Variables.isSale,
                          Btoi(Txn.application_args[5])),
            App.globalPut(self.Variables.isBought, Int(0)),
            App.globalPut(self.Variables.address, Global.creator_address()),
            App.globalPut(self.Variables.owner, Txn.application_args[6]),
            Approve()
        ])

    def buy(self):

        return Seq([
            # first sanity checks to check transaction params
            Assert(
                And(
                    Global.group_size() == Int(2),
                    Txn.application_args.length() == Int(2),
                    App.globalGet(self.Variables.isSale) == Int(1)
                ),
            ),

            # checks for second transaction
            Assert(
                And(
                    Gtxn[1].type_enum() == TxnType.Payment,
                    Gtxn[1].receiver() == App.globalGet(
                        self.Variables.address),
                    Gtxn[1].amount() == App.globalGet(self.Variables.price),
                    Gtxn[1].sender() == Gtxn[0].sender(),
                )
            ),

            # The global state is updated using App.globalPut()

            App.globalPut(self.Variables.owner, Txn.application_args[1]),
            App.globalPut(self.Variables.address, Gtxn[1].sender()),
            App.globalPut(self.Variables.isSale, Int(0)),
            App.globalPut(self.Variables.isBought, Int(1)),
            Approve()
        ])


    def sell(self):
        Assert(
            And(
                Txn.application_args.length() == Int(2),
                App.globalGet(
                    self.Variables.owner) == Txn.application_args[1]
            ),
        )

        return Seq([
            App.globalPut(self.Variables.isSale, Int(1)),
            App.globalPut(self.Variables.isBought, Int(0)),
            Approve()
        ])



    def application_deletion(self):
        return Return(Txn.sender() == Global.creator_address())

    def application_start(self):
        return Cond(
            [Txn.application_id() == Int(0), self.application_creation()],
            [Txn.on_completion() == OnComplete.DeleteApplication,
             self.application_deletion()],
            [Txn.application_args[0] == self.AppMethods.buyCar, self.buy()],
            [Txn.application_args[0] == self.AppMethods.sellCar, self.sell()],
        )

    def approval_program(self):
        return self.application_start()

    def clear_program(self):
        return Return(Int(1))
