const game_canvas = document.getElementById("game");
const game_ctx = game_canvas.getContext("2d");

//check for touchscreen
const __touch_device__ = window.ontouchstart !== undefined;

const hash_img = new Image();
hash_img.src = "./assets/hash.png";

const player_X = new Image();
player_X.src = "./assets/x.png";

const player_O = new Image();
player_O.src = "./assets/o.png";

const cats_img = new Image();
cats_img.src = "./assets/cat.png";

const score = {
    x: 0,
    o: 0,
    cats: 0
};

const size = 3;
const margin = 25; //120;
let turn = 1;
let game_over = false;

const get_ctx_size_x = (ctx, size, margin) => {
    return (ctx.canvas.width - margin * 2) / size;
};

const get_ctx_size_y = (ctx, size, margin) => {
    return (ctx.canvas.height - margin * 2) / size;
};

const draw_grid = (ctx, size, margin) => {

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    let ctx_x = get_ctx_size_x(ctx, size, margin);
    let ctx_y = get_ctx_size_y(ctx, size, margin);

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
};

const draw_game_board = () => {

    game_ctx.clearRect(0, 0, game_ctx.canvas.width, game_ctx.canvas.height);

    //game_ctx.drawImage(hash_img, 0, 0, game_ctx.canvas.width, game_ctx.canvas.height);

    draw_grid(game_ctx, size, margin);
    
};

hash_img.onload = () => {
    draw_game_board();
};

const reset = (size) => {
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
};

let game_array = reset(size);

if (__touch_device__)
    game_canvas.ontouchstart = (e) => input(e.pageX, e.pageY, game_ctx, margin, game_array, turn);
else
    game_canvas.onclick = (e) => input(e.clientX, e.clientY, game_ctx, margin, game_array, turn);


const get_player_img = (turn) => { return turn === 1 ? player_X : player_O; }

const get_player_turn = (turn) => { return turn === 1 ? 'X' : 'O'; }

const draw_game = (ctx, array, margin) => {

    let size = array.length;
    let ctx_x = get_ctx_size_x(ctx, size, margin);
    let ctx_y = get_ctx_size_y(ctx, size, margin);

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
};

const input = (x, y, ctx, margin, array, turn) => {

    let size = array.length;

    if (game_over) {
        game_array = reset(size);
        return;
    }

    //check input bounds
    if (x < margin || x > ctx.canvas.width - margin || y < margin || y > ctx.canvas.height - margin)
        return;

    x = parseInt((x - margin) / get_ctx_size_x(ctx, size, margin));
    y = parseInt((y - margin) / get_ctx_size_y(ctx, size, margin));

    //space is already occupied, exit.
    if (array[x][y]) {
        console.log("space occupied.");
        return;
    }

    array[x][y] = turn;

    draw_game(ctx, array, margin);

    switch (evluate_game(array, turn, x, y)) {
        case 0: //no winner
            change_turn();
            break;
        case turn: //current turn wins
            console.log(`${get_player_turn(turn)} Wins!`);
            increase_score(turn);
            game_over = true;
            break;
        case 2: //cats
            console.log("Cats Game!");
            increase_score(2);
            game_over = true;
            break;
        default:
    }

};

const increase_score = (type) => {

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

    console.log(`X: ${score.x}`);
    console.log(`O: ${score.o}`);
    console.log(`Cats: ${score.cats}`);

};

const evluate_game = (array, turn, x_pos, y_pos) => {

    let size = array.length;

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
};

const change_turn = () => {
    turn = -turn;
};