const fs = require('fs');
const RunNyang = function(msg) {
    var variables = [];
    var position = -1;
    try {
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
                writehere = writehere ?? "none!";
                if (writehere != "none!") variables[writehere].value = command;
                else console.log("에러: 어떤 변수에 값을 설정해야 할지 모르겠다냥!");
                act = undefined;
            } else if (command === "냥냥" && act == undefined) act = "consolelog";
            else if (command === "냥냐앙" && act === "consolelog") act = "consolelogVariable";
            else if (act === "consolelog") {
                console.log(command);
                act = undefined;
            } else if (act === "consolelogVariable") {
                var IHaveThis = false;
                for (variable of variables) {
                    if (variable.name === command) {
                        IHaveThis = true;
                        console.log(variable.value);
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
            } else console.log("에러: \"" + command + "\"같은 건 없다냥!");
        }
    } catch(err) {
        console.log("뭔가 잘못됐다냥");
    }
}

module.exports = RunNyang;