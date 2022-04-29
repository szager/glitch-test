function make_color() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  //let an_integer = Math.floor(Math.random() * 6);
  var a = function () {color += "0";},
    b = function () {color += "f";},
    c = function () {color += letters[Math.round(Math.random() * 16)];},
    array = [a, b, c];

  array = array.map(function (a, i, o) {
    var j = (Math.random() * (o.length - i) | 0) + i,
        t = o[j];
    o[j] = a;
    return t;
  });

  array.forEach(function (a) { a(); });

  //let blue = Math.random() * 16;
  //let green = Math.random() * (16 - blue) + blue;
  //let red = Math.random() * blue;
  //color += letters[Math.round(red)];
  //color += letters[Math.round(green)];
  //color += letters[Math.round(blue)];
  return color;
}
alert("w");
var idk = 1;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var things = [];
function moveEach() {
  things.forEach(idklmao => move(idklmao));
}
function drawparticle(object) {
  ctx.beginPath();
  ctx.arc(object[0], object[1], object[2], 0, Math.PI * 2);
  ctx.fillStyle=object[8];
  ctx.fill();
  ctx.closePath();
 }
function tick() {
 if(things.length < 200) {
   addcircle();
 }
 ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle="gray";
 ctx.fillRect(490, 0, 20, 100);
 ctx.fillRect(200, 200, 200, 10);
 things.forEach(idklmao => drawparticle(idklmao));
 things.forEach(idklmao => update(idklmao));

 moveEach();
 requestAnimationFrame(tick);
}
function collision(a,b) {
 let dx = a[0] - b[0];
 let dy = a[1] - b[1];
 let d = Math.sqrt(dy * dy + dx * dx);
 let idklmao = a[2] + b[2] + 1;

  if(d > 0 && d < idklmao) {
   a[5] -= (dx * (d - idklmao) / d) / 2;
   a[6] -= (dy * (d - idklmao) / d) / 2;
 }
 }
function update(object) {
 object[4] += .5;
 object[4] *= .95;
 object[3] *= .95;
 object[3] += Math.random() / 2 - .25;
 object[4] += Math.random() / 2 - .25;
 object[5] = object[3];
 object[6] = object[4];

 things.forEach(thing => collision(object,thing));
 object[3] = object[5];
 object[4] = object[6];
}
function move(object) {
 if(object[4] + object[1] > canvas.height - object[2]) {
  object[4] *= -.5;
  object[1] = canvas.height - object[2];
  object[3] *= .5;
 }
  
 if(object[3] + object[0] > canvas.width - object[2]) {
  object[3] *= -.5;
  object[0] = canvas.width - object[2];
  object[4] *= .5;
 }
if(object[3] + object[0] < object[2]) {
  object[3] *= -.5;
  object[0] = object[2];
  object[4] *= .5;
 }
if(object[4] + object[1] < object[2]) {
  object[4] *= -.5;
  object[1] = object[2];
  object[3] *= .5;
 }
 object[0] += object[3];
 object[1] += object[4];
}
function addcircle() {
  things.push([ Math.random() * canvas.width, Math.random() * canvas.height, 5,Math.random() * 5 - 2.5,Math.random() * 5 + 5, 0, 0, 0, make_color()]);
}
document.addEventListener("click", function(e) {
  let thing = [e.clientX, e.clientY, 200];
  things.forEach(object => {
   collision(object,thing);
   object[2] = 10;
   object[3] = object[5];
   object[4] = object[6];
  });
  
});
tick();