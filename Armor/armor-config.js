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

var REDUCTION_MODE = {
    STAT: 1, // damage reduced proportional to remaining armor
    PERCENT: 2, // damage reduced as percentage (set at ArmorConfig.reduceValue, e.g. 20 is 20% reduction)
    FIXED: 3 // damage reduced by fixed amount regardless of remaining armor (set at ArmorConfig.reduceValue, e.g. 3 is a fixed 3 damage difference)
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
    fractionDamage: 4, //amount to divide armor damage by
    shearOnly: true, // set to true to only damage armor with weapons that have a shear or shearmul value
    damageMode: DAMAGE_MODE.FIXED,
    healMode: HEAL_MODE.MAP_END,
    reductionMode: REDUCTION_MODE.STAT,
    reduceValue: 4
}