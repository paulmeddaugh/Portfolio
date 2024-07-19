
const GRID_ROW_SIZE = 2, GRID_COLUMN_SIZE = 2;

const WALL_THICKNESS = 20;

/**
 * Creates a wall on a specified side of an element
 * 
 * @param {string} project the element of which to add a wall on a border.
 * @param {string} side a string of the compass direction to place the wall (i.e. "south")
 */
 export function createWall(project, side) {

    if (project == null) throw new TypeError("\'project\' must be an element.");

    if (typeof side != 'string') {
        throw new TypeError("\'side\' must be an explicit compass direction: north, south, east, west.")
    } else {
        side = String(side).toLowerCase();
    }

    let wall = document.createElement('div');
    wall.style.position = 'absolute';
    wall.style.height = (side == 'north' || side == 'south') ? `${WALL_THICKNESS}px` : '100%';
    wall.style.width = (side == 'east' || side == 'west') ? `${WALL_THICKNESS}px` : '100%';
    switch (side) {
        case 'north': 
            wall.style.top = '0%'; break;
        case 'south':
            wall.style.bottom = '0%'; break;
        case 'east': 
            wall.style.right = '0%'; break;
        case 'west':
            wall.style.left = '0%'; break;
    }
    wall.style.boxSizing = 'border-box';
    wall.classList.add('wall');

    project.appendChild(wall);
}

/**
 * Checks if the car has hit any of the walls on the map.
 * 
 * @returns If colliding with a wall, returns the wall that the car has collided with. Otherwise, 
 * returns false.
 */
 export function hitAWall() {
    for (let wall of document.getElementsByClassName('wall')) {
        let bounds = getElementBounds(wall);
        if (carWithin(bounds)) {
            return wall;
        }
    }

    return false;
}

export function createProjectFacingWalls() {
    let grid = document.getElementsByClassName('projectGrid')[0];
    for (let i = 0; i < grid.children.length; i++) {
        if (i - 1 >= 0 && i - 1 != GRID_ROW_SIZE - 1) createWall(grid.children[i], 'west');
        if (i + 1 != GRID_ROW_SIZE && grid.children[i + 1]) createWall(grid.children[i], 'east');
        if (i / GRID_COLUMN_SIZE >= 1) createWall(grid.children[i], 'north');
        if (grid.children[i * GRID_COLUMN_SIZE]) createWall(grid.children[i], 'south');
    }
}