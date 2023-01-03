let db = new Nedb({ filename: "Editedt"});
db.loadDatabase(async function (err) {
  db.insert({Date: await getDateFormatted(), value: await getPlayer(), today: new Date()})
});
db.find({}).sort({ createdAt: -1 }).exec(async function (err, docs) {
  var data = await sortArrayByDate(docs)
  var data = await data.slice(-20)
  const players = await document.getElementById("players");
  const playersChart = await new Chart(players,{
    type:"line",
    data:{
      labels: await data.map(row => row.Date),
      datasets:[{
        data: await data.map(row => row.value)
      }]
    }
  })
})


function getDateFormatted() {
  var now = new Date();
  var hour = (now.getHours() < 10 ? "0" + now.getHours() : now.getHours()) 
  var minutes = (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()) 
  var seconds = (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds()) 
  return hour + ":" + minutes + ":" + seconds;
}

async function getPlayer() {
  try {
    const response = await fetch(
      `https://api.mcstatus.io/v2/status/bedrock/mcpe.plutonium.best`
    );
    const data = await response.json();
    return data.players.online

  } catch (error) {
    console.error(error);
  }
}
function sortArrayByDate(array) {
  array.sort(function(a, b) {
    return new Date(a.today) - new Date(b.today);
  });
  return array;
}
