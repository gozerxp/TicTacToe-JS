/* Written by Dan Andersen
Art by Ferris Andersen

2024 Gozerxp Software LLC
http://www.gozerxp.com/
*/

import { alert } from "./alert.js";
import { ai } from "./ai.js";
import { draw } from "./draw.js";
import { game } from "./utilities.js";

const game_canvas = document.getElementById("game");
export const game_ctx = game_canvas.getContext("2d");

const score_canvas = document.getElementById("score");
export const score_ctx = score_canvas.getContext("2d");

const title_canvas = document.getElementById("title");
const title_ctx = title_canvas.getContext("2d");

//check for touchscreen
const __touch_device__ = window.ontouchstart !== undefined;

/* ***********************************/

export const settings = {

    COLOR: "rgb(50, 50, 50)",
    font_face: "Montserrat",
    grid_size: 3,
    margin: 0,
    bar_height: 75,
    padding: 4

};

const player = {

    x: 1, // 1 == human
    o: 0, // 0 == ai

    get_type: function (turn) {
        return turn === 1 ? this.x : this.o;
    }

};

let turn,
    game_over,
    game_array;

game_reset(game_ctx);

const game_font = new FontFace(`${settings.font_face}`, `url(./assets/${settings.font_face}.ttf)`);
//draw game once font is loaded
game_font.load().then((font) => {

    document.fonts.add(font);
    draw.resize_canvas(game_ctx, score_ctx, title_ctx, game_array);

});

if (__touch_device__) {
    game_canvas.ontouchstart = (e) => input(e.pageX, e.pageY, game_ctx, settings.margin);
} else {
    game_canvas.onclick = (e) => input(e.clientX, e.clientY, game_ctx, settings.margin);
}

window.onresize = () => draw.resize_canvas(game_ctx, score_ctx, title_ctx, game_array);

/* ***********************************/

function game_reset (ctx) {

    turn = 1;
    game_over = false;
    game_array = game.reset_array(settings.grid_size);
    draw.draw_game_board(ctx);
    ai_move(game_ctx, game_array, turn, settings.margin);

}

function register_move(ctx, margin, array, turn, x, y) {
    
    array[x][y] = turn;
    draw.draw_game(ctx, array, margin);
    game_over = game.check_game(ctx, array, turn, x, y);
    change_turn();

}

function ai_move(ctx, array, turn, margin) {

    // !player == not human
    if (!player.get_type(turn)) {
        const move = ai.best_move(array, turn);
        register_move(ctx, margin, array, turn, move.x, move.y);
    }
}

function change_turn() { 

    if (game_over) { return; }

    turn = -turn;
    ai_move(game_ctx, game_array, turn, settings.margin);

}

function input (x, y, ctx, margin) {

    if (game_over) {
        game_reset(ctx);
        alert.active = false;
        return;
    }

    if (alert.active) { 
        alert.active = false;
        draw.draw_game(ctx, game_array, margin);
        return;
    }

    //check input bounds
    if (x < margin || x > ctx.canvas.width - margin || 
            y < margin || y > ctx.canvas.height - margin) {
        return;
    }

    const size = game_array.length;
    const ctx_size = draw.get_ctx_size(ctx, size, margin);
    x = parseInt((x - margin) / ctx_size.x);
    y = parseInt((y - margin) / ctx_size.y);

    //space is already occupied, exit.
    if (game_array[x][y]) {
        alert.draw(ctx, "Space Occupied.", null);
        return;
    }

    register_move(ctx, margin, game_array, turn, x, y);

}