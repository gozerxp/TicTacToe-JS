import { settings } from "./tictactoe.js";

export const alert = {
    active: false,
    text: '',
    draw: function (ctx, txt = this.text, img = null) {

        this.active = true;
        this.text = txt;

        const margin = 30;
        const font_size = 32;
        const max_img_size = 150;

        ctx.font = `${font_size}px '${settings.font_face}'`;

        const w = ctx.measureText(`${txt}`).width;
        let h = font_size;
        h += img !== null ? Math.min(w, max_img_size) : 0;

        const size = [w + margin * 2, h + margin * 1.25];
        const position = [ctx.canvas.width / 2 - (size[0] / 2),
        ctx.canvas.height / 2 - (size[1] / 2) + margin / 4];

        h = img !== null ? Math.min(w, max_img_size) : 0;

        const txt_position = [ctx.canvas.width / 2 - w / 2,
        ctx.canvas.height / 2 + (font_size + h) / 2];

        ctx.globalAlpha = 0.8;
        ctx.fillStyle = settings.COLOR;
        ctx.beginPath();
        ctx.roundRect(...position, ...size, 10);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";

        ctx.fillText(`${txt}`, ...txt_position);

        if (img !== null) {
            h = Math.min(w, max_img_size);
            ctx.drawImage(img, ctx.canvas.width / 2 - h / 2, txt_position[1] - h - margin, h, h);
        }

    }
};
