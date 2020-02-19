const WORLD1 = [
    // Wooden wall
    { x: -9, y: 1, z: 9, block: 'planks_oak' },
    { x: -8, y: 1, z: 9, block: 'planks_oak' },
    { x: -7, y: 1, z: 9, block: 'planks_oak' },
    { x: -6, y: 1, z: 9, block: 'planks_oak' },
    { x: -5, y: 1, z: 9, block: 'planks_oak' },
    { x: -9, y: 2, z: 9, block: 'planks_oak' },

    { x: -8, y: 2, z: 9, block: 'planks_oak' },
    { x: -7, y: 2, z: 9, block: 'planks_oak' },
    { x: -6, y: 2, z: 9, block: 'planks_oak' },
    { x: -5, y: 2, z: 9, block: 'planks_oak' },
    { x: -9, y: 3, z: 9, block: 'planks_oak' },

    { x: -8, y: 3, z: 9, block: 'planks_oak' },
    { x: -7, y: 3, z: 9, block: 'planks_oak' },
    { x: -6, y: 3, z: 9, block: 'planks_oak' },
    { x: -5, y: 3, z: 9, block: 'planks_oak' },

    { x: -8, y: 3, z: 9, block: 'planks_oak' },
    { x: -7, y: 3, z: 9, block: 'planks_oak' },
    { x: -6, y: 3, z: 9, block: 'planks_oak' },
    { x: -5, y: 3, z: 9, block: 'planks_oak' },
    { x: -4, y: 3, z: 9, block: 'planks_oak' },
    { x: -3, y: 3, z: 9, block: 'planks_oak' },


    // Doors
    { x: -4, y: 1, z: 9, block: 'door_wood_lower' },
    { x: -4, y: 2, z: 9, block: 'door_wood_upper' },

    { x: -3, y: 1, z: 9, block: 'door_wood_lower' },
    { x: -3, y: 2, z: 9, block: 'door_wood_upper' },


    // Left clay wall
    { x: -10, y: 1, z: 10, block: 'hardened_clay_stained_white' },
    { x: -10, y: 1, z: 9, block: 'hardened_clay_stained_white' },
    { x: -10, y: 1, z: 8, block: 'hardened_clay_stained_white' },
    { x: -10, y: 1, z: 7, block: 'hardened_clay_stained_white' },
    { x: -10, y: 1, z: 6, block: 'hardened_clay_stained_white' },
    { x: -10, y: 1, z: 5, block: 'hardened_clay_stained_white' },
    { x: -10, y: 1, z: 4, block: 'hardened_clay_stained_white' },
    { x: -10, y: 1, z: 3, block: 'hardened_clay_stained_white' },

    { x: -10, y: 2, z: 10, block: 'hardened_clay_stained_white' },
    { x: -10, y: 2, z: 9, block: 'hardened_clay_stained_white' },
    { x: -10, y: 2, z: 8, block: 'hardened_clay_stained_white' },
    { x: -10, y: 2, z: 7, block: 'hardened_clay_stained_white' },
    { x: -10, y: 2, z: 6, block: 'hardened_clay_stained_white' },
    { x: -10, y: 2, z: 5, block: 'hardened_clay_stained_white' },
    { x: -10, y: 2, z: 4, block: 'hardened_clay_stained_white' },
    { x: -10, y: 2, z: 3, block: 'hardened_clay_stained_white' },

    { x: -10, y: 3, z: 10, block: 'hardened_clay_stained_white' },
    { x: -10, y: 3, z: 9, block: 'hardened_clay_stained_white' },
    { x: -10, y: 3, z: 8, block: 'hardened_clay_stained_white' },
    { x: -10, y: 3, z: 7, block: 'hardened_clay_stained_white' },
    { x: -10, y: 3, z: 6, block: 'hardened_clay_stained_white' },
    { x: -10, y: 3, z: 5, block: 'hardened_clay_stained_white' },
    { x: -10, y: 3, z: 4, block: 'hardened_clay_stained_white' },
    { x: -10, y: 3, z: 3, block: 'hardened_clay_stained_white' },

    { x: -10, y: 4, z: 10, block: 'hardened_clay_stained_white' },
    { x: -10, y: 4, z: 9, block: 'hardened_clay_stained_white' },
    { x: -10, y: 4, z: 8, block: 'hardened_clay_stained_white' },
    { x: -10, y: 4, z: 7, block: 'hardened_clay_stained_white' },
    { x: -10, y: 4, z: 6, block: 'hardened_clay_stained_white' },
    { x: -10, y: 4, z: 5, block: 'hardened_clay_stained_white' },
    { x: -10, y: 4, z: 4, block: 'hardened_clay_stained_white' },
    { x: -10, y: 4, z: 3, block: 'hardened_clay_stained_white' },


    // Front clay wall (above wooden wall)
    { x: -9, y: 4, z: 10, block: 'hardened_clay_stained_white' },
    { x: -8, y: 4, z: 10, block: 'hardened_clay_stained_white' },
    { x: -7, y: 4, z: 10, block: 'hardened_clay_stained_white' },
    { x: -6, y: 4, z: 10, block: 'hardened_clay_stained_white' },
    { x: -5, y: 4, z: 10, block: 'hardened_clay_stained_white' },
    { x: -4, y: 4, z: 10, block: 'hardened_clay_stained_white' },
    { x: -3, y: 4, z: 10, block: 'hardened_clay_stained_white' },


    // Front clay wall (black)
    { x: -2, y: 1, z: 11, block: 'hardened_clay_stained_black' },
    { x: -2, y: 2, z: 11, block: 'hardened_clay_stained_black' },
    { x: -2, y: 3, z: 11, block: 'hardened_clay_stained_black' },
    { x: -2, y: 4, z: 11, block: 'hardened_clay_stained_black' },
    { x: -2, y: 5, z: 11, block: 'hardened_clay_stained_black' },
    { x: -2, y: 6, z: 11, block: 'hardened_clay_stained_black' },
    { x: -2, y: 7, z: 11, block: 'hardened_clay_stained_black' },
    { x: -2, y: 8, z: 11, block: 'hardened_clay_stained_black' },

    { x: -2, y: 1, z: 10, block: 'hardened_clay_stained_black' },
    { x: -2, y: 2, z: 10, block: 'hardened_clay_stained_black' },
    { x: -2, y: 3, z: 10, block: 'hardened_clay_stained_black' },
    { x: -2, y: 4, z: 10, block: 'hardened_clay_stained_black' },
    { x: -2, y: 5, z: 10, block: 'hardened_clay_stained_black' },
    { x: -2, y: 6, z: 10, block: 'hardened_clay_stained_black' },
    { x: -2, y: 7, z: 10, block: 'hardened_clay_stained_black' },
    { x: -2, y: 8, z: 10, block: 'hardened_clay_stained_black' },

    { x: 0, y: 1, z: 11, block: 'hardened_clay_stained_black' },
    { x: 0, y: 2, z: 11, block: 'hardened_clay_stained_black' },
    { x: 0, y: 3, z: 11, block: 'hardened_clay_stained_black' },
    { x: 0, y: 4, z: 11, block: 'hardened_clay_stained_black' },
    { x: 0, y: 5, z: 11, block: 'hardened_clay_stained_black' },
    { x: 0, y: 6, z: 11, block: 'hardened_clay_stained_black' },
    { x: 0, y: 7, z: 11, block: 'hardened_clay_stained_black' },
    { x: 0, y: 8, z: 11, block: 'hardened_clay_stained_black' },

    { x: 0, y: 1, z: 10, block: 'hardened_clay_stained_black' },
    { x: 0, y: 2, z: 10, block: 'hardened_clay_stained_black' },
    { x: 0, y: 3, z: 10, block: 'hardened_clay_stained_black' },
    { x: 0, y: 4, z: 10, block: 'hardened_clay_stained_black' },
    { x: 0, y: 5, z: 10, block: 'hardened_clay_stained_black' },
    { x: 0, y: 6, z: 10, block: 'hardened_clay_stained_black' },
    { x: 0, y: 7, z: 10, block: 'hardened_clay_stained_black' },
    { x: 0, y: 8, z: 10, block: 'hardened_clay_stained_black' },

    { x: -1, y: 8, z: 11, block: 'hardened_clay_stained_black' },


    // blabla
    { x: -2, y: 1, z: 3, block: 'hardened_clay_stained_black' },
    { x: -2, y: 2, z: 3, block: 'hardened_clay_stained_black' },
    { x: -2, y: 3, z: 3, block: 'hardened_clay_stained_black' },
    { x: -2, y: 4, z: 3, block: 'hardened_clay_stained_black' },
    { x: -2, y: 5, z: 3, block: 'hardened_clay_stained_black' },
    { x: -2, y: 6, z: 3, block: 'hardened_clay_stained_black' },
    { x: -2, y: 7, z: 3, block: 'hardened_clay_stained_black' },
    { x: -2, y: 8, z: 3, block: 'hardened_clay_stained_black' },

    { x: -2, y: 1, z: 2, block: 'hardened_clay_stained_black' },
    { x: -2, y: 2, z: 2, block: 'hardened_clay_stained_black' },
    { x: -2, y: 3, z: 2, block: 'hardened_clay_stained_black' },
    { x: -2, y: 4, z: 2, block: 'hardened_clay_stained_black' },
    { x: -2, y: 5, z: 2, block: 'hardened_clay_stained_black' },
    { x: -2, y: 6, z: 2, block: 'hardened_clay_stained_black' },
    { x: -2, y: 7, z: 2, block: 'hardened_clay_stained_black' },
    { x: -2, y: 8, z: 2, block: 'hardened_clay_stained_black' },

    { x: 0, y: 1, z: 3, block: 'hardened_clay_stained_black' },
    { x: 0, y: 2, z: 3, block: 'hardened_clay_stained_black' },
    { x: 0, y: 3, z: 3, block: 'hardened_clay_stained_black' },
    { x: 0, y: 4, z: 3, block: 'hardened_clay_stained_black' },
    { x: 0, y: 5, z: 3, block: 'hardened_clay_stained_black' },
    { x: 0, y: 6, z: 3, block: 'hardened_clay_stained_black' },
    { x: 0, y: 7, z: 3, block: 'hardened_clay_stained_black' },
    { x: 0, y: 8, z: 3, block: 'hardened_clay_stained_black' },

    { x: 0, y: 1, z: 2, block: 'hardened_clay_stained_black' },
    { x: 0, y: 2, z: 2, block: 'hardened_clay_stained_black' },
    { x: 0, y: 3, z: 2, block: 'hardened_clay_stained_black' },
    { x: 0, y: 4, z: 2, block: 'hardened_clay_stained_black' },
    { x: 0, y: 5, z: 2, block: 'hardened_clay_stained_black' },
    { x: 0, y: 6, z: 2, block: 'hardened_clay_stained_black' },
    { x: 0, y: 7, z: 2, block: 'hardened_clay_stained_black' },
    { x: 0, y: 8, z: 2, block: 'hardened_clay_stained_black' },

    { x: -1, y: 8, z: 2, block: 'hardened_clay_stained_black' },

    { x: -1, y: 1, z: 2, block: 'glass_black' },
    { x: -1, y: 2, z: 2, block: 'glass_black' },
    { x: -1, y: 3, z: 2, block: 'glass_black' },
    { x: -1, y: 4, z: 2, block: 'glass_black' },
    { x: -1, y: 5, z: 2, block: 'glass_black' },
    { x: -1, y: 6, z: 2, block: 'glass_black' },
    { x: -1, y: 7, z: 2, block: 'glass_black' },


    // Glass (middle of black wall),
    { x: -1, y: 1, z: 11, block: 'glass_black' },
    { x: -1, y: 2, z: 11, block: 'glass_black' },
    { x: -1, y: 3, z: 11, block: 'glass_black' },
    { x: -1, y: 4, z: 11, block: 'glass_black' },
    { x: -1, y: 5, z: 11, block: 'glass_black' },
    { x: -1, y: 6, z: 11, block: 'glass_black' },
    { x: -1, y: 7, z: 11, block: 'glass_black' },

    // Right wall
    { x: 1, y: 1, z: 10, block: 'hardened_clay_stained_white' },
    { x: 2, y: 1, z: 10, block: 'hardened_clay_stained_white' },
    { x: 3, y: 1, z: 10, block: 'hardened_clay_stained_white' },

    { x: 3, y: 2, z: 10, block: 'hardened_clay_stained_white' },
    { x: 3, y: 3, z: 10, block: 'hardened_clay_stained_white' },
    { x: 3, y: 4, z: 10, block: 'hardened_clay_stained_white' },
    { x: 3, y: 5, z: 10, block: 'hardened_clay_stained_white' },
    { x: 3, y: 6, z: 10, block: 'hardened_clay_stained_white' },
    { x: 3, y: 7, z: 10, block: 'hardened_clay_stained_white' },

    { x: 2, y: 7, z: 10, block: 'hardened_clay_stained_white' },
    { x: 1, y: 7, z: 10, block: 'hardened_clay_stained_white' },


    // Top white wall
    { x: -3, y: 7, z: 10, block: 'hardened_clay_stained_white' },
    { x: -4, y: 7, z: 10, block: 'hardened_clay_stained_white' },
    { x: -5, y: 7, z: 10, block: 'hardened_clay_stained_white' },
    { x: -6, y: 7, z: 10, block: 'hardened_clay_stained_white' },
    { x: -7, y: 7, z: 10, block: 'hardened_clay_stained_white' },
    { x: -8, y: 7, z: 10, block: 'hardened_clay_stained_white' },
    { x: -9, y: 7, z: 10, block: 'hardened_clay_stained_white' },
    { x: -10, y: 7, z: 10, block: 'hardened_clay_stained_white' },

    { x: -10, y: 7, z: 9, block: 'hardened_clay_stained_white' },
    { x: -10, y: 7, z: 8, block: 'hardened_clay_stained_white' },
    { x: -10, y: 7, z: 7, block: 'hardened_clay_stained_white' },
    { x: -10, y: 7, z: 6, block: 'hardened_clay_stained_white' },
    { x: -10, y: 7, z: 5, block: 'hardened_clay_stained_white' },
    { x: -10, y: 7, z: 4, block: 'hardened_clay_stained_white' },
    { x: -10, y: 7, z: 3, block: 'hardened_clay_stained_white' },

    { x: -9, y: 7, z: 3, block: 'hardened_clay_stained_white' },
    { x: -8, y: 7, z: 3, block: 'hardened_clay_stained_white' },
    { x: -7, y: 7, z: 3, block: 'hardened_clay_stained_white' },
    { x: -6, y: 7, z: 3, block: 'hardened_clay_stained_white' },
    { x: -5, y: 7, z: 3, block: 'hardened_clay_stained_white' },
    { x: -4, y: 7, z: 3, block: 'hardened_clay_stained_white' },
    { x: -3, y: 7, z: 3, block: 'hardened_clay_stained_white' },


    { x: -3, y: 5, z: 4, block: 'leaves_big_oak_opaque' },
    { x: -4, y: 5, z: 4, block: 'leaves_big_oak_opaque' },
    { x: -5, y: 5, z: 4, block: 'leaves_big_oak_opaque' },
    { x: -6, y: 5, z: 4, block: 'leaves_big_oak_opaque' },
    { x: -7, y: 5, z: 4, block: 'leaves_big_oak_opaque' },
    { x: -8, y: 5, z: 4, block: 'leaves_big_oak_opaque' },
    { x: -9, y: 5, z: 4, block: 'leaves_big_oak_opaque' },

    { x: -9, y: 5, z: 5, block: 'leaves_big_oak_opaque' },
    { x: -9, y: 5, z: 6, block: 'leaves_big_oak_opaque' },
    { x: -9, y: 5, z: 7, block: 'leaves_big_oak_opaque' },
    { x: -9, y: 5, z: 8, block: 'leaves_big_oak_opaque' },
    { x: -9, y: 5, z: 9, block: 'leaves_big_oak_opaque' },

    { x: -3, y: 5, z: 9, block: 'leaves_big_oak_opaque' },
    { x: -4, y: 5, z: 9, block: 'leaves_big_oak_opaque' },
    { x: -5, y: 5, z: 9, block: 'leaves_big_oak_opaque' },
    { x: -6, y: 5, z: 9, block: 'leaves_big_oak_opaque' },
    { x: -7, y: 5, z: 9, block: 'leaves_big_oak_opaque' },
    { x: -8, y: 5, z: 9, block: 'leaves_big_oak_opaque' },
    { x: -9, y: 5, z: 9, block: 'leaves_big_oak_opaque' },


    { x: 1, y: 7, z: 3, block: 'hardened_clay_stained_white' },
    { x: 2, y: 7, z: 3, block: 'hardened_clay_stained_white' },
    { x: 3, y: 7, z: 3, block: 'hardened_clay_stained_white' },

    { x: 3, y: 6, z: 3, block: 'hardened_clay_stained_white' },
    { x: 3, y: 5, z: 3, block: 'hardened_clay_stained_white' },
    { x: 3, y: 4, z: 3, block: 'hardened_clay_stained_white' },
    { x: 3, y: 3, z: 3, block: 'hardened_clay_stained_white' },
    { x: 3, y: 2, z: 3, block: 'hardened_clay_stained_white' },
    { x: 3, y: 1, z: 3, block: 'hardened_clay_stained_white' },

    { x: 2, y: 1, z: 3, block: 'hardened_clay_stained_white' },
    { x: 1, y: 1, z: 3, block: 'hardened_clay_stained_white' },


    { x: 1, y: 2, z: 3, block: 'glass_black' },
    { x: 1, y: 3, z: 3, block: 'glass_black' },
    { x: 1, y: 4, z: 3, block: 'glass_black' },
    { x: 1, y: 5, z: 3, block: 'glass_black' },
    { x: 1, y: 6, z: 3, block: 'glass_black' },

    { x: 2, y: 6, z: 3, block: 'glass_black' },
    { x: 2, y: 5, z: 3, block: 'glass_black' },
    { x: 2, y: 4, z: 3, block: 'glass_black' },
    { x: 2, y: 3, z: 3, block: 'glass_black' },
    { x: 2, y: 2, z: 3, block: 'glass_black' },



    { x: 1, y: 2, z: 10, block: 'glass_black' },
    { x: 1, y: 3, z: 10, block: 'glass_black' },
    { x: 1, y: 4, z: 10, block: 'glass_black' },
    { x: 1, y: 5, z: 10, block: 'glass_black' },
    { x: 1, y: 6, z: 10, block: 'glass_black' },

    { x: 2, y: 6, z: 10, block: 'glass_black' },
    { x: 2, y: 5, z: 10, block: 'glass_black' },
    { x: 2, y: 4, z: 10, block: 'glass_black' },
    { x: 2, y: 3, z: 10, block: 'glass_black' },
    { x: 2, y: 2, z: 10, block: 'glass_black' },



    { x: 0, y: 8, z: 9, block: 'hardened_clay_stained_black' },
    { x: 0, y: 8, z: 8, block: 'hardened_clay_stained_black' },
    { x: 0, y: 8, z: 7, block: 'hardened_clay_stained_black' },
    { x: 0, y: 8, z: 6, block: 'hardened_clay_stained_black' },
    { x: 0, y: 8, z: 5, block: 'hardened_clay_stained_black' },
    { x: 0, y: 8, z: 4, block: 'hardened_clay_stained_black' },

    { x: -2, y: 8, z: 9, block: 'hardened_clay_stained_black' },
    { x: -2, y: 8, z: 8, block: 'hardened_clay_stained_black' },
    { x: -2, y: 8, z: 7, block: 'hardened_clay_stained_black' },
    { x: -2, y: 8, z: 6, block: 'hardened_clay_stained_black' },
    { x: -2, y: 8, z: 5, block: 'hardened_clay_stained_black' },
    { x: -2, y: 8, z: 4, block: 'hardened_clay_stained_black' },

];