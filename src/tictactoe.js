/* Written by Dan Andersen
Art by Ferris Andersen

Gozerxp Software
http://www.gozerxp.com/
*/

import { alert } from "./alert.js";
import { best_move_ai } from "./ai.js";
import { get_ctx_size } from "./draw.js";
import { draw_game, draw_game_board, resize_canvas } from "./draw.js";
import { reset_array, check_game } from "./utilities.js";

const game_canvas = document.getElementById("game");
export const game_ctx = game_canvas.getContext("2d");

const score_canvas = document.getElementById("score");
export const score_ctx = score_canvas.getContext("2d");

//check for touchscreen
const __touch_device__ = window.ontouchstart !== undefined;

//***********************************

export const settings = {
    COLOR: "rgb(60, 60, 60)",
    font_face: "Montserrat-Medium",
    grid_size: 3,
    margin: 0,
    max_width: 720,
    score_height: 60,
    padding: 4
};

export const player = {
    x: 1, // 1 == human
    o: 0, // 0 == ai
    get_type: function(turn) {
        return turn === 1 ? this.x : this.o;
    }
};

let turn,
    game_over,
    game_array;

function game_reset (ctx) {
    turn = 1;
    game_over = false;
    game_array = reset_array(settings.grid_size);
    draw_game_board(ctx);
    ai_move(game_ctx, game_array, turn, settings.margin);
}

game_reset(game_ctx);

const game_font = new FontFace(`${settings.font_face}`, `url(./assets/${settings.font_face}.ttf)`);
//draw game once font is loaded
game_font.load().then((font) => {
    document.fonts.add(font);
    resize_canvas(game_ctx, score_ctx, game_array);
});

if (__touch_device__) {
    game_canvas.ontouchstart = (e) => input(e.pageX, e.pageY, game_ctx, settings.margin);
} else {
    game_canvas.onclick = (e) => input(e.clientX, e.clientY, game_ctx, settings.margin);
}

window.onresize = () => resize_canvas(game_ctx, score_ctx, game_array);

function change_turn() { 

    if (game_over) {
        return;
    }

    turn = -turn;

    
        ai_move(game_ctx, game_array, turn, settings.margin);


}

function ai_move(ctx, array, turn, margin) {

    if (!player.get_type(turn)) {
        const move = best_move_ai(array, turn);
        array[move.x][move.y] = turn;
        draw_game(ctx, array, margin);
        game_over = check_game(ctx, array, turn, move.x, move.y);
        change_turn();
    }
}

function input (x, y, ctx, margin) {

    if (game_over) {
        game_reset(ctx);
        alert.active = false;
        return;
    }

    if (alert.active) { 
        alert.active = false;
        draw_game(ctx, game_array, margin);
        return;
    }

    //check input bounds
    if (x < margin || x > ctx.canvas.width - margin || y < margin || y > ctx.canvas.height - margin) {
        return;
    }

    const size = game_array.length;
    const ctx_size = get_ctx_size(ctx, size, margin);
    x = parseInt((x - margin) / ctx_size.x);
    y = parseInt((y - margin) / ctx_size.y);

    //space is already occupied, exit.
    if (game_array[x][y]) {
        alert.draw(ctx, "Space Occupied.", null);
        return;
    }

    game_array[x][y] = turn;

    draw_game(ctx, game_array, margin);
    game_over = check_game(ctx, game_array, turn, x, y);
    change_turn();

}


