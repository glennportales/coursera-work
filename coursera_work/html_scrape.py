import urllib.request, urllib.parse, urllib.error
from bs4 import BeautifulSoup
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'http://py4e-data.dr-chuck.net/comments_2069730.html'
html = urllib.request.urlopen(url, context=ctx).read()
soup = BeautifulSoup(html, 'html.parser')
tags = soup('span')

sum = 0

for tag in tags:
    num_list = re.findall('\d+', tag.text)
    if num_list:
        for num in num_list:
            sum += int(num)
            
        else: continue
        
print(sum)