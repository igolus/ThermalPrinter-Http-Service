var moment = require('moment');

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const ThermalPrinter = require("node-thermal-printer").printer;
const Types = require("node-thermal-printer").types;

var esprima = require('esprima');
const app = express();
const port = 3005;

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function printItem(item, currency, printer, priceZero, quantity) {
    let qte =  item.quantity || quantity
    let left = qte + "X" + (item.productName || item.name);
    let right = (priceZero ? 0 : (parseFloat(item.price)) * qte).toFixed(2) + " " + currency;
    printer.leftRight(left, right);
}

function computeTotalDealPrice(deal) {
    let total = 0;
    deal.productAndSkusLines.forEach(item => {
        total += parseFloat(item.price);
    })
    return total;
}

app.post('/printThermal', async (req, res) => {
    try {

        mainWindowInstance.webContents.send('dataSending');

        const body = req.body;
        const model = body.model;
        const order = body.order;
        const urlPrinter = body.printerUrl || "tcp://127.0.0.1:9100";

        console.log("urlPrinter " + urlPrinter)
        let printer = new ThermalPrinter({
            type: model === "EPSON" ? Types.EPSON : Types.STAR,
            interface: urlPrinter,
            options: {
                timeout: 1000
            },
            width: 48,                         // Number of characters in one line - default: 48
            characterSet: 'SLOVENIA',          // Character set - default: SLOVENIA
            removeSpecialCharacters: false,    // Removes special characters - default: false
            lineCharacter: "-",                // Use custom character for drawing lines - default: -
        });

        let isConnected = await printer.isPrinterConnected();
        console.log("Printer connected:", isConnected);

        console.log(body);
        let data =  body.data;

        try {
            printWithData(printer, data, body.headerScript);
            printWithData(printer, data, body.bodyScript);
            printWithData(printer, data, body.footerScript);
        }
        catch(error) {
            console.log(error);
            res.json({
                status: 'error',
                error: error.message,
            })
            return;
        }

        await printer.execute();
        console.log("Print success.");
    } catch (error) {
        console.error("Print error:", error);
        res.json({
            status: 'error',
            error: error.message,
        })
        return;
    } finally {
        mainWindowInstance.webContents.send('dataEnd');
    }

    res.json({ status: 'ok' })
});

const printWithData = (printer, data, content) => {
    console.log(content)
    if (content) {
        esprima.parse(content);
        eval(content);
    }
}

var mainWindowInstance;

module.exports = {
    startServer: (mainWindow) => {
        mainWindowInstance = mainWindow;
        app.listen(port, () => console.log(`Server running on port ${port}!`));
    }
}
