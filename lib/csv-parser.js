const fs = require('fs');

const PARSE_CONFIG = {
    DEFAULT_PATH: './config/programs.csv',
    COMMENT_CHAR: '#',
    GENRE_CAHR: '@',
    DEFAULT_GENRE: 'その他'
};

exports.parse = function (filename = PARSE_CONFIG.DEFAULT_PATH) {
    const csv = fs.readFileSync(filename, 'utf8');
    const lines = csv.split(/\r\n|\r|\n/);
    var data = {};
    var currentGenre = PARSE_CONFIG.DEFAULT_GENRE;
    for (var line of lines) {
        if (line) {
            const blocks = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(v => {
                return v.replace(/^"|"$/g, '').replace(/""/g, '"').replace(/\\\\/g, '\\');
            });

            if (blocks.length < 1 || blocks[0].startsWith(PARSE_CONFIG.COMMENT_CHAR)) {
                // Comment out
                continue;
            } else if (blocks[0].startsWith(PARSE_CONFIG.GENRE_CAHR)) {
                // Genre Line
                currentGenre = blocks[0].replace(/^\@/, '').trim();
            } else if (blocks[1] && blocks[2]) {
                // Task Line
                if (!data.hasOwnProperty(currentGenre)) data[currentGenre] = [];
                data[currentGenre].push({
                    name: blocks[1],
                    descript: blocks[2],
                    command: blocks[3],
                    allowForceExec: (blocks[4] == 1)
                });
            }
        }
    }
    return data;
}