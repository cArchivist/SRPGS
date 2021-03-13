/**
 * Controller for key armor methods + reduce modes
 */

var armorFixedReduce = function(virtualUnit, virtualPassiveUnit, damageSustained) {
    unit = virtualUnit.unitSelf;
    if (unit.custom.arm != null) {
        if (damageSustained != 0) {
            unitArmor = unit.custom.arm.value;
            if (unitArmor != 0) {
                unitArmor -= ArmorConfig.fixedDamage;
            }
            if (unitArmor < 0) {
                unitArmor = 0;
            }
            unit.custom.arm.value = unitArmor;
        }
    }
}

var overDamageReduce = function(virtualUnit, virtualPassiveUnit, damageSustained) {
    unit = virtualUnit.unitSelf;
    if (unit.custom.arm != null && unit.custom.arm.value != 0) {
        unitArmor = unit.custom.arm.value - damageSustained;
        if (unitArmor < 0) {
            unitArmor = 0;
        }
        unit.custom.arm.value = unitArmor;
    }
}

var fractionDamageReduce = function(virtualUnit, virtualPassiveUnit, damageSustained) {
    unit = virtualUnit.unitSelf;
    attacker = virtualPassiveUnit.unitSelf;
    var pow = AbilityCalculator.getPower(attacker, ItemControl.getEquippedWeapon(attacker)) + CompatibleCalculator.getPower(attacker, unit, ItemControl.getEquippedWeapon(attacker));
    //root.log("armor damage = "+ Math.round(pow/ArmorConfig.fractionDamage));
    if (unit.custom.arm != null && unit.custom.arm.value != 0) {
        unitArmor = unit.custom.arm.value - Math.round(pow/ArmorConfig.fractionDamage);
        if (unitArmor < 0) {
            unitArmor = 0;
        }
        unit.custom.arm.value = unitArmor;
    }
}

 var ArmorControl = {
    reduceArmor: null,
    getArm: function(unit) {
        if (unit.custom.arm != null) {
            return unit.custom.arm.value;
        }
        return 0;
    },

    healArm: function(activeUnit, passiveUnit, value) { //blacksmith class function
        if (passiveUnit.custom.arm != null) {
            if (value > 0) {
                unitArmor = passiveUnit.custom.arm.value;
                if (unitArmor < UnitParameter.ARM.getUnitValue(unit)) {
                    unitArmor += value;
                    if (unitArmor > UnitParameter.ARM.getUnitValue(unit)) {
                        unitArmor = UnitParameter.ARM.getUnitValue(unit);
                    }
                }
                unit.custom.arm.value = unitArmor;
            }
        }
        return;
    },

    destroyArm: function(unit) { //magic effect maybe?
        if (unit.custom.arm != null) {
            unit.custom.arm.value = 0;
        }
        return;
    }
 }

// init ArmorControl based on config

// this pattern eliminates mode calls at runtime, but may not be useful
// if garbage collection doesn't remove unused functions
if (ArmorConfig.damageMode == DAMAGE_MODE.FIXED) {
    ArmorControl.reduceArmor = armorFixedReduce
} else if (ArmorConfig.damageMode == DAMAGE_MODE.OVERFLOW) {
    ArmorControl.reduceArmor = overDamageReduce
} else if (ArmorConfig.damageMode == DAMAGE_MODE.FRACTION) {
    ArmorControl.reduceArmor = fractionDamageReduce
}