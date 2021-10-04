import Monsoon from "../../contracts/Monsoon.cdc"

// This scripts returns the number of Monsoon currently in existence.

pub fun main(): {String: UInt64} {    
    return Monsoon.getTotals()
}
