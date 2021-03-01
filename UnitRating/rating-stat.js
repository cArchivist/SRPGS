var cp = ParamGroup._configureUnitParameters;
ParamGroup._configureUnitParameters = function(groupArray) {
    cp.call(this, groupArray);
    groupArray.appendObject(RatingParameter);
}

var RatingParameter = defineObject(BaseUnitParameter, {

    getUnitValue: function(unit) {
        var i;
        var value = 0;
        for (i=0; i<ParamGroup.getParameterCount(); i++) {
            if (ParamGroup.isParameterDisplayable(UnitStatusType.NORMAL, i) && ParamGroup.getParameterName(i)!=this.getParameterName()) {
                if(ParamGroup.getParameterName(i) != ParamGroup.getParameterIndexFromType(ParamType.WLV)){
                    value += (ParamGroup.getClassUnitValue(unit, i) * RANKING_MULTIPLIERS[i]);
                }
            }
        }
		return value;
	},

    getParameterName: function() {
		return "Rating";
    },
    
    getMaxValue: function(unit) {
		var i;
        var value = 0;
        for (i=0; i<ParamGroup.getParameterCount(); i++) {
            if (ParamGroup.isParameterDisplayable(UnitStatusType.NORMAL, i) && ParamGroup.getParameterName(i)!=this.getParameterName()) {
                value += ParamGroup.getMaxValue(unit, i);
            }
        }
		return value;
    },
    
    isParameterDisplayable: function(unitStatusType) {
        return unitStatusType==UnitStatusType.UNITMENU;
    }
})