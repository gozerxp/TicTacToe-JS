import { settings } from "./settings.js";

export const assets = {
    ready: false,
    ready_count: 0,
    ready_total: 9,

    x: new Image(),
    o: new Image(),
    cats: new Image(),
    gear: new Image(),
    human: new Image(),
    ai: new Image(),
    toggle_on: new Image(),
    toggle_off: new Image(),

    font: new FontFace(`${settings.font_face}`, `url(./assets/${settings.font_face}.ttf)`),

    get_image: function (turn) {
        return turn === 1 ? this.x : this.o;
    },

    load_assets: function () {
        this.x.src = "./assets/x.png";
        this.o.src = "./assets/o.png";
        this.cats.src = "./assets/cat.png";
        this.gear.src = "./assets/gear.png";
        this.human.src = "./assets/human.png";
        this.ai.src = "./assets/ai.png";
        this.toggle_on.src = "./assets/toggle_on.png";
        this.toggle_off.src = "./assets/toggle_off.png";

    },

    check_ready: function () {
        if (this.ready_count === this.ready_total) {
            this.ready = true;
        }
    },

    count_ready: function() {
        this.ready_count++;
        this.check_ready();
    }

};

assets.load_assets();

assets.x.onload = function () {
    assets.count_ready();
};

assets.o.onload = function () {
    assets.count_ready();
};

assets.cats.onload = function () {
    assets.count_ready();
};

assets.gear.onload = function () {
    assets.count_ready();
};

assets.human.onload = function () {
    assets.count_ready();
};

assets.ai.onload = function () {
    assets.count_ready();
};

assets.toggle_on.onload = function () {
    assets.count_ready();
};

assets.toggle_off.onload = function () {
    assets.count_ready();
};

assets.font.load().then((font) => {
    document.fonts.add(font);
    assets.count_ready();
});

