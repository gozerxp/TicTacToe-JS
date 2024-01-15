/* Written by Dan Andersen
Art by Ferris Andersen

Gozerxp Software
http://www.gozerxp.com/
*/

import { alert } from "./alert.js";
import { ai_move } from "./ai.js";
import { get_ctx_size_x, get_ctx_size_y } from "./draw.js";
import { draw_game, draw_game_board, resize_canvas } from "./draw.js";
import { reset_array, check_game } from "./utilities.js";

const game_canvas = document.getElementById("game");
export const game_ctx = game_canvas.getContext("2d");

const score_canvas = document.getElementById("score");
export const score_ctx = score_canvas.getContext("2d");

//check for touchscreen
const __touch_device__ = window.ontouchstart !== undefined;

export const assets = {
    x: new Image(),
    o: new Image(),
    cats: new Image(),
    get_image: function(turn) {
        return turn === 1 ? this.x : this.o;
    }
};

assets.x.src = "./assets/x.png";
assets.o.src = "./assets/o.png";
assets.cats.src = "./assets/cat.png";

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

export const game = {
    turn: 1,
    game_over: false,
    game_array: reset_array(settings.grid_size),
    game_reset: function(ctx) {
        this.turn = 1;
        this.game_over = false;
        this.game_array = reset_array(settings.grid_size);
        draw_game_board(ctx);
    }
};

const game_font = new FontFace(`${settings.font_face}`, `url(./assets/${settings.font_face}.ttf)`);
//draw game once font is loaded
game_font.load().then((font) => {
    document.fonts.add(font);
    resize_canvas(game_ctx, score_ctx, game.game_array);
});

if (__touch_device__) {
    game_canvas.ontouchstart = (e) => input(e.pageX, e.pageY, game_ctx, settings.margin, game);
} else {
    game_canvas.onclick = (e) => input(e.clientX, e.clientY, game_ctx, settings.margin, game);
}

window.onresize = () => resize_canvas(game_ctx, score_ctx, game.game_array);

export function change_turn() { 

    game.turn = -game.turn;

    if (player.get_type(game.turn) === 1) {
        return;
    }

    const move = ai_move(game.game_array, game.turn)

    game.game_array[move.x][move.y] = game.turn;
    draw_game(game_ctx, game.game_array, settings.margin);
    game.game_over = check_game(game_ctx, game.game_array, game.turn, move.x, move.y);

}

function input (x, y, ctx, margin, game) {

    const size = game.game_array.length;

    if (game.game_over) {
        alert.active = false;
        game.game_reset(ctx);
        return;
    }

    if (alert.active) {
        alert.active = false;
        draw_game (ctx, game.game_array, margin);
        return;
    }

    //check input bounds
    if (x < margin || x > ctx.canvas.width - margin ||
            y < margin || y > ctx.canvas.height - margin) {
        return;
    }

    x = parseInt((x - margin) / get_ctx_size_x(ctx, size, margin));
    y = parseInt((y - margin) / get_ctx_size_y(ctx, size, margin));

    //space is already occupied, exit.
    if (game.game_array[x][y]) {
        alert.draw(ctx, "Space Occupied.");
        return;
    }

    game.game_array[x][y] = game.turn;

    draw_game(ctx, game.game_array, margin);
    game.game_over = check_game(ctx, game.game_array, game.turn, x, y);

}


