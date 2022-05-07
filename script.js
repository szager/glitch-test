const max_orbeez = (3 * 150) + 1;
const optimized = true;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

var cursor_enabled = false;
var cursor_radius = 50;
var cursor_x = 0;
var cursor_y = 0
var center_x = 0;
var center_y = 0;
var distances = [];
if (optimized) {
  for (let i = 0; i < max_orbeez; i++) {
    let arr = [];
    distances.push(arr);
    for (let j = 0; j < max_orbeez; j++)
      arr.push(0);
  }
}

class orbee {
  constructor () {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.dx = Math.random() * 20 - 10;
    this.dy = Math.random() * 20 - 10;
    this.dx_next = this.dx;
    this.dy_next = this.dy;
    this.squishe = 1;
    this.radius = 3;
    this.color = make_color();
  }
}

var orbeez = [new orbee()];

function make_color() {
  let color = '#';
  let letters = '0123456789ABCDEF';
  color += letters[Math.round(Math.random() * 16)];
  color += letters[Math.round(Math.random() * 16)];
  color += letters[Math.round(Math.random() * 16)];
  color += letters[Math.round(Math.random() * 16)];
  color += letters[Math.round(Math.random() * 16)];
  color += letters[Math.round(Math.random() * 16)];
  return(color);
}

function expand(radius) {
  return radius + ((10 - radius) / 64);  
}

