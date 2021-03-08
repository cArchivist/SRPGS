// Add unit parameter for "ARM"

// really, it represents "max armor", in the same way that MHP represents max HP,
// so we need to be able to track the unit's current armor value and max armor value separately

UnitParameter.ARM = defineObject(BaseUnitParameter, {

    getUnitValue: function(unit) {
        if (unit.custom.arm != null) {
            return unit.custom.arm.max;
        }
        return 0;
    },

    // adjusts max and current value according to config
    setUnitValue: function(unit, value) {
        if (unit.custom.arm != null) {
            unit.custom.arm.max = value;
        }
        return;
    },

    getParameterType: function() {
        return ParamType.ARM;
    },

    getParameterName: function() {
		return "Armor";
    },

    getMinValue: function(unit) {
        return 0;
    },

    // represents cap, not current maximum (like max HP)
    getMaxValue: function(unit) {
        if (unit.custom.arm != null) {
            return unit.custom.arm.cap;
        }
        return 0;
    },

    // should work with all items but only verified with units so far
    getGrowthBonus: function(obj) {
        if (obj.custom.arm != null) {
            return obj.custom.arm.growth;
        }
        return 0;
    },

    getSignal: function() {
        return "arm";
    },

    // what if it's directly below hp
    isParameterDisplayable: function(unitStatusType) {
		// Display if it's not the unit menu.
		return unitStatusType !== UnitStatusType.UNITMENU;
	}
})