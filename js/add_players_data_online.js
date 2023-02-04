//note = pour simplifier la chose => creer un tableau avec tout les ip qui doivent etre dans le graphique
const sqlite3 = require('sqlite3')
const fetch = require('node-fetch');
const { text } = require('express');

let db = new sqlite3.Database('players_online.sqlite', err => {
  console.log(err)
    if (err) throw err
    console.log('data base "player_online.sqlite" bien active')
  })

async function add_serveur_api(name,ip,couleur){
  db.run('CREATE TABLE IF NOT EXISTS serveur_api(id INTEGER PRIMARY KEY AUTOINCREMENT,name VARCHAR, ip VARCHAR,couleur VARCHAR)')
  db.all('SELECT * FROM serveur_api', async (err, data) => {
    validator = 0
    for (let i = 0; i < data.length; i++) {
      if(data[i].ip === ip) {
        console.log("Cette ip est déjà en place dans l'api")
        validator = 1
      }
    }
    if(validator==0){
      db.run('INSERT INTO serveur_api(name,ip,couleur) VALUES(?,?,?)', [name, ip,couleur]);
      db.run('CREATE TABLE ' + name + '_players_online(id INTEGER PRIMARY KEY AUTOINCREMENT,hour VARCHAR, players BLOB)')
      db.all('SELECT * FROM serveur_api', async (err, data) => {
      })
    }
    else {
      return 0 
    }
  })
}
add_serveur_api("plutonium","mcpe.plutonium.best","#6B39C7")
add_serveur_api("histeria","play.histeria.fr","#1A9550")
add_serveur_api("linesia","play.linesia.eu","#175EB1")
add_serveur_api("Vazo","vazo.mcpe.eu","#E24343")
add_serveur_api("Endiorite","play.endiorite.com","#E2AB43")
add_serveur_api("Futonium","play.futonium.fr","#E243DD")


async function getdata_ip(){
  let minute = new Date().getMinutes();
if (minute % 5 === 0) {
  db.all('SELECT * FROM serveur_api', async (err, data) => {
    for (let i = 0; i < data.length; i++) {
      await add_players_data(data[i].name,data[i].ip)
    }
  })
  setInterval(() => {
    db.all('SELECT * FROM serveur_api', async (err, data) => {
      for (let i = 0; i < data.length; i++) {
        await add_players_data(data[i].name,data[i].ip)
      }
    })
  }, 300000);
} else {
  setTimeout(getdata_ip,30000)
}
}


async function add_players_data(name,ip){
    await fetch(
      `https://api.mcstatus.io/v2/status/bedrock/` + ip)
      .then(res => res.json())
      .then( async (text) => {
        if(text.online == true){
          db.all('SELECT COUNT(*) FROM  ' + name + '_players_online', async (err, data1) => {
            if (err) {
                console.log(err)
            } else {
                let count = data1[0]['COUNT(*)'];
                if (count < 288){
                  db.run('INSERT INTO ' + name + '_players_online(hour,players) VALUES(?,?)', [ await getDateFormatted(), text.players.online]);
                  db.all('SELECT * FROM ' + name + '_players_online', (err, data) => {
                    console.log(data)
                    if (err)
                      throw err
                  })
                }else{
                  db.run('DELETE FROM ' + name + '_players_online WHERE id = (SELECT MIN(id) FROM ' + name + '_players_online)')
                  db.run('INSERT INTO ' + name + '_players_online(hour,players) VALUES(?,?)', [ await getDateFormatted(), text.players.online]);
                  db.all('SELECT * FROM ' + name + '_players_online', (err, data) => {
                    console.log(data)
                    if (err)
                      throw err
                  })
                }
        }
      });
        }
        else{
          db.all('SELECT COUNT(*) FROM  ' + name + '_players_online', async (err, data1) => {
            if (err) {
                console.log(err)
            } else {
                let count = data1[0]['COUNT(*)'];
                if (count < 288){
                  db.run('INSERT INTO ' + name + '_players_online(hour,players) VALUES(?,?)', [ await getDateFormatted(), 0]);
                  db.all('SELECT * FROM ' + name + '_players_online', (err, data) => {
                    console.log(data)
                    if (err)
                      throw err
                  })
                }else{
                  db.run('DELETE FROM ' + name + '_players_online WHERE id = (SELECT MIN(id) FROM ' + name + '_players_online)')
                  db.run('INSERT INTO ' + name + '_players_online(hour,players) VALUES(?,?)', [ await getDateFormatted(), 0]);
                  db.all('SELECT * FROM ' + name + '_players_online', (err, data) => {
                    console.log(data)
                    if (err)
                      throw err
                  })
                }
        }
      });
        }
    })
}

function getDateFormatted() {
  var now = new Date();
  var hour = (now.getHours() < 10 ? "0" + now.getHours() : now.getHours())
  var minutes = (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes())
  return hour + ":" + minutes;
}

getdata_ip()