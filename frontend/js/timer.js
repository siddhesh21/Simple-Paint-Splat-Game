/**
 * Function to load timer on screen
 * @param  {} seconds
 * @param  {} game
 * @param  {} x
 * @param  {} y
 */
function set_timer_on_screen(seconds, game, x, y) {
    let text = game.add.text(x, y, seconds, { color: 'black', fontFamily: 'Arial', fontSize: '25px '});
    return text;
}