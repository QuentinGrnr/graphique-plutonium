const db = require('quick.db');

function getDateFormatted() {
  var now = new Date();
  var hour = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();

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

async function setdata(){
  setInterval( async () => {
    let nbr_player = await getPlayer()
    let date = getDateFormatted()
    let data;
    if (db.has("nbr_player")) {
      let list = await db.get("nbr_player")
      if (list.length > 288) {
        list.shift();
      }
      let element = {"Date": date, "Nombre_joueur": nbr_player}
      list.push(element);
      await db.set("nbr_player", list)
      data = db.get("nbr_player")
      console.log(data)
    } else {
      await db.set("nbr_player", [{"Date": date, "Nombre_joueur": nbr_player}])
      data = db.get("nbr_player")
      console.log(data)
    }
  }, 3000)
}
setdata()
export async function getdata() {
    await setdata()
    t = await db.get("nbr_player");
    return t
}