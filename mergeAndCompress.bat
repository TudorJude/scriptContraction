:loop
copy NUL unified.txt
for /R src %%f in (.\*) do type "%%f" >> unified.txt
java -jar closureCompiler.jar --js unified.txt --js_output_file cloudScript-constricted.js
pause
goto loop
