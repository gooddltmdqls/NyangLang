const fs = require('fs');
const DataHandler = require('../DataTypeHandler/DataTypeHandler.js');
const RunNyang = function(msg) {
    var variables = [];
    try {
        var position = -1;
        var act = undefined;
        var writehere;
        var renamehere;
        for (command of msg.split(" ")) {
            position++
            if (command === "냥" && act == undefined) act = "var";
            else if (command === "냐앙" && act === "var") act = "varname";
            else if (command === "냥" && act === "var") act = "varvalue";
            else if (act === "varname") {
                var iHaveThis = false;
                var index = -1;
                var findex;
                for (variable of variables) {
                    index++;
                    if (variable.name === command) {
                        iHaveThis = true;
                        findex = index;
                    }
                }
                if (!iHaveThis) {
                    variables.push({
                        name: command,
                        value: null
                    });
                    writehere = variables.length - 1;
                } else writehere = findex;
                act = "var";
            } else if (command === "냐냥냥") {
                var nyanyangnyang = "";
                for (variable of variables) {
                    if (variable.name === "help") nyanyangnyang = nyanyangnyang;
                    else nyanyangnyang = nyanyangnyang + variable.name + ": " + variable.value + "\n";
                }
                process.stdin.write(nyanyangnyang);
            } else if (act === "varvalue") {
                var string;
                if (command.startsWith('"')) {
                    string = DataHandler.parseString(msg.split(' '), position);
                    if (!DataHandler.isString(string)) string = null;
                } else if (DataHandler.isBoolean(command)) {
                    if (command === "true") string = true;
                    else if (command = "false") string = false;
                } else if (DataHandler.isInt(command)) string = command - 0;
                else string = null;
                writehere = writehere ?? "none!";
                if (string == null) console.log("에러: 자료형이 뭔가 잘못됐다냥!");
                else if (writehere != "none!") variables[writehere].value = string;
                else console.log("에러: 어떤 변수에 값을 설정해야 할지 모르겠다냥!");
                if (command.startsWith('"') && !command.endsWith('"')) act = "string";
                else act = undefined;
            } else if (command === "냥냥" && act == undefined) act = "consolelog";
            else if (command === "냥냐앙" && act === "consolelog") act = "consolelogVariable";
            else if (act === "consolelog") {
                var string;
                if (command.startsWith('"')) {
                    string = DataHandler.parseString(msg.split(' '), position);
                    if (!DataHandler.isString(string)) string = "에러: 자료형이 뭔가 잘못됐다냥!";
                    else string = string.substring(1, string.length - 1);
                } else if (DataHandler.isBoolean(command)) {
                    if (command === "true") string = true;
                    else if (command = "false") string = false;
                } else if (DataHandler.isInt(command)) string = command - 0;
                else string = "에러: 자료형이 뭔가 잘못됐다냥!";
                console.log(string);
                if (command.startsWith('"') && !command.endsWith('"')) act = "string";
                else act = undefined;
            } else if (act === "consolelogVariable") {
                var IHaveThis = false;
                for (variable of variables) {
                    if (variable.name === command) {
                        IHaveThis = true;
                        if (DataHandler.isString(variable.value)) string = variable.value.substring(1, variable.value.length - 1);
                        else string = variable.value;
                        console.log(string);
                    }
                }
                if (!IHaveThis) console.log("에러: \"" + command + "\"같은 변수는 없다냥!");
                act = undefined;
            } else if (act === "var" && command === "냐아앙") act = "renamevar";
            else if (act === "renamevar") {
                var iHaveThis = false;
                var index = -1;
                for (variable of variables) {
                    index++;
                    if (variable.name === command) {
                        iHaveThis = true;
                        renamehere = index;
                        act = "renamevarUnConfirm";
                    }
                }
                if (!iHaveThis) {
                    console.log("에러: \"" + command + "\"같은 변수는 없다냥!");
                    act = undefined;
                }
            } else if (act === "renamevarUnConfirm" && command === "냥") act = "renamevarConfirm";
            else if (act === "renamevarConfirm") {
                variables[renamehere].name = command;
                act = undefined;
            } else if (act == undefined && command === "냥냐앙") act = "readnyangfile";
            else if (act === "readnyangfile") {
                if (!fs.existsSync(command)) console.log("에러: \"" + command + "\"같은 파일은 없다냥!");
                else {
                    if (!command.endsWith(".nyang")) console.log("에러: 파일 확장자가 .nyang이 아닌 것은 취급하지 않는다냥!");
                    else {
                        RunNyang(fs.readFileSync(command, 'utf-8'))
                    }
                }
                act = undefined;
            } else if (act === "string") {
                if (command.endsWith('"')) act = undefined;
            } else console.log("에러: \"" + command + "\"같은 건 없다냥!");
        }
    } catch(err) {
        console.log("뭔가 잘못됐다냥");
    }
}

module.exports = RunNyang;