#!/bin/bash

sed $3 "s/\/data\//\/data\/$1\//g" $2
