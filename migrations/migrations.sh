#!/bin/sh
cd migrations/seeds
ls -1 *.json | while read jsonfile; do mongoimport -h db:27017  -d $DB_NAME --authenticationDatabase admin -u $DB_USERNAME -p $DB_PASSWORD --jsonArray --mode merge --file /migrations/seeds/$jsonfile --type json; done