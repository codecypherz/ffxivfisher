@echo off
..\closure\bin\calcdeps.py ^
  --output_file=..\war\generated\deps.js ^
  -o deps ^
  -p ..\js_src\ ^
  -p ..\js_generated\ ^
  -p ..\closure\