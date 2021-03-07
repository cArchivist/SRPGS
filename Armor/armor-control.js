/**
 * Controller for key armor methods + reduce modes
 */

var armorFixedReduce = function(virtualUnit, damageSustained) {
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

var overDamageReduce = function(virtualUnit, damageSustained) {
    unit = virtualUnit.unitSelf;
    if (unit.custom.arm != null && unit.custom.arm.value != 0) {
        unitArmor = unit.custom.arm.value - damageSustained;
        if (unitArmor < 0) {
            unitArmor = 0;
        }
        unit.custom.arm.value = unitArmor;
    }
}

 var ArmorControl = {
     reduceArmor: null
 }

// init ArmorControl based on config

// this pattern eliminates mode calls at runtime, but may not be useful
// if garbage collection doesn't remove unused functions
if (ArmorConfig.mode == ARMOR_MODE.FIXEDDAMAGE) {
    ArmorControl.reduceArmor = armorFixedReduce
} else if (ArmorConfig.mode == ARMOR_MODE.OVERDAMAGE) {
    ArmorControl.reduceArmor = overDamageReduce
}