#!/bin/bash
echo "remove old build/"
rm -rf build/
echo "build kickertool"
#nwbuild -p linux64,linux32,osx32,win32 -v 0.12.2 --quiet ./
nwbuild -p linux64 -v 0.12.3 --quiet ./
#echo "copy mac icon"
#cp icon.icns build/Kickertool/osx32/Kickertool.app/Contents/Resources/nw.icns
cd build/Kickertool/
for file in *; do

  echo "packing $file"
  cd $file
  if [ $file == "osx32" ]; then
    file="osx"
  fi
  if [ $file == "win32" ]; then
    file="win"
  fi
  zip -rq "$file.zip" *
  echo "move $file.zip to build/"
  mv "$file.zip" "../../"
  cd ..
done
cd ..
rm -rf Kickertool
