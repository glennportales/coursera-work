const songs = [
    {song: "Shape of You", timesStreamed: 2.384, wonGrammy: true},
    {song: "One Dance", timesStreamed: 1.791, wonGrammy: false},
    {song: "Rockstar", timesStreamed: 1.781	, wonGrammy: false},
    {song: "Closer", timesStreamed: 1.688, wonGrammy: false},
    {song: "Thinking Out Loud", timesStreamed: 1.461, wonGrammy: true}
]

const hasWonGrammy = songs.some(song => song.wonGrammy);
console.log(hasWonGrammy);

const allMegaHits = songs.every(song => song.timesStreamed > 1.5);
console.log(allMegaHits);


const temperatures = [
    { degrees: 69, isRecordTemp: false },
    { degrees: 82, isRecordTemp: true },
    { degrees: 73, isRecordTemp: false },
    { degrees: 64, isRecordTemp: false }
  ];
//map transforms the entire array. The result is an array of the exact length.  
  const newTemps = temperatures.map(temperature => 
  temperature.degrees > 70 ? { ...temperature, isHigh: true } : temperature 
  );
  // for each is different from map. It does not return a new array. It returns undefined. It only iterates over a given array, allowing us to view the values inside of it. 
  newTemps.forEach(temperature => {
     if (temperature.isHigh) {
       console.log(`Temperature ${temperature.degrees} was a record high last week!`);  
     }
  })
  

