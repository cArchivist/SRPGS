/**
 * Modes
 * 
 * FIXEDDAMAGE -- if a unit takes damage, reduce armor by fixed amount
 * OVERDAMAGE -- if a unit takes damage, reduce armor by damage taken
 *  */ 

var ARMOR_MODE = {
    FIXEDDAMAGE: 1,
    OVERDAMAGE: 2
}

var ArmorConfig = {
    fixedDamage: 1,
    mode: ARMOR_MODE.OVERDAMAGE
}