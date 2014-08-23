@echo off
fixjsstyle ^
  -r ../js_src ^
  --closurized_namespaces="goog,ff" ^
  --strict ^
  --jslint_error=all ^
  --additional_extension=html