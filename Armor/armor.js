/** 
 * Armor Stat
 * 
 * Script by CrimeanArchivist and 2chang
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
 * 1.1 -- added armor hp bar
 * 1.2 -- FRACTION reduction mode added, functions expanded for future versions
 * 1.3 -- weapon shear functionality added, shear skill added
 * 1.4 -- 
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
    var total = 0;
    if (unit.custom.arm != null) {
        total += unit.custom.arm.value;
    }
    return total;
}

// edit top window to include armor beneath HP

UnitMenuTopWindow._arm = 0

UnitMenuTopWindow.changeUnitMenuTarget = function(unit) {
    this._unit = unit;
    this._mhp = ParamBonus.getMhp(unit);
    this._arm = UnitParameter.ARM.getUnitValue(unit); // clean this up
}

UnitMenuTopWindow._drawUnitArmor = function(xBase, yBase) {
    var x = xBase + 303;
    var y = yBase + 60;
    var pic = root.queryUI("unit_gauge");
    var currArm = ArmorControl.getArm(this._unit);
    var armCap = UnitParameter.ARM.getMaxValue(this._unit);
    ContentRenderer.drawArmor(x, y, pic, currArm, this._arm, armCap);
}

// make space for armor in the top window by shifting HP gauge up

UnitMenuTopWindow._drawUnitHp = function(xBase, yBase) {
    var x = xBase + 303;
    var y = yBase + 30;
    var pic = root.queryUI('unit_gauge');
    ContentRenderer.drawUnitHpZoneEx(x, y, this._unit, pic, this._mhp);
}

UnitMenuTopWindow.drawWindowContent = function(x, y) {
    this._drawUnitFace(x, y);
    this._drawUnitName(x, y);
    this._drawUnitClass(x, y);
    this._drawUnitLevel(x, y);
    this._drawUnitHp(x, y);
    this._drawUnitArmor(x, y);
    this._drawFusionIcon(x, y);
}

// Make armor reduce damage

DamageCalculator.calculateDamage = function(active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue) {
    var pow, def, damage;
    
    if (this.isHpMinimum(active, passive, weapon, isCritical, trueHitValue)) {
        return -1;
    }
    
    pow = this.calculateAttackPower(active, passive, weapon, isCritical, activeTotalStatus, trueHitValue);
    def = this.calculateDefense(active, passive, weapon, isCritical, passiveTotalStatus, trueHitValue);
    
    damage = pow - def;
    // armor-based adjustment
    // root.log("pre-adjusted damage: " + damage)
    damage = ArmorControl.adjustDamage(damage, RealBonus.getArm(passive))
    // root.log("after armor: " + damage)
    if (this.isHalveAttack(active, passive, weapon, isCritical, trueHitValue)) {
        if (!this.isHalveAttackBreak(active, passive, weapon, isCritical, trueHitValue)) {
            damage = Math.floor(damage / 2);
        }
    }
    
    if (this.isCritical(active, passive, weapon, isCritical, trueHitValue)) {
        damage = Math.floor(damage * this.getCriticalFactor());
    }
    
    return this.validValue(active, passive, weapon, damage);
}


// Armor reduced when attack is evaluated
AttackEvaluator.ArmorReduction = defineObject(BaseAttackEvaluator, {
    evaluateAttackEntry: function(virtualActive, virtualPassive, attackEntry) {
        if (virtualPassive.hp > 0 && attackEntry.isHit) { //only call for passive or else it damages both
            ArmorControl.reduceArmor(virtualPassive, virtualActive, attackEntry.damagePassive);
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

// add content renderer method

ContentRenderer.drawArmor = function(x, y, pic, arm, maxArm, armCap) {
    var armorText = "ARM";
    var textSlash = '/';
    var dx = [0, 44, 60, 98];
    TextRenderer.drawSignText(x + dx[0], y, armorText);
    NumberRenderer.drawNumberColor(x + dx[1], y, arm, NORMAL_STAT_COLOR, 255);
    TextRenderer.drawSignText(x + dx[2], y, textSlash)
    if (maxArm == armCap) {
        NumberRenderer.drawNumberColor(x + dx[3], y, maxArm, MAX_STAT_COLOR, 255);
    } else {
        NumberRenderer.drawNumberColor(x + dx[3], y, maxArm, NORMAL_STAT_COLOR, 255);
    }
    y += 20;
    this.drawGauge(x, y, arm, maxArm, 1, 110, pic);
}

// max stat as green per Goinza's StatBar plugin, but no bars (yet)

NORMAL_STAT_COLOR = 0; //White
MAX_STAT_COLOR = 2;    //Green

StatusScrollbar.drawScrollContent = function(x, y, object, isSelect, index) {
    var statusEntry = object;
    var n = statusEntry.param;
    var text = statusEntry.type;
    var textui = this.getParentTextUI();
    var font = textui.getFont();
    var length = this._getTextLength();
    
    TextRenderer.drawKeywordText(x, y, text, length, ColorValue.KEYWORD, font);
    x += this._getNumberSpace();
    
    statusEntry.textui = textui;
    if (statusEntry.isRenderable) {
        ParamGroup.drawUnitParameter(x, y, statusEntry, isSelect, statusEntry.index);
    }
    else {
        if (n < 0) {
            n = 0;
        }
        var max = ParamGroup.getMaxValue(this._unit, statusEntry.index);
        if (n==max) {
            NumberRenderer.drawNumberColor(x, y, n, MAX_STAT_COLOR, 255);
        } else {
            NumberRenderer.drawNumberColor(x, y, n, NORMAL_STAT_COLOR, 255);
        }
    }
    
    if (statusEntry.bonus !== 0) {
        this._drawBonus(x, y, statusEntry);
    }
}

UnitStatusScrollbar._createStatusEntry = function(unit, index, weapon) {
    var statusEntry = StructureBuilder.buildStatusEntry();
    
    statusEntry.type = ParamGroup.getParameterName(index);
    statusEntry.param = ParamGroup.getLastValue(unit, index, weapon);
    statusEntry.bonus = 0;
    statusEntry.index = index;
    statusEntry.isRenderable = ParamGroup.isParameterRenderable(index);
    
    return statusEntry;
}

StatusScrollbar.setStatusFromUnit = function(unit) {
    var i, j;
    var count = ParamGroup.getParameterCount();
    var weapon = ItemControl.getEquippedWeapon(unit);
    
    this._statusArray = [];
    
    for (i = 0, j = 0; i < count; i++) {
        if (this._isParameterDisplayable(i)) {
            this._statusArray[j++] = this._createStatusEntry(unit, i, weapon);
        }
    }
    
    this.setScrollFormation(this.getDefaultCol(), this.getDefaultRow());
    this.setObjectArray(this._statusArray);
    this._unit = unit;
}

// refresh armor on new map (if config set)
UnitProvider._resetArmor = function(unit) {
    if (unit.custom.arm != null) {
        unit.custom.arm.value = UnitParameter.ARM.getUnitValue(unit);
    }
}

// if healmode is off, leave this alone (unnecessary remap)
if (ArmorConfig.healMode == HEAL_MODE.MAP_END) {
    recoveryAlias = UnitProvider.recoveryUnit;
    UnitProvider.recoveryUnit = function(unit) {
        recoveryAlias.call(this, unit)
        this._resetArmor(unit);
    }
}
