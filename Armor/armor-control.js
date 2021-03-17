/**
 * Controller for key armor methods + reduce modes
 */



var armorFixedReduce = function(virtualUnit, virtualPassiveUnit, damageSustained) {
    unit = virtualUnit.unitSelf;
    var atkweapon = ItemControl.getEquippedWeapon(virtualPassiveUnit.unitSelf);
    var atkskill = SkillControl.getPossessionCustomSkill(virtualPassiveUnit.unitSelf, "Shear");
    if (unit.custom.arm != null && unit.custom.arm.value != 0) {
        var unitArmor, v;
        if(atkweapon.custom.arm != null && atkweapon.custom.arm.shear >= 0) {
            if(atkskill != null && atkskill.custom.arm != null && atkskill.custom.arm.shearmul > 0) {
                v = (ArmorConfig.fixedDamage + atkweapon.custom.arm.shear) * atkskill.custom.arm.shearmul;
            }
            else {
                v = ArmorConfig.fixedDamage + atkweapon.custom.arm.shear;
            }
            unitArmor = unit.custom.arm.value - v;
            handleReduction(unitArmor);
        }
        else {
            if(!ArmorConfig.shearOnly) {
                if(atkskill != null && atkskill.custom.arm != null && atkskill.custom.arm.shearmul > 0) {
                    v = ArmorConfig.fixedDamage * atkskill.custom.arm.shearmul;
                }
                else {
                    v = ArmorConfig.fixedDamage;
                }
                unitArmor = unit.custom.arm.value - ArmorConfig.fixedDamage;
                handleReduction(unitArmor);
            }     
        } 
    }
}

var overDamageReduce = function(virtualUnit, virtualPassiveUnit, damageSustained) {
    unit = virtualUnit.unitSelf;
    var atkweapon = ItemControl.getEquippedWeapon(virtualPassiveUnit.unitSelf);
    var atkskill = SkillControl.getPossessionCustomSkill(virtualPassiveUnit.unitSelf, "Shear");
    if (unit.custom.arm != null && unit.custom.arm.value != 0) {
        var unitArmor, v;
        if(atkweapon.custom.arm != null && atkweapon.custom.arm.shear >= 0) {
            if(atkskill != null && atkskill.custom.arm != null && atkskill.custom.arm.shearmul > 0) {
                v = (damageSustained + atkweapon.custom.arm.shear) * atkskill.custom.arm.shearmul;
            }
            else {
                v = damageSustained + atkweapon.custom.arm.shear;
            }
            unitArmor = unit.custom.arm.value - v;
            handleReduction(unitArmor);
        }
        else {
            if(!ArmorConfig.shearOnly) {
                if(atkskill != null && atkskill.custom.arm != null && atkskill.custom.arm.shearmul > 0) {
                    v = (damageSustained) * atkskill.custom.arm.shearmul;
                }
                else {
                    v = damageSustained;
                }
                unitArmor = unit.custom.arm.value - v;
                handleReduction(unitArmor);
            }  
        }
    }
}

var fractionDamageReduce = function(virtualUnit, virtualPassiveUnit, damageSustained) {
    unit = virtualUnit.unitSelf;
    var attacker = virtualPassiveUnit.unitSelf;
    var atkweapon = ItemControl.getEquippedWeapon(attacker);
    var atkskill = SkillControl.getPossessionCustomSkill(attacker, "Shear");
    var pow = AbilityCalculator.getPower(attacker, atkweapon) + CompatibleCalculator.getPower(attacker, unit, atkweapon);
    if (unit.custom.arm != null && unit.custom.arm.value != 0) {
        var unitArmor, v;
        if(atkweapon.custom.arm != null && atkweapon.custom.arm.shear > 0) {
            if(atkskill != null && atkskill.custom.arm != null && atkskill.custom.arm.shearmul > 0) {
                v = (Math.round(pow/ArmorConfig.fractionDamage) + atkweapon.custom.arm.shear) * atkskill.custom.arm.shearmul;
            }
            else {
                v = Math.round(pow/ArmorConfig.fractionDamage) + atkweapon.custom.arm.shear;
            }
            unitArmor = unit.custom.arm.value - v;
            handleReduction(unitArmor);
        } 
        else {
            if(!ArmorConfig.shearOnly) {
                if(atkskill != null && atkskill.custom.arm != null && atkskill.custom.arm.shearmul > 0) {
                    v = (Math.round(pow/ArmorConfig.fractionDamage)) * atkskill.custom.arm.shearmul;
                }
                else {
                    v = Math.round(pow/ArmorConfig.fractionDamage);
                }
                unitArmor = unit.custom.arm.value - v;
                handleReduction(unitArmor);
            }
        }
    }
}

var handleReduction = function(unitArmor){ //just to clean it up a bit
    if (unitArmor < 0) {
        unitArmor = 0;
    }
    unit.custom.arm.value = unitArmor;
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
            root.log("healArm called");
            if (value > 0) {
                unitArmor = passiveUnit.custom.arm.value;
                if (unitArmor < UnitParameter.ARM.getUnitValue(passiveUnit)) {
                    unitArmor += value;
                    if (unitArmor > UnitParameter.ARM.getUnitValue(passiveUnit)) {
                        unitArmor = UnitParameter.ARM.getUnitValue(passiveUnit);
                    }
                }
                passiveUnit.custom.arm.value = unitArmor;
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