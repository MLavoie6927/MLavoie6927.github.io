@echo off
setlocal
 echo === K12 Windows Quick Triage ===
 echo %DATE% %TIME%
 hostname
 whoami
 echo.
 echo === IPCONFIG ===
 ipconfig /all
 echo.
 echo === ROUTES ===
 route print -4
 echo.
 echo === DNS CACHE ===
 ipconfig /displaydns
 echo.
 echo === TEST DNS ===
 nslookup example.com
 echo.
 echo === ARP ===
 arp -a
 endlocal
