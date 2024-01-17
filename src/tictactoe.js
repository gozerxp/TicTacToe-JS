/* Written by Dan Andersen
Art by Ferris Andersen

2024 Gozerxp Software LLC
http://www.gozerxp.com/
*/

import { alert } from "./alert.js";
import { ai } from "./ai.js";
import { draw } from "./draw.js";
import { game } from "./utilities.js";
import { player } from "./player.js";
import { settings } from "./settings.js";
import { assets } from "./assets.js";

const game_canvas = document.getElementById("game");
export const game_ctx = game_canvas.getContext("2d");

const score_canvas = document.getElementById("score");
export const score_ctx = score_canvas.getContext("2d");

const title_canvas = document.getElementById("title");
const title_ctx = title_canvas.getContext("2d");

//check for touchscreen
const __touch_device__ = window.ontouchstart !== undefined;

const game_font = new FontFace(`${settings.font_face}`, `url(./assets/${settings.font_face}.ttf)`);
let font_ready = false;

let turn,
    game_over,
    game_array;

//draw game once font is loaded
game_font.load().then((font) => {
    document.fonts.add(font);
    font_ready = true;
});

function __delay__(timer) {
    return new Promise(resolve => {
        timer = timer || 2000;
        setTimeout(function () {
            resolve();
        }, timer);
    });
};

async function load_game() {

    while (!font_ready || !assets.ready) {
        await __delay__(1);
    }

    console.log("game ready.");
    
    draw.resize_canvas(game_ctx, score_ctx, title_ctx, game_array);
}

game_reset(game_ctx);
load_game();

/* ***********************************/

if (__touch_device__) {
    game_canvas.ontouchstart = (e) => input(e.pageX, e.pageY, game_ctx, settings.margin, game_array);
    title_canvas.ontouchstart = (e) => player.select_screen.open(e.pageX, e.pageY, title_ctx, game_ctx, game_array, settings.margin);
} else {
    game_canvas.onclick = (e) => input(e.clientX, e.clientY, game_ctx, settings.margin, game_array);
    title_canvas.onclick = (e) => player.select_screen.open(e.clientX, e.clientY, title_ctx, game_ctx, game_array, settings.margin);
}

window.onresize = () => draw.resize_canvas(game_ctx, score_ctx, title_ctx, game_array);

/* ***********************************/

export function game_reset (ctx) {

    turn = 1;
    game_over = false;
    game_array = game.reset_array(settings.grid_size);
    draw.draw_game_board(ctx);
    ai_move(ctx, game_array, turn, settings.margin);

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

function input (x, y, ctx, margin, array) {

    //player select menu is open
    if (player.select_screen.active) {
        player.select_screen.toggle_player_state(ctx, x, y, array, margin);
        return;
    }

    if (game_over) {
        game_reset(ctx);
        alert.active = false;
        return;
    }

    if (alert.active) { 
        alert.active = false;
        draw.draw_game(ctx, array, margin);
        return;
    }

    // don't register a move if not human
    if (!player.get_type(turn)) {
        return;
    }

    //check input bounds
    if (x < margin || x > ctx.canvas.width - margin || 
            y < margin || y > ctx.canvas.height - margin) {
        return;
    }

    const size = array.length;
    const ctx_size = draw.get_ctx_size(ctx, size, margin);
    x = parseInt((x - margin - settings.padding) / ctx_size.x);
    y = parseInt((y - margin - settings.bar_height - settings.padding * 2) / ctx_size.y);  

    //space is already occupied, exit.
    if (array[x][y]) {
        alert.draw(ctx, "Space Occupied.", null);
        return;
    }

    register_move(ctx, margin, array, turn, x, y);

}