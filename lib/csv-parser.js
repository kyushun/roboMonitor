const fs = require('fs');

const PARSE_CONFIG = {
    DEFAULT_PATH: './config/programs.csv',
    LENGTH: 5,
    COMMENT_CHAR: '#'
};

exports.parse = function (filename = PARSE_CONFIG.DEFAULT_PATH) {
    const csv = fs.readFileSync(filename, 'utf8');
    const lines = csv.split(/\r\n|\r|\n/);
    var data = [];
    for (var line of lines) {
        if (line) {
            const blocks = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(v => {
                return v.replace(/^"|"$/g, '').replace(/""/g, '"').replace(/\\/g, '\\');
            });

            if (blocks.length == PARSE_CONFIG.LENGTH && !blocks[0].startsWith(PARSE_CONFIG.COMMENT_CHAR)) {
                data.push({
                    id: blocks[0],
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