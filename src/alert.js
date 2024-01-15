import { settings } from "./tictactoe.js";

export const alert = {
    active: false,
    text: '',
    image: null,
    draw: function (ctx, txt = this.text, img = this.image) {

        this.active = true;
        this.text = txt;
        this.image = img;

        const margin = 30;
        const font_size = 32;
        const max_img_size = 150;

        ctx.font = `${font_size}px '${settings.font_face}'`;

        const w = ctx.measureText(`${txt}`).width;
        let h = font_size;
        h += this.image !== null ? Math.min(w, max_img_size) : 0;

        const size = [w + margin * 2, h + margin * 1.25];
        const position = [ctx.canvas.width / 2 - (size[0] / 2),
        ctx.canvas.height / 2 - (size[1] / 2) + margin / 4];

        h = this.image !== null ? Math.min(w, max_img_size) : 0;

        const txt_position = [ctx.canvas.width / 2 - w / 2,
        ctx.canvas.height / 2 + (font_size + h) / 2];

        ctx.globalAlpha = 0.75;
        ctx.fillStyle = settings.COLOR;
        ctx.beginPath();
        ctx.roundRect(...position, ...size, 10);
        ctx.fill();
        ctx.globalAlpha = 1;

        const offset = 2;
        ctx.fillText(`${txt}`, txt_position[0] + offset, txt_position[1] + offset);

        ctx.fillStyle = "white";
        ctx.fillText(`${txt}`, ...txt_position);

        if (this.image !== null) {
            h = Math.min(w, max_img_size);
            ctx.drawImage(this.image, ctx.canvas.width / 2 - h / 2, txt_position[1] - h - margin, h, h);
        }


    }
};
