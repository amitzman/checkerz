#!/bin/bash

mongoimport --jsonArray --drop --db $DB --collection users --file ../data/players.json
