import { score_ctx, settings } from "./tictactoe.js";
import { assets } from "./draw.js";

export const score = {

    x: 0,
    o: 0,
    cats: 0,

    increase_score: function (type) {

        switch (type) {
            case 1:
                this.x++;
                break;
            case -1:
                this.o++;
                break;
            case 2:
                this.cats++;
                break;
            default:
        }

        this.update_scoreboard(score_ctx);
    },

    update_scoreboard: function (ctx) {

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const param = {
            height: ctx.canvas.height,
            width: ctx.canvas.height,
            margin: 10,
            font_size: 40
        };

        draw_score_component(ctx, assets.x, this.x, 0, param);
        draw_score_component(ctx, assets.o, this.o, 1, param);
        draw_score_component(ctx, assets.cats, this.cats, 2, param);

    }

};

function draw_score_component (ctx, img, score, position, param) {

    ctx.font = `${param.font_size}px '${settings.font_face}'`;

    const txt_y = ctx.canvas.height / 2 + param.font_size / 2 - param.margin / 2;
    const item_width = param.width + param.margin + ctx.measureText(`${score}`).width;
    const x_pos = (ctx.canvas.width / 3) * position + (ctx.canvas.width / 3) / 2 - item_width / 2;

    ctx.drawImage(img, x_pos, 0, param.width, param.height);

    const offset = -1;
    ctx.fillStyle = "white";
    ctx.fillText(`${score}`, x_pos + param.margin + param.width + offset, txt_y + offset);

    ctx.fillStyle = settings.COLOR;
    ctx.fillText(`${score}`, x_pos + param.margin + param.width, txt_y);

}

