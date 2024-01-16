import { game } from "./utilities.js";

export const ai = {

    best_move: function (array, turn) {

        const size = array.length;
        const MAX_SCORE = 10 ** size;

        let best_score = -Infinity;
        let best_move;

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (!array[x][y]) {

                    array[x][y] = turn;
                    let ai_score = minimax(x, y, array, size, turn, 0, false, MAX_SCORE);
                    array[x][y] = 0;

                    if (ai_score > best_score) {
                        best_score = ai_score;
                        best_move = { x, y };

                        // MAX_SCORE represents 0 depth == winning move.
                        if (best_score === MAX_SCORE) {
                            return best_move;
                        }
                    }
                }
            }
        }

        return best_move;
    }

};

function minimax(x, y, array, size, turn, depth, Maximize, MAX_SCORE) {

    switch (game.evluate_game(array, Maximize ? -turn : turn, x, y)) {
        case turn:
            return MAX_SCORE - depth;
        case -turn:
            return depth - MAX_SCORE;
        case 2:
            return 0;
        default:
    }

    if (Maximize) {

        let best_score = -Infinity;
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (!array[x][y]) {

                    array[x][y] = turn;
                    let score = minimax(x, y, array, size, turn, depth + 1, !Maximize, MAX_SCORE);
                    array[x][y] = 0;

                    best_score = Math.max(score, best_score);
                }
            }
        }

        return best_score;

    } else {

        let best_score = Infinity;
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (!array[x][y]) {

                    array[x][y] = -turn;
                    let score = minimax(x, y, array, size, turn, depth + 1, !Maximize, MAX_SCORE);
                    array[x][y] = 0;

                    best_score = Math.min(score, best_score);
                }
            }
        }

        return best_score;

    }
}
