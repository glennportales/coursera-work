import urllib.request, urllib.parse, urllib.error
import ssl
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

fhand = urllib.request.urlopen('http://www.dr-chuck.com/page1.htm', context=ctx)
for line in fhand:
    print(line.decode().strip())