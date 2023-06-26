#!/bin/bash
# OUT_DIR=../../pkg/manabuf/
# mkdir -p $OUT_DIR
# OPTION="paths=source_relative"

# shopt -s globstar nullglob
# for f in **/**/*.proto
# do
# # FAILSAFE #
# # * Check if "$f" FILE exists and is a regular file and then only copy it #
#   if [[ "$f" != @(*"options"*) ]];
#   then
#    protoc -I=./ \
#     --go_out=$OPTION:$OUT_DIR \
#     --go_opt=$OPTION \
#     --go-grpc_out=require_unimplemented_servers=false,$OPTION:$OUT_DIR \
#     --go-grpc_opt=require_unimplemented_servers=false,$OPTION \
#     $f;
#   fi
# done

protoc --go_out=pkg --go_opt=paths=source_relative --go-grpc_out=pkg --go-grpc_opt=paths=source_relative proto/**/**/*.proto
  