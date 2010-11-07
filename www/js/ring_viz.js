const HASHBASE = 160;
const COLORS = ["#57FB82", "#FF8959", "#7C9DFA", "#FF6EBF", // "Original" colors
                "#C0C0C0", "#808080", "#FF0000", "#800000", // 16 web colors
                "#FFFF00", "#808000", "#00FF00", "#008000",
                "#00FFFF", "#008080", "#0000FF", "#000080",
                "#FF00FF", "#800080"];

function hashmap_to_array(ring) {
  var ringarray = [];
  for (var hash in ring)
    ringarray.push({"hash": parseInt(hash), 
                    "name": ring[hash]});
  return ringarray;
}

function hash_to_rad(hash, base/*optional*/) {
  base = base || HASHBASE;
  return (hash / Math.pow(2, base)) * (2*Math.PI);
}

function decr(hash, base/*optional*/) {
  base = base || HASHBASE;
  newhash = hash - 1;
  return newhash >= 0 ? newhash : newhash + Math.pow(2, base);
}

function map_names(ring) {
  var names = [];
  ring.forEach(function(node) {
    if (names.indexOf(node["name"]) === -1)
      names.push(node["name"]);
  })
  return names.sort();
}

function draw_slice(c, name, begin, end, color) {
  // console.log([name, begin, end, color]);
  c.arc(250, 250, 200, begin, end)
   .paint({fillStyle: "transparent",
           strokeStyle: color,
           lineWidth: 30}).endPath();
}

function draw_legend(c, names) {
  names.forEach(function(name, i) {
    var x = 500;
    var y = 40;
    c.fillRect(x, y+30*i, 12, 12, {fillStyle: COLORS[i]})
     .fillText(name, x+20, y+11+30*i, {font: "12pt arial"});
  });
  c.fillText("0", 246, 28, {font: "12pt arial"});
}

function draw(c, ring) {
  var names = map_names(ring);
  for (var i = 0; i < ring.length; i++) {
    var name = ring[i]["name"];
    var color = COLORS[names.indexOf(name)];
    var begin = hash_to_rad(ring[i]["hash"]);
    var endindex = (i+1) % ring.length;
    var end = hash_to_rad((decr(ring[endindex]["hash"])));
    draw_slice(c, name, begin, end, color);
  }
  draw_legend(c, names);
}

function visualize(id, data) {
  var c = canto(id);
  // var ring = hashmap_to_array(fixture_1());
  var ring = hashmap_to_array(data);
  draw(c, ring);
}

////////////////////////////////////////////////////////////////////////////////

function fixture_1() {
  return {
                                                    "0": "nodeA",
      "91343852333181432387730302044767688728495783936": "nodeB",
     "182687704666362864775460604089535377456991567872": "nodeC",
     "274031556999544297163190906134303066185487351808": "nodeD",
     "365375409332725729550921208179070754913983135744": "nodeA",
     "456719261665907161938651510223838443642478919680": "nodeB",
     "548063113999088594326381812268606132370974703616": "nodeC",
     "639406966332270026714112114313373821099470487552": "nodeD",
     "730750818665451459101842416358141509827966271488": "nodeA",
     "822094670998632891489572718402909198556462055424": "nodeB",
     "913438523331814323877303020447676887284957839360": "nodeC",
    "1004782375664995756265033322492444576013453623296": "nodeD",
    "1096126227998177188652763624537212264741949407232": "nodeA",
    "1187470080331358621040493926581979953470445191168": "nodeB",
    "1278813932664540053428224228626747642198940975104": "nodeC",
    "1370157784997721485815954530671515330927436759040": "nodeD"
  };
}
