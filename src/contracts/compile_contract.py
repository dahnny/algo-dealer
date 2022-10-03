from pyteal import *

from car_dealer_contract import CarDealer

if __name__ == "__main__":
    approval_program = CarDealer().approval_program()
    clear_program = CarDealer().clear_program()

    # Mode.Application specifies that this is a smart contract
    compiled_approval = compileTeal(approval_program,
                                    Mode.Application,
                                    version=6)
    print(compiled_approval)
    with open("car_dealer_approval.teal", "w") as teal:
        teal.write(compiled_approval)
        teal.close()

    # Mode.Application specifies that this is a smart contract
    compiled_clear = compileTeal(clear_program, Mode.Application, version=6)
    print(compiled_clear)
    with open("car_dealer_clear.teal", "w") as teal:
        teal.write(compiled_clear)
        teal.close()