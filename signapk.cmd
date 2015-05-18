copy platforms\android\ant-build\MainActivity-release-unsigned.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore %USERPROFILE%\androidkeystore.jks MainActivity-release-unsigned.apk trafficbuddy
%USERPROFILE%\AppData\Local\Android\sdk\build-tools\21.1.2\zipalign -f 4 MainActivity-release-unsigned.apk us.rdkl.traffic-spotter.apk
