const game_canvas = document.getElementById("game");
const game_ctx = game_canvas.getContext("2d");

const score_canvas = document.getElementById("score");
const score_ctx = score_canvas.getContext("2d");

//check for touchscreen
const __touch_device__ = window.ontouchstart !== undefined;

const assets = {
    x: new Image(),
    o: new Image(),
    cats: new Image()
};

assets.x.src = "./assets/x.png";
assets.o.src = "./assets/o.png";
assets.cats.src = "./assets/cat.png";

//***********************************

const score = {
    x: 0,
    o: 0,
    cats: 0
};

const COLOR = "rgb(60, 60, 60)";

const grid_size = 3;
const margin = 0;
let turn = 1;
let game_over = false;
let game_array = reset(grid_size);

assets.cats.onload = () => {
    update_scoreboard(score_ctx);
    //ai_move();
};

if (__touch_device__) {
    game_canvas.ontouchstart = (e) => input(e.pageX, e.pageY, game_ctx, margin, game_array, turn);
} else {
    game_canvas.onclick = (e) => input(e.clientX, e.clientY, game_ctx, margin, game_array, turn);
}

const get_player_img = (turn) => { return turn === 1 ? assets.x : assets.o; };

const get_player_turn = (turn) => { return turn === 1 ? 'X' : 'O'; };

const change_turn = () => { 

    turn = -turn;

    if (turn === -1) {
        ai_move(game_ctx, game_array, turn);
    }
};

function get_ctx_size_x (ctx, size, margin) {
    return (ctx.canvas.width - margin * 2) / size;
}

function get_ctx_size_y (ctx, size, margin) {
    return (ctx.canvas.height - margin * 2) / size;
}

function draw_game_board() {  
    game_ctx.clearRect(0, 0, game_ctx.canvas.width, game_ctx.canvas.height);
    draw_grid(game_ctx, grid_size, margin);   
}

function draw_game (ctx, array, margin) {

    const size = array.length;
    const ctx_x = get_ctx_size_x(ctx, size, margin);
    const ctx_y = get_ctx_size_y(ctx, size, margin);

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (array[x][y]) {                        
                let x_pos = margin + ctx_x * x;
                let y_pos = margin + ctx_y * y;
                ctx.drawImage(get_player_img(array[x][y]), x_pos, y_pos, ctx_x, ctx_y);
            }
        }
    }

    draw_grid(ctx, size, margin);

}

function input (x, y, ctx, margin, array, turn) {

    const size = array.length;

    if (game_over) {
        game_array = reset(size);
        alert.active = false;
        return;
    }

    if (alert.active) {
        alert.active = false;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        draw_game (ctx, array, margin);
        return;
    }

    //check input bounds
    if (x < margin || x > ctx.canvas.width - margin || y < margin || y > ctx.canvas.height - margin)
        return;

    x = parseInt((x - margin) / get_ctx_size_x(ctx, size, margin));
    y = parseInt((y - margin) / get_ctx_size_y(ctx, size, margin));

    //space is already occupied, exit.
    if (array[x][y]) {
        alert.pop("Space Occupied.", game_ctx);
        return;
    }

    array[x][y] = turn;

    draw_game(ctx, array, margin);
    check_game(array, turn, x, y);
}

function check_game(array, turn, x, y) {
    switch (evluate_game(array, turn, x, y)) {
        case 0: //no winner
            change_turn();
            break;
        case turn: //current turn wins
            increase_score(turn);
            game_over = true;
            alert.pop(`${get_player_turn(turn)} Wins!`, game_ctx);
            break;
        case 2: //cats
            increase_score(2);
            game_over = true;
            alert.pop("Cats Game!", game_ctx);
            break;
        default:
    }
}

function increase_score (type) {

    switch (type) {
        case 1:
            score.x++;
            break;
        case -1: 
            score.o++;
            break;
        case 2:
            score.cats++;
            break;
        default:
    }

    update_scoreboard(score_ctx);

}

function update_scoreboard (ctx) {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const parameters = {
        height: ctx.canvas.height,
        width: ctx.canvas.height,
        margin: 15,
        font_size: 36
    };

    draw_score_component(ctx, assets.x, score.x, 0, parameters);
    draw_score_component(ctx, assets.o, score.o, 1, parameters);
    draw_score_component(ctx, assets.cats, score.cats, 2, parameters);

}

