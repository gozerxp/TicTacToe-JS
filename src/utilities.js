import { alert } from "./alert.js";
import { score } from "./score.js";
import { assets } from "./draw.js";

const get_player_turn = (turn) => { return turn === 1 ? 'X' : 'O'; };

export const game = {

    check_game: function (ctx, array, turn, x, y) {
        switch (this.evluate_game(array, turn, x, y)) {
            case 0: //no winner
                return false;
            case turn: //current turn wins
                score.increase_score(turn);
                alert.draw(ctx, `${get_player_turn(turn)} Wins!`, assets.get_image(turn));
                return true;
            case 2: //cats
                score.increase_score(2);
                alert.draw(ctx, "Cats Game!", assets.cats);
                return true;
            default:
        }

        return false;
    },

    evluate_game: function (array, turn, x_pos, y_pos) {

        const size = array.length;

        //true until they are not
        let scan_x = true, scan_y = true, diag1 = true, diag2 = true, count_empty = false;

        for (let x = 0; x < size; x++) {

            //scan column
            if (array[x_pos][x] !== turn)
                scan_x = false;

            //scan row
            if (array[x][y_pos] !== turn)
                scan_y = false;

            //scan diagonal
            if (array[x][x] !== turn)
                diag1 = false;

            //scan opposite diagonal
            if (array[x][size - 1 - x] !== turn)
                diag2 = false;

            //check for empty squares to help determine cats game
            if (!count_empty) {
                for (let y = 0; y < size; y++) {
                    if (!array[x][y]) {
                        count_empty = true;
                        break;
                    }
                }
            }
        }

        //if any of the flags are still true then the current turn won.
        if (scan_x || scan_y || diag1 || diag2) return turn;

        //if no winner + no empty space found then return 2 for a cats game.
        if (!count_empty) return 2;

        // empty spaces were found, return 0 to continue game.
        return 0;
    },

    reset_array: function (size) {

        let row = [];
        for (let x = 0; x < size; x++) {
            let column = [];
            for (let y = 0; y < size; y++) {
                column.push(0);
            }
            row.push(column);
        }

        return row;
    }

};

