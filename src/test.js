const data= [{Date:"1h", value:20},{Date:"1h", value:48},{Date:"2h", value:100},{Date:"3h", value:98},{Date:"4h", value:123},{Date:"5h", value:100},{Date:"6h", value:103},{Date:"7h", value:104},{Date:"8h", value:110}]
var  Datastore  = require('nedb') 
db = new Datastore({ filename: 'databas.db' });
db.loadDatabase(function (err) {
    db . insert ( [{Date:"1h", value:20},{Date:"1h", value:48},{Date:"2h", value:100},{Date:"3h", value:98},{Date:"4h", value:123},{Date:"5h", value:100},{Date:"6h", value:103},{Date:"7h", value:104},{Date:"8h", value:110}] , function ( err , newDocs ) {
} ) ;
    db.find({}, function (err, docs) {
        console.log(docs)
    });
});
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