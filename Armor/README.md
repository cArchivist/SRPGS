# Armor

Adds a unit parameter representing an armor value as a custom object set at `unit.custom.arm`.  The object has four parameters:

```
{
    value: 3, //current value
    max: 5, // current maximum (upper limit, like HP)
    cap: 20, // highest possible maximum value
    growth: 45 // unit growth rate
}
```  

`value` is added to Def/Res during combat and is reduced as the unit takes damage according to a function determined by configuration modes in `armor-config.js`.  A unit's armor `value` is set to `max` in between maps.

### Possible Conflicts

- overwrites `DamageCalculator.calculateDefense`
- overwrites `NormalAttackOrderBuilder._configureEvaluator`
    - need to experiment with aliasing this one
- includes numerous stat display changes that may be incompatible with StatBar plugin
- rearranges `UnitMenuTopWindow` to make room for armor gauge
- assumes there are no additional custom stats besides itself

### Possible Enhancements

- ~~enable armor growth~~
- separate magic and physical armor values
- `ALWAYSREDUCE` damage mode -- reduce armor whenever hit, not just damaged
- ~~optionally refresh armor at the end of maps / on entering base~~
    - ~~relatedly, store current value and base value in different places for purposes of refreshing at points~~
- enable item + weapon bonuses like other stats
- add optional tradeoffs (e.g., armor reduces attack speed)

### Version History

#### v1.0 
- basic functionality with FIXEDDAMAGE and OVERDAMAGE modes

#### v1.1
- remap damage modes
- move armor from main stat window to upper window (under HP)
- display as `currentValue / maximumValue` in unit window
- include stat gauge
- enable armor refresh on map transition

### File Breakdown

`armor.js` contains all base package overrides and adds an armor reduction event to the flow of the normal attack order (fixed attack order is not modified)
`armor-config.js` contains the mode map and sets the configuration for the plugin.  For conventional use, this is the only file that needs to be modified
`armor-control.js` contains and initializes the `ArmorControl` object which houses the armor-modifying methods (currently just reduction)
`armor-param.js` contains the actual unit parameter prototype