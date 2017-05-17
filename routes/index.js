var express = require('express');
var router = express.Router();
var Excel = require('exceljs');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/dipendenti', function (req, res, next) {
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile("./public/excel/Dipendenti.xlsx")
        .then(function () {
            var result = [];
            var worksheet = workbook.getWorksheet('Dipendenti');
            for (i = 2; i < worksheet.rowCount; i++) {
                var row = worksheet.getRow(i);
                var cell = row.getCell(1).value;
                var cellcol = row.getCell(2).value;
                if (cellcol == null) cellcol = 'FF000000';
                var dips = {
                    dip: cell,
                    color: cellcol,
                };
                result.push(dips);
            }
            res.send(200, JSON.stringify(result));
        });
});

router.post('/insert', function (req, res, next) {
    var dip = req.body.dip;
    var dipcolor = req.body.dipcolor;
    var comm = req.body.comm;
    var ore = req.body.ore;
    var giorno = req.body.giorno;
    if (giorno.length < 2) giorno = "0" + giorno;
    var mese = req.body.mese;
    if (mese.length < 2) mese = "0" + mese;
    var currentTime = new Date();
    var year = currentTime.getFullYear();
    var filename = "./public/excelore/" + getMese(parseInt(mese) - 1) + ".xlsx";
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filename)
        .then(function () {
            var worksheet = workbook.getWorksheet(giorno + "-" + mese);
            if (worksheet == undefined) {
                var sheet = workbook.addWorksheet(giorno + "-" + mese);
                var nameday = Day_name(giorno + "-" + mese + "-" + year);
                sheet.columns = [
                    {header: '', key: '', width: 30}];
                var row = sheet.getRow(1);
                row.height = 30;
                sheet.getCell('A1').font = {
                    name: 'Arial Black',
                    size: 10,
                    bold: true
                };
                sheet.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'};
                sheet.getCell('A1').value = "REGISTRAZIONE";
                sheet.getCell('A1').border = {
                    top: {style: 'thin'},
                    left: {style: 'thin'},
                    bottom: {style: 'thin'}
                };
                sheet.mergeCells('B1:F1');
                sheet.getCell('B1').border = {
                    top: {style: 'thin'},
                    bottom: {style: 'thin'},
                    right: {style: 'thin'}
                };
                sheet.getCell('A2').font = {
                    name: 'Arial Black',
                    size: 10,
                    bold: true
                };
                sheet.getCell('A2').alignment = {vertical: 'middle', horizontal: 'center'};
                sheet.getCell('A2').value = "DATA";
                sheet.getCell('A2').border = {
                    top: {style: 'thin'},
                    left: {style: 'thin'},
                    bottom: {style: 'thin'}
                };
                sheet.getCell('B2').font = {
                    name: 'Arial Black',
                    size: 10,
                    bold: true
                };
                sheet.mergeCells('B2:F2');
                sheet.getCell('B2').alignment = {vertical: 'middle', horizontal: 'left'};
                sheet.getCell('B2').value = nameday + " " + giorno + "/" + mese + "/" + year;
                sheet.getCell('B2').border = {
                    top: {style: 'thin'},
                    bottom: {style: 'thin'},
                    right: {style: 'thin'}
                };
                sheet.getCell('A3').font = {
                    name: 'Arial Black',
                    size: 10,
                    bold: true
                };
                sheet.getCell('A3').alignment = {vertical: 'middle', horizontal: 'left'};
                sheet.getCell('A3').value = "Dipendente";
                sheet.getCell('A3').border = {
                    left: {style: 'thin'},
                    right: {style: 'thin'}
                };
                sheet.getCell('A3').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {argb: 'FFAFC3C9'},
                    bgColor: {argb: 'FFAFC3C9'}
                };
                var totrow = sheet.rowCount;
                var rowempty = sheet.getRow(totrow + 1);
                rowempty.getCell(1).value = dip;
                rowempty.getCell(1).font = {
                    name: 'Calibri',
                    size: 12,
                    color: {argb: dipcolor},
                }
                rowempty.getCell(1).border = {
                    top: {style: 'thin'},
                    left: {style: 'thin'},
                    bottom: {style: 'thin'},
                    right: {style: 'thin'}
                };
                rowempty.getCell(2).value = comm;
                rowempty.getCell(2).border = {
                    top: {style: 'thin'},
                    left: {style: 'thin'},
                    bottom: {style: 'thin'}
                };
                rowempty.getCell(2).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {argb: 'FF929DD5'},
                    bgColor: {argb: 'FF929DD5'}
                };
                rowempty.getCell(3).value = ore;
                rowempty.getCell(3).border = {
                    top: {style: 'thin'},
                    bottom: {style: 'thin'},
                    right: {style: 'thin'}
                };
                rowempty.getCell(3).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {argb: 'FFA5D1DE'},
                    bgColor: {argb: 'FFA5D1DE'}
                };
                workbook.xlsx.writeFile(filename)
                    .then(function () {
                        res.status(200).send("Ore Inserite")
                        //res.send(200, "Ore Inserite");
                    });
            } else {
                var totrow = worksheet.rowCount;
                var nofind = true;
                for (var i = 1; i < totrow + 1; i++) {
                    var row = worksheet.getRow(i);
                    var code = row.getCell(1).value;
                    if (code == dip) {
                        nofind = false;
                        i = totrow + 1;
                        var totcell = row.cellCount;
                        row.getCell(totcell + 1).value = comm;
                        row.getCell(totcell + 1).border = {
                            top: {style: 'thin'},
                            left: {style: 'thin'},
                            bottom: {style: 'thin'}
                        };
                        row.getCell(totcell + 1).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: {argb: 'FF929DD5'},
                            bgColor: {argb: 'FF929DD5'}
                        };
                        row.getCell(totcell + 2).value = ore;
                        row.getCell(totcell + 2).border = {
                            top: {style: 'thin'},
                            bottom: {style: 'thin'},
                            right: {style: 'thin'}
                        };
                        row.getCell(totcell + 2).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: {argb: 'FFA5D1DE'},
                            bgColor: {argb: 'FFA5D1DE'}
                        };
                        workbook.xlsx.writeFile(filename)
                            .then(function () {
                                res.status(200).send("Ore Inserite")
                                //res.send(200, "Ore Inserite");
                            });

                    }
                }
                if (nofind) {
                    var rowempty = worksheet.getRow(totrow + 1);
                    rowempty.getCell(1).value = dip;
                    rowempty.getCell(1).font = {
                        name: 'Calibri',
                        size: 12,
                        color: {argb: dipcolor},
                    }
                    rowempty.getCell(1).border = {
                        top: {style: 'thin'},
                        left: {style: 'thin'},
                        bottom: {style: 'thin'},
                        right: {style: 'thin'}
                    };
                    rowempty.getCell(2).value = comm;
                    rowempty.getCell(2).border = {
                        top: {style: 'thin'},
                        left: {style: 'thin'},
                        bottom: {style: 'thin'}
                    };
                    rowempty.getCell(2).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {argb: 'FF929DD5'},
                        bgColor: {argb: 'FF929DD5'}
                    };
                    rowempty.getCell(3).value = ore;
                    rowempty.getCell(3).border = {
                        top: {style: 'thin'},
                        bottom: {style: 'thin'},
                        right: {style: 'thin'}
                    };
                    rowempty.getCell(3).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {argb: 'FFA5D1DE'},
                        bgColor: {argb: 'FFA5D1DE'}
                    };
                    workbook.xlsx.writeFile(filename)
                        .then(function () {
                            res.status(200).send("Ore Inserite")
                            //res.send(200, "Ore Inserite");
                        });
                }
            }
        }).catch(function (err) {
        var workbook = new Excel.Workbook();
        var sheet = workbook.addWorksheet(giorno + "-" + mese);
        var nameday = Day_name(giorno + "-" + mese + "-" + year);
        sheet.columns = [
            {header: '', key: '', width: 30}];
        var row = sheet.getRow(1);
        row.height = 30;
        sheet.getCell('A1').font = {
            name: 'Arial Black',
            size: 10,
            bold: true
        };
        sheet.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'};
        sheet.getCell('A1').value = "REGISTRAZIONE";
        sheet.getCell('A1').border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'}
        };
        sheet.mergeCells('B1:F1');
        sheet.getCell('B1').border = {
            top: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
        };
        sheet.getCell('A2').font = {
            name: 'Arial Black',
            size: 10,
            bold: true
        };
        sheet.getCell('A2').alignment = {vertical: 'middle', horizontal: 'center'};
        sheet.getCell('A2').value = "DATA";
        sheet.getCell('A2').border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'}
        };
        sheet.getCell('B2').font = {
            name: 'Arial Black',
            size: 10,
            bold: true
        };
        sheet.mergeCells('B2:F2');
        sheet.getCell('B2').alignment = {vertical: 'middle', horizontal: 'left'};
        sheet.getCell('B2').value = nameday + " " + giorno + "/" + mese + "/" + year;
        sheet.getCell('B2').border = {
            top: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
        };
        sheet.getCell('A3').font = {
            name: 'Arial Black',
            size: 10,
            bold: true
        };
        sheet.getCell('A3').alignment = {vertical: 'middle', horizontal: 'left'};
        sheet.getCell('A3').value = "Dipendente";
        sheet.getCell('A3').border = {
            left: {style: 'thin'},
            right: {style: 'thin'}
        };
        sheet.getCell('A3').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'FFAFC3C9'},
            bgColor: {argb: 'FFAFC3C9'}
        };
        var totrow = sheet.rowCount;
        var rowempty = sheet.getRow(totrow + 1);
        rowempty.getCell(1).value = dip;
        rowempty.getCell(1).font = {
            name: 'Calibri',
            size: 12,
            color: {argb: dipcolor},
        }
        rowempty.getCell(1).border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
        };
        rowempty.getCell(2).value = comm;
        rowempty.getCell(2).border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'}
        };
        rowempty.getCell(2).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'FF929DD5'},
            bgColor: {argb: 'FF929DD5'}
        };
        rowempty.getCell(3).value = ore;
        rowempty.getCell(3).border = {
            top: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
        };
        rowempty.getCell(3).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'FFA5D1DE'},
            bgColor: {argb: 'FFA5D1DE'}
        };
        workbook.xlsx.writeFile(filename)
            .then(function () {
                res.status(200).send("Ore Inserite")
                //res.send(200, "Ore Inserite");
            });
    });
});

function getMese(nummese) {
    var monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
        "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    return monthNames[nummese];
}

function Day_name(custom_date) {
    var myDate = custom_date;
    myDate = myDate.split("-");
    var newDate = myDate[2] + "-" + myDate[1] + "-" + myDate[0];
    var my_ddate = new Date(newDate).getTime();
    var currentDate = new Date(newDate);
    var day_name = currentDate.getDay();
    var days = new Array("Domenica", "Lunedi", "Martedi", "Mercoledi", "Giovedi", "Venerdi", "Sabato");
    return days[day_name];
}

module.exports = router;
