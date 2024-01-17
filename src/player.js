import { settings, game_reset } from "./tictactoe.js";
import { assets, draw } from "./draw.js";
import { alert } from "./alert.js";

export const player = {

    x: 1, // 1 == human
    o: 0, // 0 == ai

    get_type: function (player) {
        return player === 1 ? this.x : this.o;
    },

    update_type: function (player, new_type) {
        if (player === 1) {
            this.x = new_type;
        } else {
            this.o = new_type;
        }
    },

    get_player_turn: function (turn) { 
        return turn === 1 ? 'X' : 'O'; 
    },

    select_screen: {

        active: false,

        toggle1: [],
        toggle2: [],
        toggle_size: [],

        x_current_state: 0,
        o_current_state: 0,

        open: function (x, y, title_ctx, game_ctx, array, margin) {

            const padding = 5;
            const position = { x: 0, y: 0 };
            const size = { w: title_ctx.canvas.height + padding * 2, h: title_ctx.canvas.height + settings.padding };

            x -= settings.padding;
            y -= settings.padding;

            if (x > position.x + size.w || x < position.x || y > position.y + size.h || y < position.y) {
                return;
            }

            // toggle state of select screen window.
            this.active = !this.active;
            alert.active = false;
            draw.draw_game(game_ctx, array, margin);
            draw.draw_titlebar(title_ctx);

            if (this.active) {

                // get current state
                this.x_current_state = player.get_type(1);
                this.o_current_state = player.get_type(-1);
                this.draw(game_ctx);

            } else {

                // if state changes, reset game.
                if (this.x_current_state !== player.get_type(1) || this.o_current_state !== player.get_type(-1)) {
                    game_reset(game_ctx);
                }
            }

        },

        draw: function (ctx) {

            if (!this.active) {
                return;
            }

            const padding = 20;
            const width = ctx.canvas.width - padding * 2;
            const window_size = [width, width * 0.8];
            const window_position = [ctx.canvas.width / 2 - window_size[0] / 2,
                                ctx.canvas.height / 2  - window_size[1] / 2];
            
            ctx.globalAlpha = settings.alpha;
            ctx.fillStyle = settings.COLOR;
            ctx.beginPath();
            ctx.roundRect(...window_position, ...window_size, settings.corner_radius);
            ctx.fill();
            ctx.globalAlpha = 1;

            const x_image_pos = [window_position[0] + padding, window_position[1] + padding];
            const y_image_pos = [x_image_pos[0], x_image_pos[1] + window_size[0] / 3];
            const symbol_size = [window_size[0] / 3, window_size[0] / 3]

            ctx.drawImage(assets.get_image(1), ...x_image_pos, ...symbol_size);
            ctx.drawImage(assets.get_image(-1), ...y_image_pos, ...symbol_size);

            this.toggle_size = [150, 50];

            const z = ((window_position[0] + window_size[0]) - (x_image_pos[0] + symbol_size[0]));
            
            this.toggle1 = [z, x_image_pos[1] + symbol_size[1] / 2];
            this.toggle2 = [z, y_image_pos[1] + symbol_size[1] / 2];

            ctx.drawImage(player.get_type(1) === 1 ? assets.toggle_off : assets.toggle_on, ...this.toggle1, ...this.toggle_size);
            ctx.drawImage(player.get_type(-1) === 1 ? assets.toggle_off : assets.toggle_on, ...this.toggle2, ...this.toggle_size);

        },

        toggle_player_state: function (ctx, x, y, array, margin) {

            // this flag is used to prevent unnecessary drawing.
            let update_flag = false;

            x -= settings.padding;
            y -= settings.bar_height + settings.padding * 2

            // toggle 1
            if (x >= this.toggle1[0] && x <= this.toggle1[0] + this.toggle_size[0] &&
                y >= this.toggle1[1] && y <= this.toggle1[1] + this.toggle_size[1]) {
                        
                player.update_type(1, player.get_type(1) === 1 ? 0 : 1);
                update_flag = true;
            
            }

            // toggle 2
            if (x >= this.toggle2[0] && x <= this.toggle2[0] + this.toggle_size[0] &&
                y >= this.toggle2[1] && y <= this.toggle2[1] + this.toggle_size[1]) {
                    
                player.update_type(-1, player.get_type(-1) === 1 ? 0 : 1);
                update_flag = true;
        
            }

            if (update_flag) {

                draw.draw_game(ctx, array, margin);
                this.draw(ctx);
            }
            
        },

        draw_icon: function (ctx) {

            const size = [ctx.canvas.height, ctx.canvas.height];
            const icon = this.active ? assets.x : assets.gear;

            ctx.drawImage(icon, 5, 0, ...size);

        }
    
    }

};