function draw_score_component (ctx, img, score, position, parameters) {

    ctx.font = `${parameters.font_size}px 'Press Start 2P'`;
    
    const txt_y = ctx.canvas.height / 2 + parameters.font_size / 2;
    const item_width = parameters.width + parameters.margin + ctx.measureText(`${score}`).width;
    const x_pos = (ctx.canvas.width / 3) * position + (ctx.canvas.width / 3) / 2 - item_width / 2;

    ctx.drawImage(img, x_pos, 0, parameters.width, parameters.height);

    const offset = -2; 
    ctx.fillStyle = "white";
    ctx.fillText(`${score}`, x_pos + parameters.margin + parameters.width + offset, txt_y + offset);

    ctx.fillStyle = COLOR;
    ctx.fillText(`${score}`, x_pos + parameters.margin + parameters.width, txt_y);    

}

function evluate_game (array, turn, x_pos, y_pos) {

    const size = array.length;

    //true until they are not
    let scan_x = true, 
        scan_y = true, 
        diag1 = true, 
        diag2 = true,
        count_empty = false;

    for (let x = 0; x < size; x++) {

        //scan column
        if (array[x_pos][x] != turn)
            scan_x = false;

        //scan row
        if (array[x][y_pos] != turn)
            scan_y = false;

        //scan diagonal
        if (array[x][x] != turn)
            diag1 = false;
        
        //scan opposite diagonal
        if (array[x][size - 1 - x] != turn)
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

}

function reset (size) {

    let row = [];
    for (let x = 0; x < size; x++) {
        let column = [];
        for (let y = 0; y < size; y++){
            column.push(0);
        }
        row.push(column);
    }

    draw_game_board();
    turn = 1;
    game_over = false;
    console.clear();

    return row;
}

function draw_grid (ctx, size, margin) {

    ctx.strokeStyle = COLOR;
    ctx.lineWidth = 3;

    const ctx_x = get_ctx_size_x(ctx, size, margin);
    const ctx_y = get_ctx_size_y(ctx, size, margin);

    for (let x = 1; x < size; x++) {
        ctx.beginPath();
        ctx.moveTo(margin + x * ctx_x, margin);
        ctx.lineTo(margin + x * ctx_x, ctx.canvas.height - margin);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(margin, margin + x * ctx_y);
        ctx.lineTo(ctx.canvas.width -  margin, margin + x * ctx_y);
        ctx.stroke();
    }
}

const alert = {
    active: false,
    pop: function(txt, ctx) {
        
        this.active = true;
        //console.log(txt);

        const margin = 30;
        const font_size = 22;

        ctx.font = `${font_size}px 'Press Start 2P'`;

        const w = ctx.measureText(`${txt}`).width;
        const h = font_size + margin * 2.5;

        const size = [w + margin * 2, h];
        const position = [ctx.canvas.width / 2 - (size[0] / 2),
                            ctx.canvas.height / 2 - (size[1] / 2)];

        const txt_position = [ctx.canvas.width / 2 - w / 2, 
                            ctx.canvas.height / 2 + font_size / 2];

        ctx.globalAlpha = 0.9;
        ctx.fillStyle = COLOR;
        ctx.beginPath();
        ctx.roundRect(...position, ...size, 10);
        ctx.fill();
        
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        
        ctx.fillText(`${txt}`, ...txt_position);  

    }
};

function ai_move(ctx, array, turn) {
    const move = best_move(array, turn);
    array[move.x][move.y] = turn;
    draw_game(ctx, array, margin);
    check_game(array, turn, move.x, move.y);
}

function best_move(array, turn) {

    const size = array.length;
    const BEST_SCORE = 10 ** size;

    let best_score = -Infinity;
    let best_move;

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (!array[x][y]) {

                array[x][y] = turn;                    
                let ai_score = mini_max(x, y, array, size, turn, 0, false, BEST_SCORE);
                array[x][y] = 0;

                if (ai_score > best_score) {
                    best_score = ai_score;
                    best_move = { x, y };

                    if (best_score === BEST_SCORE) {
                        return best_move;
                    }
                }
            }
        }

    }

    return best_move;
}

function mini_max(x, y, array, size, turn, depth, isMax, BEST_SCORE) {

    switch (evluate_game (array, isMax ? -turn : turn, x, y)) {
        case turn:
            return BEST_SCORE - depth;
        case -turn:
            return depth - BEST_SCORE;
        case 2:
            return 0;
        default:
    }
 
    if (isMax) {

        let best_score = -Infinity;
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (!array[x][y]) {

                    array[x][y] = turn;
                    let score = mini_max(x, y, array, size, turn, depth + 1, !isMax, BEST_SCORE);
                    array[x][y] = 0;

                    best_score = Math.max(score, best_score)
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
                    let score = mini_max(x, y, array, size, turn, depth + 1, !isMax, BEST_SCORE);
                    array[x][y] = 0;

                    best_score = Math.min(score, best_score);
                }
            }
        }

        return best_score;
        
    }
}