const isString = function(text) {
    if (isNaN(text)) {
        return text.startsWith('"') && text.endsWith('"');
    } else {
        return false;
    }
}

const parseString = function(array, position) {
    var parsed = false;
    var string = array[position];
    for (var i = position + 1; !parsed; i++) {
        if (i === array.length) parsed = true;
        else {
            string = string + " " + array[i];
            if (string.endsWith('"') && !string.endsWith('\"')) parsed = true;
        }
    }
    return string;
}

module.exports = {
    isString,
    parseString
}