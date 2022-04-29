const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

var cursor_x = 0;
var cursor_y = 0;
var mouse_down = false;

class orbee {
  constructor () {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.dx = Math.random() * 20 - 10;
    this.dy = Math.random() * 20 - 10;
    this.dx_next = this.dx;
    this.dy_next = this.dy;
    this.squishe = 1;
    this.radius = 5;
  }
}


var orbeez = [new orbee()];

function tick() {
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if(orbeez.length < 100) {
    orbeez.push(new orbee());
  }
  
  orbeez.forEach(orbie => {
    orbie.dy += 1;
    orbie.dy *= 0.98;
    orbie.dx *= 0.98;
    
    
    if (mouse_down) {
      let lx = orbie.x - cursor_x;
      let ly = orbie.y - cursor_y;
      let distance = Math.hypot(lx, ly);
      if (distance < 100) {
        orbie.dx -= (lx / distance * (distance - 100)) / 3;
        orbie.dy -= (ly / distance * (distance - 100)) / 3;
      }
      //visual indication of cursor force
      ctx.beginPath();
      ctx.fillStyle = "#0f02";
      ctx.arc(cursor_x, cursor_y, 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
    
    //orbee-to-orbee interaction
    orbeez.forEach(other_orbie => {
      
      let lx = orbie.x - other_orbie.x;
      let ly = orbie.y - other_orbie.y;
      let distance = Math.hypot(lx, ly);
      if (distance < orbie.radius + other_orbie.radius && orbie != other_orbie) {
        orbie.dx -= (lx / distance * (distance - (orbie.radius + other_orbie.radius))) / 2;
        orbie.dy -= (ly / distance * (distance - (orbie.radius + other_orbie.radius))) / 2;
      }
    });
  });
  
  orbeez.forEach(orbie => {
      orbeez.forEach(other_orbie => {
      
      let lx = orbie.x - other_orbie.x;
      let ly = orbie.y - other_orbie.y;
      let distance = Math.hypot(lx, ly);
      if (distance < orbie.radius + other_orbie.radius && orbie != other_orbie) {
        orbie.dx -= (lx / distance * (distance - (orbie.radius + other_orbie.radius))) / 2;
        orbie.dy -= (ly / distance * (distance - (orbie.radius + other_orbie.radius))) / 2;
      }
    });
  });
  
  orbeez.forEach(orbie => {
    
    //wall collision
    if(orbie.y + orbie.dy > canvas.height) {
      orbie.y = canvas.height;
      orbie.dy *= -0.5;
      orbie.dx *= 0.8;
    }
    if(orbie.x + orbie.dx > canvas.width) {
      orbie.x = canvas.width;
      orbie.dx *= -0.5;
      orbie.dy *= 0.8;
    }
    if(orbie.x + orbie.dx < 0) {
      orbie.x = 0;
      orbie.dx *= -0.5;
      orbie.dy *= 0.8;
    }
    
    
    orbie.x += orbie.dx;
    orbie.y += orbie.dy;
    
    
    ctx.beginPath();
    ctx.arc(orbie.x, orbie.y, orbie.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    
    
  });
  
  requestAnimationFrame(tick);
}

tick();

document.addEventListener("mousemove", function (e) {
  cursor_x = e.clientX;
  cursor_y = e.clientY;
})
document.addEventListener("mousedown", function () {
  mouse_down = true;
})
document.addEventListener("mouseup", function () {
  mouse_down = false;
})