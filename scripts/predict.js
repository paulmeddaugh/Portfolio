import { VELOCITY_FORWARD, VELOCITY_REVERSE, DRIVE_RATE } from './index.js';

/** The almost exact consistent average Predict if off by on my laptop, I believe because the
 * car is still travelling at velocity when not incrementing, which Predict doesn't account for. */
const PREDICT_FIX = 1 / .73;

export class Predict {
    velocity;
    distance;
    time;
    averageFPS;

    /**
     * Creates an object that holds values for predicted car movement. If no parameters are assigned,
     * initializes values to 0.
     * 
     * @param {*} velocity The starting velocity of the prediction.
     * @param {*} distance The starting distance of the prediction.
     * @param {*} time The starting time of the prediction.
     */
    constructor(velocity = 0, distance = 0, time = 0) {
        this.setValues(velocity, distance, time);
    }

    /**
     * Sets all the values of the {@link Predict} object.
     * 
     * @param {*} velocity The new velocity of the prediction.
     * @param {*} distance The new distance of the prediction.
     * @param {*} time The new time of the prediction.
     */
    setValues(velocity, distance, time) {
        this.velocity = velocity;
        this.distance = distance;
        this.time = time;
    }

    /**
     * Predicts next velocity, distance, and running prediction time PRIOR to an intervaled 'ArrowDown' 
     * decrement to velocity when holding the 'down' arrow key. Essentially predicts the future properties of 
     * the car when holding the 'ArrowDown' key with about 95% accuracy on my laptop.
     */
    reverse() {
        let vel = this.velocity + VELOCITY_REVERSE; // stores calculation of velocity
        this.setValues(
            vel,
            this.distance + vel * PREDICT_FIX, 
            this.time + DRIVE_RATE
        );
    }

    /**
     * Predicts the next velocity, distance, and running prediction time to an intervaled 'ArrowUp' 
     * increment to velocity when holding the 'up' arrow key. Essentially predicts the future properties of 
     * the car when holding the 'ArrowUp' key with about 95% accuracy on my laptop.
     */
    forward() {
        let vel = this.velocity + VELOCITY_FORWARD; // stores calculation of velocity
        this.setValues(
            vel,
            this.distance + vel * PREDICT_FIX,
            this.time + DRIVE_RATE
        );
    }
}