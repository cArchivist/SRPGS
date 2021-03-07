# Armor

Adds a unit parameter representing an armor value as a custom parameter set at `unit.custom.arm.value`.  This value is added to Def/Res during combat and is reduced as the unit takes damage according to a function determined by configuration modes in `armor-config.js`.  Armor is not replenished by any means (once it's broken, it's gone).

A unit's base stat for armor is 

### Possible Conflicts

- overwrites `DamageCalculator.calculateDefense`
- overwrites `NormalAttackOrderBuilder._configureEvaluator`
- assumes there are no additional custom stats besides itself

### Possible Enhancements

- enable armor growth
- separate magic and physical armor values
- `ALWAYSREDUCE` reduce armor mode -- reduce armor whenever hit, not just damaged
- optionally refresh armor at the end of maps / on entering base
    - relatedly, store current value and base value in different places for purposes of refreshing at points
- enable item + weapon bonuses like other stats
- add optional tradeoffs (e.g., armor reduces attack speed)

### Version History

v1.0 - basic functionality with FIXEDDAMAGE and OVERDAMAGE modes

### File Breakdown

`armor.js` contains all base package overrides, the unit parameter type for armor, and adds an armor reduction event to the flow of the normal attack order (fixed attack order is not modified)
`armor-config.js` contains the mode map and sets the configuration for the plugin.  For conventional use, this is the only file that needs to be modified
`armor-control.js` contains and initializes the `ArmorControl` object which houses the armor-modifying methods (currently just reduction)