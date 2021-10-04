import Monsoon from "../../contracts/Monsoon.cdc"

// This scripts returns the number of Monsoon currently in existence.

pub fun main(): UInt64 {    
    return Monsoon.totalBurned
}
