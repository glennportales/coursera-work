fname = input('Enter file name: ')
if len(fname) < 1: fname = 'mbox-short.txt'
fhand = open(fname)
many = dict()

for line in fhand :
    if not line.startswith("From "):
        continue
    wds=line.rstrip().split()
    time = wds[5]
    hour, minute, second = time.split(":")
    many[hour] = many.get(hour, 0)+1
    

newlist =list()
for k, v in many.items():
    tup = (k,v)
    newlist.append(tup)
    
cool = sorted(newlist)

for k,v in cool :
    print(k,v)  # print the key and value
    
    
