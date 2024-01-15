import { alert } from "./alert.js";
import { update_scoreboard } from "./score.js";
import { settings, assets } from "./tictactoe.js";

export function get_ctx_size_x(ctx, size, margin) {
    return (ctx.canvas.width - margin * 2) / size;
}

export function get_ctx_size_y(ctx, size, margin) {
    return (ctx.canvas.height - margin * 2) / size;
}

export function draw_game_board(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    draw_grid(ctx, settings.grid_size, settings.margin);
}

export function draw_grid(ctx, size, margin) {

    ctx.strokeStyle = settings.COLOR;
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
        ctx.lineTo(ctx.canvas.width - margin, margin + x * ctx_y);
        ctx.stroke();
    }
}

export function draw_game(ctx, array, margin) {

    const size = array.length;
    const ctx_x = get_ctx_size_x(ctx, size, margin);
    const ctx_y = get_ctx_size_y(ctx, size, margin);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (array[x][y]) {
                let x_pos = margin + ctx_x * x;
                let y_pos = margin + ctx_y * y;
                ctx.drawImage(assets.get_image(array[x][y]), x_pos, y_pos, ctx_x, ctx_y);
            }
        }
    }

    draw_grid(ctx, size, margin);

}

export function resize_canvas(game_ctx, score_ctx, game_array) {
    game_ctx.canvas.width = Math.min(settings.max_width, window.innerWidth);
    game_ctx.canvas.height = Math.min(settings.max_width - settings.score_height - settings.padding,
        window.innerHeight - settings.score_height - settings.padding);

    score_ctx.canvas.width = game_ctx.canvas.width;
    score_ctx.canvas.height = settings.score_height;
    
    draw_game(game_ctx, game_array, settings.margin);
    update_scoreboard(score_ctx);
    if (alert.active) {
        alert.draw(game_ctx);
    }
}

