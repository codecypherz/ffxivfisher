@echo off

echo.
call rmsymlinks.bat

echo.
echo ___________________________________________
echo Deploying FFXIV Fisher to AppEngine...
echo.

"C:\Program Files\eclipse\plugins\com.google.appengine.eclipse.sdkbundle_1.9.17\appengine-java-sdk-1.9.17\bin\appcfg.cmd" ^
  update ..\war\

echo.
echo ___________________________________________
echo Deployment finished.
echo.