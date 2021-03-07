/** 
 * Armor Stat
 * 
 * Script by CrimeanArchivist
 * 
 * Adds a unit parameter representing an armor value as a custom parameter set at `unit.custom.arm.value`.  This value is added
 * to Def/Res during combat and is reduced as the unit takes damage according to a function determined by configuration modes in 
 * `armor-config.js`.  It is not replenished by any means.
 * 
 * Possible conflicts:
 *   - overwrites `DamageCalculator.calculateDefense`
 *   - overwrites `NormalAttackOrderBuilder._configureEvaluator`
 *   - assumes there are no additional custom stats besides itself
 * 
 * Versions
 * 
 * 1.0 -- basic armor functionality with FIXEDDAMAGE and OVERDAMAGE reduction modes
 * 
 * Possible enhancements:
 *   - separate magic and physical armor values
 *   - `ALWAYSREDUCE` reduce armor mode -- reduce armor whenever hit, not just damaged
 *   - optionally refresh armor at the end of maps / on entering base
 *     - relatedly, store current value and base value in different places for purposes of refreshing at points
 *   - enable item + weapon bonuses like other stats
 */

// Modify param namespace to make room for armor
ParamType.ARM = 11
ParamType.COUNT = 12

paramArrayAlias = ParamGroup._configureUnitParameters;
ParamGroup._configureUnitParameters = function(groupArray) {
    paramArrayAlias.call(this, groupArray);
    groupArray.appendObject(UnitParameter.ARM);
}

// Add to RealBonus and ParamBonus
RealBonus.getArm = function(unit) {
    return ParamBonus.getArm(unit);
}

// TODO -- enable weapon bonuses like other stats
ParamBonus.getArm = function(unit) {
    if (unit.custom.arm != null) {
        return unit.custom.arm.value;
    }
    return 0;
}

// Add unit parameter for "ARM"

UnitParameter.ARM = defineObject(BaseUnitParameter, {

    getParameterType: function() {
        return ParamType.ARM;
    },

    getParameterName: function() {
		return "Armor";
    },

    getMinValue: function() {
        return 0;
    },

    getSignal: function() {
        return "arm";
    },

    getUnitValue: function(unit) {
        if (unit.custom.arm != null) {
            return unit.custom.arm.value;
        }
        return 0;
    },

    setUnitValue: function(unit, value) {
        if (unit.custom.arm != null) {
            unit.custom.arm.value = value;
        }
        return;
    }
})

// Make armor reduce damage

DamageCalculator.calculateDefense = function(active, passive, weapon, isCritical, totalStatus, trueHitValue) {
    var def;
		
    if (this.isNoGuard(active, passive, weapon, isCritical, trueHitValue)) {
        return 0;
    }
    
    if (Miscellaneous.isPhysicsBattle(weapon)) {
        // Physical attack or Bow attack.
        def = RealBonus.getDef(passive);
    }
    else {
        // Magic attack
        def = RealBonus.getMdf(passive);
    }
    
    def += CompatibleCalculator.getDefense(passive, active, ItemControl.getEquippedWeapon(passive)) + SupportCalculator.getDefense(totalStatus);
    def += RealBonus.getArm(passive);
    
    return def;
}

// Armor reduced when attack is evaluated

AttackEvaluator.ArmorReduction = defineObject(BaseAttackEvaluator, {
    evaluateAttackEntry: function(virtualActive, virtualPassive, attackEntry) {
        if (virtualActive.hp > 0) {
            ArmorControl.reduceArmor(virtualActive, attackEntry.damageActive);
        }
        if (virtualPassive.hp > 0) {
            ArmorControl.reduceArmor(virtualPassive, attackEntry.damagePassive);
        }
    }
})

// add to evaluator list

NormalAttackOrderBuilder._configureEvaluator = function(groupArray) {
    groupArray.appendObject(AttackEvaluator.HitCritical);
    groupArray.appendObject(AttackEvaluator.ActiveAction);
    groupArray.appendObject(AttackEvaluator.PassiveAction);
    
    groupArray.appendObject(AttackEvaluator.TotalDamage);
    groupArray.appendObject(AttackEvaluator.ArmorReduction);
    
    // Decide motion to use for the real battle at the AttackMotion and DamageMotion.
    // attackEntry.isCritical and attackEntry.isFinish are needed to be initialized.
    groupArray.appendObject(AttackEvaluator.AttackMotion);
    groupArray.appendObject(AttackEvaluator.DamageMotion);
}