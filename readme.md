# Thermal-Printer-Http-Service

Thermal-Printer-Http-Service is an application built with [electron](https://www.electronjs.org/). It provides an http service to print ticket on thermal printers like  Epson TM-M30 or Star TSP 143.

The first motivation of this project is to enable interactions on thermal printers from a web application.

This application is usefull with the project [la toque magique](https://latoquemagique.com/)

## Installation

### Using npm

in the console:

```
npm install
npm start
```



### Using the installer (for windows)

Run the installer coming from [releases](https://github.com/igolus/ThermalPrinter-Http-Service/releases/tag/release1) publishing

## Usage

After launching the application you should see the following widow:

![](https://raw.githubusercontent.com/igolus/ThermalPrinter-Http-Service/main/docImages/applicationWindow.png?token=AFS2ZKASMMPZPEN7UKXO32TATUOEK)

The application is running an express server on port 3005 and you can interact with it using http protocol.

As an example we will use postMan to drive the printer:

![](https://raw.githubusercontent.com/igolus/ThermalPrinter-Http-Service/main/docImages/postMan.png)



The url to target is : http://localhost:3005/printThermal 

Then you can define the content of you ticket using the body of the request example :

~~~javascript
```
{
  "data": {
    "currentDate": "*{{currentDate}}*"
  },
  "headerScript" : "printer.bold(true)\n printer.println(data.currentDate)\n",
  "bodyScript" : "printer.println(\"TEST\")\n",
  "footerScript" : "printer.println(\"FOOTER\")\n",
  "model": "EPSON",
  "urlPrinter": "tcp://127.0.0.1:9100"
}
~~~



### data

This structure is used to pass information that can be used in the scrip files

### urlPrinter

The url of you tpc printer, you can get it when rebooting you printer ate least for EPSON models

### model

- EPSON
- STAR

### Script

the body is divided into 3 part 

- header
- body
- footer

The application will treat the content of the script in the order defined above.

The content of each script is a javascript piece of code where you can use all the printer operations

```javascript
printer.print("Hello World");                               // Append text
printer.println("Hello World");                             // Append text with new line
printer.openCashDrawer();                                   // Kick the cash drawer
printer.cut();                                              // Cuts the paper (if printer only supports one mode use this)
printer.partialCut();                                       // Cuts the paper leaving a small bridge in middle (if printer supports multiple cut modes)
printer.beep();                                             // Sound internal beeper/buzzer (if available)
printer.upsideDown(true);  
....
```





See details [here](https://www.npmjs.com/package/node-thermal-printer)

Download [postman collection](https://raw.githubusercontent.com/igolus/ThermalPrinter-Http-Service/main/docImages/PrinterThermal.postman_collection.json)

If do not have a printer, you can simulate it using [escpos-printer-simulator](https://github.com/dacduong/escpos-printer-simulator)

![](https://raw.githubusercontent.com/igolus/ThermalPrinter-Http-Service/release1/docImages/emulator.png?token=AFS2ZKGY5YAOPSWFX2D5BBDATURSE)



## Dependencies

- [node-thermal-printer](https://www.npmjs.com/package/node-thermal-printer)
- [electron](https://www.electronjs.org/)
- [express](https://expressjs.com/fr/)
- ...

