import { settings } from "./settings.js";
import { draw } from "./draw.js";

export const alert = {

    active: false,
    text: '',
    image: null,

    draw: function (ctx, txt = this.text, img = this.image) {

        this.active = true;
        this.text = txt;
        this.image = img;

        const margin = 30;
        let font_size = 40; //34;
        const max_img_size = 150;

        ctx.font = `${font_size}px '${settings.font_face}'`;

        font_size = draw.reduce_font(ctx, txt, font_size, ctx.canvas.width / 1.3 - margin);

        const w = ctx.measureText(`${txt}`).width;
        let h = font_size;

        if (typeof this.image === "string") {
            h += font_size * 2 + margin;
        } else {
            h += this.image !== null ? Math.min(w, max_img_size) : 0;
        }

        const size = [w + margin * 2, h + margin * 1.25];
        const position = [ctx.canvas.width / 2 - (size[0] / 2),
        ctx.canvas.height / 2 - (size[1] / 2) + margin / 4];

        if (typeof this.image === "string") {
            h = this.image !== null ? font_size * 2 : 0;
        } else {
            h = this.image !== null ? Math.min(w, max_img_size) : 0;
        }

        const txt_position = [ctx.canvas.width / 2 - w / 2,
                ctx.canvas.height / 2 + (font_size + h) / 2];

        ctx.globalAlpha = settings.alpha;
        ctx.fillStyle = settings.color;
        ctx.beginPath();
        ctx.roundRect(...position, ...size, settings.corner_radius);
        ctx.fill();
        ctx.globalAlpha = 1;

        const offset = 2;
        ctx.fillStyle = "black";
        ctx.fillText(`${txt}`, txt_position[0] + offset, txt_position[1] + offset);

        ctx.fillStyle = "white";
        ctx.fillText(`${txt}`, ...txt_position);

        if (this.image !== null) {
            if (typeof this.image === "string") {
                font_size = draw.reduce_font(ctx, `${this.image}`, 100, 100);
                const wr = ctx.measureText(`${this.image}`).width;
                ctx.fillText(`${this.image}`, ctx.canvas.width / 2 - wr / 2, position[1] + font_size + margin / 4);
            } else {
                h = Math.min(w, max_img_size);
                ctx.drawImage(this.image, ctx.canvas.width / 2 - h / 2, txt_position[1] - h - margin, h, h);
            }
        }

    }
    
};
