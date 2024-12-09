import urllib.request, urllib.parse, urllib.error
from bs4 import BeautifulSoup
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'http://py4e-data.dr-chuck.net/known_by_Garry.html'

count = input('Enter count: ')
position = input('Enter position: ')

for _ in range(int(count)):
    html = urllib.request.urlopen(url, context=ctx).read()
    soup = BeautifulSoup(html, 'html.parser')
    #retrieve anchor tags
    tags = soup('a')
    print('Retrieving: ', tags[int(position)-1].get('href', None))
    url = tags[int(position)-1].get('href', None)

print('The answer to the assignment for this execution is "', tags[int(position)-1].text,'"')
    