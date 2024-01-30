
export const player = {

    x: 0, // 1 == human
    o: 1, // 0 == ai

    get_type: function (player) {
        return player === 1 ? this.x : this.o;
    },

    update_type: function (player, new_type) {

        if (player === 1) {

            this.x = new_type;
            // prevents 2 computers
            if (this.x === 0 && this.o === 0) {
                this.o = 1;
            }
            
        } else {

            this.o = new_type;
            // prevents 2 computers
            if (this.x === 0 && this.o === 0) {
                this.x = 1;
            }
        }
    },

    get_player_turn: function (turn) { 
        return turn === 1 ? 'X' : 'O'; 
    },

};
