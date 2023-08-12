#!/bin/bash
 ID=$(docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep "taxi/usermgmt latest" | awk '{print $1}')
 

 
 echo "Removing image $ID"