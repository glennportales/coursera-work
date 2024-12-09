const map1 = new Map([
    ['key', 'value'],
    [true, true],
    [1, 1]
]);

console.log([...map1.keys()])

map1.forEach((value, key) => {
    console.log(key, value);
});

const user1 = {name: "john"}
const user2 = {name: "mary"}

const secreteKey1 = "asdkasdkasfdsafds"
const secreteKey2 = "dfgweahdfhadsfadsf"

const map2 = new Map([
    [user1, secreteKey1],
    [user2, secreteKey2]
]);
console.log(map2.get(user1));

const key = secreteKeyMap.get(user1);
console.log(key);

const userMap = new Map([
    ["name", "john"],
    ["verified", true]
]);