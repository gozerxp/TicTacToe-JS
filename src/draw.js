import { alert } from "./alert.js";
import { score } from "./score.js";
import { settings } from "./settings.js";
import { assets } from "./assets.js";
import { select_screen } from "./select_screen.js";

/********************************************************** */

export const draw = {

    get_ctx_size: function (ctx, size, margin) {
        return { x: (ctx.canvas.width - margin * 2) / size,
                y: (ctx.canvas.height - margin * 2) / size };
    },

    draw_game_board: function (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.draw_grid(ctx, settings.grid_size, settings.margin);
    },

    draw_grid: function (ctx, size, margin) {

        ctx.strokeStyle = settings.color;
        ctx.lineWidth = 3;

        const ctx_size = this.get_ctx_size(ctx, size, margin);

        for (let x = 1; x < size; x++) {
            ctx.beginPath();
            ctx.moveTo(margin + x * ctx_size.x, margin);
            ctx.lineTo(margin + x * ctx_size.x, ctx.canvas.height - margin);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(margin, margin + x * ctx_size.y);
            ctx.lineTo(ctx.canvas.width - margin, margin + x * ctx_size.y);
            ctx.stroke();
        }
    },

    draw_game: function (ctx, array, margin) {

        const size = array.length;
        const ctx_size = this.get_ctx_size(ctx, size, margin);
        
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (array[x][y]) {
                    let pos = {x: margin + ctx_size.x * x, y: margin + ctx_size.y * y};
                    ctx.drawImage(assets.get_image(array[x][y]), pos.x, pos.y, ctx_size.x, ctx_size.y);
                }
            }
        }

        this.draw_grid(ctx, size, margin);
    },

    draw_titlebar: function(ctx) {

        const title = settings.title;

        let font_size = 40;
        const offset = -1;
        
        font_size = this.reduce_font(ctx, title, font_size, ctx.canvas.width / 1.75);

        ctx.font = `${font_size}px '${settings.font_face}'`;

        let y = (ctx.canvas.height / 2) + font_size / 4;
        let x = ctx.canvas.width / 2 - (ctx.measureText(title).width / 2);

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = "white";
        ctx.fillText(title, x + offset, y + offset);
    
        ctx.fillStyle = settings.color;
        ctx.fillText(title, x, y);

        select_screen.draw_icon(ctx);

    },

    resize_canvas: function (game_ctx, score_ctx, title_ctx, array) {

        game_ctx.canvas.height = Math.max(window.innerHeight - settings.bar_height * 2 - settings.padding * 4, 
                                            settings.min_height);
        game_ctx.canvas.width = Math.min(Math.max(settings.max_width, game_ctx.canvas.height), 
                                            window.innerWidth - settings.padding * 2);

        score_ctx.canvas.width = game_ctx.canvas.width;
        score_ctx.canvas.height = settings.bar_height;

        title_ctx.canvas.width = game_ctx.canvas.width;
        title_ctx.canvas.height = settings.bar_height;

        this.draw_titlebar(title_ctx);
        
        this.draw_game(game_ctx, array, settings.margin);

        score.update_scoreboard(score_ctx);

        if (select_screen.active) {
            select_screen.draw(game_ctx);
        }

        if (alert.active) {
            alert.draw(game_ctx);
        }
    },

    reduce_font: function (ctx, text, font_size, max_size) {

        ctx.font = `${font_size}px '${settings.font_face}'`;
        while(ctx.measureText(text).width > max_size) {
            font_size--;
            ctx.font = `${font_size}px  '${settings.font_face}'`;
        }
        return font_size;
    }

};