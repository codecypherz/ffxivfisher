@echo off
echo Building CSS...

java -jar ..\closure\gss\closure-stylesheets-20111230.jar ^
  --output-file ..\war\generated\fisher.css ^
  ..\js_src\fisher\ui\fisher.css ^
  ..\js_src\fisher\ui\admin\adminfishdialog.css ^
  ..\js_src\ui\css\base.css ^
  ..\js_src\ui\css\button.css ^
  ..\js_src\ui\css\dialog.css ^
  ..\js_src\ui\css\input.css ^
  ..\js_src\ui\css\mixin.css

echo Finished building CSS