const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

var cursor_x = 0;
var cursor_y = 0
var cursor_radius = 50;
var center_x = 0;
var center_y = 0;
var distances = [];
for (let i = 0; i < max_orbeez; i++) {
  let arr = [];
  distances.push(arr);
  for (let j = 0; j < max_orbeez; j++)
    arr.push(0);
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


function tick() {
  
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0008";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  if(orbeez.length < 500) {
    orbeez.push(new orbee());
    orbeez.push(new orbee());
    orbeez.push(new orbee());
  }

  for (let i = 0; i < orbeez.length; i++) {
    const o1 = orbeez[i];
    const arr = distances[i];
    for (let j = 0; j < orbeez.length; j++) {
      if (i == j)
        continue;
      const o2 = orbeez[j];
      arr[j] = Math.hypot(o2.x - o1.x, o2.y - o1.y);
    }
  }
  orbeez.forEach(orbie => {
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
    let lx = orbie.x - cursor_x;
    let ly = orbie.y - cursor_y;
    let distance = Math.hypot(lx, ly);
    if (distance < cursor_radius) {
      orbie.radius += (10 - orbie.radius) / 64;
      orbie.dx -= (lx / distance * (distance - cursor_radius)) * 2;
      orbie.dy -= (ly / distance * (distance - cursor_radius)) * 2;
    }

    //visual indication of cursor force
    //ctx.beginPath();
    //ctx.fillStyle = "#0f02";
    //ctx.arc(cursor_x, cursor_y, 90, 0, Math.PI * 2);
    //ctx.fill();
    //ctx.closePath();
    
    //orbee-to-orbee interaction
    orbeez.forEach(other_orbie => {
      if (orbie === other_orbie)
        return;
      const lx = orbie.x - other_orbie.x;
      const ly = orbie.y - other_orbie.y;
      const rsum = orbie.radius + other_orbie.radius;
      if (lx >= rsum || ly >= rsum)
        return;
      let distance = Math.hypot(lx, ly);
      if (distance < rsum) {
        orbie.dx -= lx / distance * (distance - rsum);
        orbie.dy -= ly / distance * (distance - rsum);
      }
    });
  });
  
  orbeez.forEach(orbie => {
    orbie.dx_next = orbie.dx;
    orbie.dy_next = orbie.dy;
    orbie.squishe = 1;
    orbeez.forEach(other_orbie => {
      if (orbie == other_orbie)
        return;
      const lx = orbie.x - other_orbie.x;
      const ly = orbie.y - other_orbie.y;
      const r = orbie.radius;
      const or = other_orbie.radius;
      const lim = (r + or + 2) * 4;
      if (lx >= lim || ly >= lim)
        return;
      const distance = Math.hypot(lx, ly);
      if (distance < lim) {
        let weight = Math.max((1 + (.25/(r + or + 2)))/(distance + 1) - (.25/(r + or + 2)), 0);
        orbie.dx_next += other_orbie.dx * weight;
        orbie.dy_next += other_orbie.dy * weight;
        orbie.squishe += weight;
      }
    });
  });
  
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

document.addEventListener("pointermove", function (e) {
  cursor_x = e.clientX;
  cursor_y = e.clientY;
})
document.addEventListener("pointerdown", function () {
  cursor_radius = 100;
})
document.addEventListener("pointerup", function () {
  cursor_radius = 50;
})