function tick() {  
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0008";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  if(orbeez.length < max_orbeez) {
    orbeez.push(new orbee());
    orbeez.push(new orbee());
    orbeez.push(new orbee());
  }

  if (optimized) {
    for (let i = 0; i < orbeez.length; i++) {
      let o1 = orbeez[i];
      let arr = distances[i];
      for (let j = 0; j < orbeez.length; j++) {
        if (j > i) {
          let o2 = orbeez[j];
          let limit = (expand(o1.radius) + expand(o2.radius) + 2) * 4;
          if (Math.abs(o2.x - o1.x) < limit && Math.abs(o2.y - o1.y) < limit)
            arr[j] = Math.hypot(o2.x - o1.x, o2.y - o1.y);
        } else {
          arr[j] = distances[j][i];
        }
      }
    }
  }
  
  for (let i = 0; i < orbeez.length; i++) {
    let orbie = orbeez[i];
    // gravity
    let dx = center_x - orbie.x;
    let dy = center_y - orbie.y;
    let d = Math.hypot(dx, dy);
    dx = (dx*Math.abs(dx)) / (d*d);
    dy = (dy*Math.abs(dy)) / (d*d);
    orbie.dx += dx;
    orbie.dy += dy;
    orbie.dy *= 0.98;
    orbie.dx *= 0.98;

    // cursor force
    if (cursor_enabled) {
      let lx = orbie.x - cursor_x;
      let ly = orbie.y - cursor_y;
      let distance = Math.hypot(lx, ly);
      if (distance < cursor_radius) {
        orbie.radius = expand(orbie.radius);
        orbie.dx -= (lx / distance * (distance - cursor_radius)) * 2;
        orbie.dy -= (ly / distance * (distance - cursor_radius)) * 2;
      }
    }
    //visual indication of cursor force
    //ctx.beginPath();
    //ctx.fillStyle = "#0f02";
    //ctx.arc(cursor_x, cursor_y, 90, 0, Math.PI * 2);
    //ctx.fill();
    //ctx.closePath();
    
    //orbee-to-orbee interaction
    let arr = optimized ? distances[i] : null;
    for (let j = 0; j < orbeez.length; j++) {
      if (i == j)
        continue;
      let other_orbie = orbeez[j];
      let rsum = orbie.radius + other_orbie.radius;
      if (Math.abs(other_orbie.x - orbie.x) >= rsum || Math.abs(other_orbie.y - orbie.y) >= rsum)
        continue;
      let distance = optimized ? arr[j] : Math.hypot(other_orbie.x - orbie.x, other_orbie.y - orbie.y);
      if (distance < rsum) {
        let lx = orbie.x - other_orbie.x;
        let ly = orbie.y - other_orbie.y;
        orbie.dx -= lx / distance * (distance - rsum);
        orbie.dy -= ly / distance * (distance - rsum);
      }
    }
  }

  for (let i = 0; i < orbeez.length; i++) {
    let orbie = orbeez[i];
    let arr = optimized ? distances[i] : null;
    orbie.dx_next = orbie.dx;
    orbie.dy_next = orbie.dy;
    orbie.squishe = 1;
    for (let j = 0; j < orbeez.length; j++) {
      if (i == j)
        continue;
      let other_orbie = orbeez[j];
      let r = orbie.radius;
      let or = other_orbie.radius;
      let limit = (r + or + 2) * 4;
      if (Math.abs(other_orbie.x - orbie.x) >= limit || Math.abs(other_orbie.y - orbie.y) >= limit)
        continue;
      let distance = optimized ? arr[j] : Math.hypot(other_orbie.x - orbie.x, other_orbie.y - orbie.y);
      if (distance < limit) {
        let weight = Math.max((1 + (.25/(r + or + 2)))/(distance + 1) - (.25/(r + or + 2)), 0);
        orbie.dx_next += other_orbie.dx * weight;
        orbie.dy_next += other_orbie.dy * weight;
        orbie.squishe += weight;
      }
    }
  }
  
  orbeez.forEach(orbie => {
    orbie.dy = orbie.dy_next / orbie.squishe;
    orbie.dx = orbie.dx_next / orbie.squishe;
    //wall collision
    if(orbie.y + orbie.dy > canvas.height - orbie.radius) {
      orbie.y = canvas.height - orbie.radius;
      orbie.dy *= -0.5;
      orbie.dx *= 0.8;
    }
    if(orbie.x + orbie.dx > canvas.width - orbie.radius) {
      orbie.x = canvas.width - orbie.radius;
      orbie.dx *= -0.5;
      orbie.dy *= 0.8;
    }
    if(orbie.x + orbie.dx < orbie.radius) {
      orbie.x = orbie.radius;
      orbie.dx *= -0.5;
      orbie.dy *= 0.8;
    }
    
    
    orbie.x += orbie.dx;
    orbie.y += orbie.dy;
    
    
    ctx.beginPath();
    ctx.arc(orbie.x, orbie.y, orbie.radius, 0, Math.PI * 2);
    ctx.fillStyle = orbie.color;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(orbie.x - (orbie.radius/4), orbie.y - (orbie.radius/4), orbie.radius/4, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
    
    
  });
  
  requestAnimationFrame(tick);
}

onload = () => {
  let w = parseInt(getComputedStyle(canvas).width.replace("px", ""));
  let h = parseInt(getComputedStyle(canvas).height.replace("px", ""));
  canvas.width = w;
  canvas.height = h;
  center_x = Math.round(w/2);
  center_y = Math.round(h/2);
  tick();  
}

document.addEventListener("mousemove", e => {
  console.log("mousemove");
  cursor_enabled = true;
  cursor_x = e.clientX;
  cursor_y = e.clientY;
});
document.addEventListener("mousedown", e => {
  console.log("mousedown");
  cursor_enabled = true;
  cursor_radius = 100;
});
document.addEventListener("mouseup", e => {
  console.log("mouseup");
  cursor_enabled = true;
  cursor_radius = 50;
});
document.addEventListener("touchstart", e => {
  console.log("touchstart");
  cursor_enabled = true;
  cursor_radius = 50;
});
document.addEventListener("touchmove", e => {
  console.log("touchmove");
  cursor_x = e.clientX;
  cursor_y = e.clientY;
});
document.addEventListener("touchend", e => {
  console.log("touchend");
  cursor_enabled = false;
});