import re

fname = input('Enter file name: ')
if len(fname) < 1: fname = './regex_sum_2069728.txt'
fhand = open(fname)

sum = 0

for line in fhand :
    num_list = re.findall('\d+', line)
    if num_list:
        for num in num_list:
            sum += int(num)
    else:
        continue
    
print(sum)
