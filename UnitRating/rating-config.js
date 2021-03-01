// Rating Configuration add-in by CrimeanArchivist

/**
 * This file provides configuration options for how stats contribute to the total "rating" of a unit.
 * The RANKING_MULTIPLIERS object determines the proportional amount each stat.  The indices
 * in the object correspond to the order of the stats in the group array, so this can be
 * expanded to include custom stat arrangements by modifying the size of the list.
 * 
 * If a unit or class should ignore a stat for rankings, add an exclusion in their custom data.
 */

var RANKING_MULTIPLIERS = [
    0, // hp
    1, // pow
    1, // mag
    1, // ski
    1, // spd
    0, // luk
    1, // def
    1, // mdf
    0 // mov
]