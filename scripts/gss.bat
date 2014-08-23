@echo off
echo Building CSS...

java -jar ..\closure\gss\closure-stylesheets-20111230.jar ^
  --output-file ..\war\generated\fisher.css ^
  ..\js_src\ui\css\mixin.css

echo Finished building CSS