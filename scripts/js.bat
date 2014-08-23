@echo off

echo ==============
echo Building JS...
echo ==============
..\closure\bin\build\closurebuilder.py ^
  --root ..\closure\ ^
  --root ..\js_src\ ^
  --root ..\js_generated\ ^
  -n ff.home.Main ^
  -c ..\closure\compiler\compiler.jar ^
  -o compiled ^
  -f --compilation_level=ADVANCED_OPTIMIZATIONS ^
  -f --warning_level=VERBOSE ^
  -f --closure_entry_point=ff.home.Main ^
  -f --only_closure_dependencies ^
  -f --manage_closure_dependencies ^
  -f --accept_const_keyword ^
  --output_file=..\war\generated\fisher.js
echo Finished building fisher.js.

echo =====================
echo Finished building JS.
echo =====================