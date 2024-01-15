import { score_ctx, settings } from "./tictactoe.js";
import { assets } from "./draw.js";

export const score = {
    x: 0,
    o: 0,
    cats: 0
};

export function update_scoreboard(ctx) {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const param = {
        height: ctx.canvas.height,
        width: ctx.canvas.height,
        margin: 12,
        font_size: 40
    };

    draw_score_component(ctx, assets.x, score.x, 0, param);
    draw_score_component(ctx, assets.o, score.o, 1, param);
    draw_score_component(ctx, assets.cats, score.cats, 2, param);

}

function draw_score_component(ctx, img, score, position, param) {

    ctx.font = `${param.font_size}px '${settings.font_face}'`;

    const txt_y = ctx.canvas.height / 2 + param.font_size / 2 - param.margin / 2;
    const item_width = param.width + param.margin + ctx.measureText(`${score}`).width;
    const x_pos = (ctx.canvas.width / 3) * position + (ctx.canvas.width / 3) / 2 - item_width / 2;

    ctx.drawImage(img, x_pos, 0, param.width, param.height);

    const offset = -2;
    ctx.fillStyle = "white";
    ctx.fillText(`${score}`, x_pos + param.margin + param.width + offset, txt_y + offset);

    ctx.fillStyle = settings.COLOR;
    ctx.fillText(`${score}`, x_pos + param.margin + param.width, txt_y);

}

export function increase_score(type) {

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

