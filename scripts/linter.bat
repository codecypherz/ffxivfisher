@echo off
gjslint ^
  -r ../js_src ^
  --closurized_namespaces="goog,ff" ^
  --strict ^
  --jslint_error=all ^
  --check_html