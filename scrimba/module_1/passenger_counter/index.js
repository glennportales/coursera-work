//document.getElementById("count-el").innerText = 5

// let count = 0
// console.log(count)

// Initialize the count as 0
// Listen for clicks on the increment button
// increment the count variable when the button is clicked
// change the count-el in the html to reflect the new count


let countEl = document.getElementById("count-el")
let saveEl = document.getElementById("save-el")
let count = 0


function increment(){
    count += 1
   countEl.textContent = count
}
function save(){
    let saveCount = count + " - "
    saveEl.textContent += saveCount
}


