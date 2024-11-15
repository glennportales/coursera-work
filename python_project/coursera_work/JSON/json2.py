import urllib.request, urllib.parse, urllib.error
import json


url=input('Enter location: ')
if len(url)<1:
    url = 'http://py4e-data.dr-chuck.net/comments_2069733.json'

print('Retrieving', url)
uh = urllib.request.urlopen(url)

data = uh.read()

print('Retrieved', len(data), 'characters')

info = json.loads(data)
nums = [comment['count'] for comment in info['comments']] 
print(sum(nums))
    
