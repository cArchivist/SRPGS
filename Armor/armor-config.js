/**
 * Modes
 * 
 * DAMAGE_MODE
 * FIXED -- if a unit takes damage, reduce armor by fixed amount defined at ArmorConfig.fixedDamage
 * OVER -- if a unit takes damage, reduce armor by damage taken
 * FRACTION -- if a unit is hit, reduce armor by attacker's Atk/fractionDamage
 *  */ 

var DAMAGE_MODE = {
    FIXED: 1,
    OVERFLOW: 2,
    FRACTION: 3
}

/**
 * HEAL_MODE
 * NEVER -- if armor is damaged, do not automatically replenish
 * MAP_END -- replenish armor in between maps
 * 
 * This could possibly be redone with flags to denote different heal times, but need additional options first
 */

var HEAL_MODE = {
    NEVER: 1,
    MAP_END: 2
}

var ArmorConfig = {
    fixedDamage: 1, //amount each hit does to armor
    fractionDamage: 4, //amount to divide damage by
    damageMode: DAMAGE_MODE.FRACTION,
    healMode: HEAL_MODE.MAP_END
}