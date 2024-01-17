
export const assets = {
    ready: false,
    ready_count: 0,
    ready_total: 8,

    x: new Image(),
    o: new Image(),
    cats: new Image(),
    gear: new Image(),
    human: new Image(),
    ai: new Image(),
    toggle_on: new Image(),
    toggle_off: new Image(),

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
    }
};

assets.load_assets();

assets.x.onload = function () {
    assets.ready_count++;
    assets.check_ready();
};

assets.o.onload = function () {
    assets.ready_count++;
    assets.check_ready();
};

assets.cats.onload = function () {
    assets.ready_count++;
    assets.check_ready();
};

assets.gear.onload = function () {
    assets.ready_count++;
    assets.check_ready();
};

assets.human.onload = function () {
    assets.ready_count++;
    assets.check_ready();
};

assets.ai.onload = function () {
    assets.ready_count++;
    assets.check_ready();
};

assets.toggle_on.onload = function () {
    assets.ready_count++;
    assets.check_ready();
};

assets.toggle_off.onload = function () {
    assets.ready_count++;
    assets.check_ready();
};
