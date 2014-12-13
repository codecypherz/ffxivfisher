@echo off

echo ___________________________________________
echo Creating symbolic links
rmdir ..\war\closure
rmdir ..\war\js_generated
rmdir ..\war\js_src
mklink /d ..\war\closure ..\closure
mklink /d ..\war\js_generated ..\js_generated
mklink /d ..\war\js_src ..\js_src

echo ___________________________________________
echo Running FFXIV Fisher locally...
echo.

"C:\Program Files\eclipse luna\plugins\com.google.appengine.eclipse.sdkbundle_1.9.17\appengine-java-sdk-1.9.17\bin\dev_appserver.cmd" ^
   --port=8888 ^
   --jvm_flag=-Xdebug ^
   --jvm_flag=-Xrunjdwp:transport=dt_socket,address=5005,server=y,suspend=n ^
   ..\war\

echo ___________________________________________
echo Server shut down successfully.
echo.