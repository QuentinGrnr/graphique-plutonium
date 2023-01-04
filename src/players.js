let db = new Nedb({ filename: "PlayerOnlinePlutonium"});
db.loadDatabase(async function (err) {
  db.insert({Date: await getDateFormatted(), value: await getPlayer(), today: new Date()})
});
db.find({}).sort({ createdAt: -1 }).exec(async function (err, docs) {
  var data = await sortArrayByDate(docs)
  var data = await data.slice(-1000)
  const players = await document.getElementById("players");
  const playersChart = await new Chart(players,{
    type:"line",
    options: {
      scales: {
        y: {
          ticks: { color: 'rgb(184,184,189)'},
          beginAtZero: true
        },
        x: {
          ticks: { color: 'rgba(184,184,189,0)'}
        }
      },
      animation: true,
      plugins: {
        legend: {
          display: false
        },
      }
    },
    data:{
      labels: await data.map(row => row.Date),
      datasets:[{
        data: await data.map(row => row.value),
        borderColor: 'rgb(94,88,229)',
        tension: 0.1,
        pointBackgroundColor : 'rgba(94,88,229,0)',
        pointBorderColor : 'rgba(94,88,229,0)',
        pointHoverBorderColor : 'rgb(94,88,229)',
        spanGaps :true
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
