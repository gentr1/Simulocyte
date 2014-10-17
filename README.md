# Simulocyte
### a minecraft for cell biology: work as a team online to build 3d models of the cell

This version use sails, express, and socket.io for the networking.

It also uses webgl to visualise metabolic networks of the cell using three.js, and combine with visualisations from d3js.

downloads:

1- install mongodb

2- install node.js 
3- download and install robomongo (a little user graphical interface that allows you to modify the mongodb database) at http://robomongo.org/

3- download the .zip file of the simulocyte project and extract it to a folder...

4- download metabolic networks .json files that are available ( recon2.v02.xml_metabolic_net.json,  hepatonet1-msb201062-s5.xml_metabolic_net.json, Ec_iAF1260_flux2.xml_metabolic_net.json)

installation:

0 - make sure mongodb is on (you can test that by issuing the command mongo , if it start the mongodb shell without error message that means it works ok, you can then exit it by typing "exit"...)

1- go to the simulocyte folder where you can see the package.json file...

2- install the sails web framework in your os path by typing  "npm -g install sails"(need a sudo before if you are in linux)

3- install all the required packages that I use in simulocyte by typing "npm install" (the package.json file contains the list of all these packages if you are interested)

4- go to /simulocyte folder/node_modules/sails/lib/express/index.js
replace the line: 
bodyParser = sails.config.express.bodyParser();
by:
bodyParser = sails.config.express.bodyParser({limit: 18248242});

done!

**Special Note:** A live version of the site will be available soon
