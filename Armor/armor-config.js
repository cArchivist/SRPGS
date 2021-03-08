/**
 * Modes
 * 
 * DAMAGE_MODE
 * FIXED -- if a unit takes damage, reduce armor by fixed amount defined at ArmorConfig.fixedDamage
 * OVER -- if a unit takes damage, reduce armor by damage taken
 *  */ 

var DAMAGE_MODE = {
    FIXED: 1,
    OVERFLOW: 2
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
    fixedDamage: 1,
    damageMode: DAMAGE_MODE.OVERFLOW,
    healMode: HEAL_MODE.MAP_END
}