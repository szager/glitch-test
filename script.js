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
  return(color);

}


function tick() {
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if(orbeez.length < 400) {
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
        orbie.radius += (15 - orbie.radius) / 64;
        orbie.dx -= (lx / distance * (distance - 100)) * 2;
        orbie.dy -= (ly / distance * (distance - 100)) * 2;
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
        orbie.dx -= lx / distance * (distance - (orbie.radius + other_orbie.radius));
        orbie.dy -= ly / distance * (distance - (orbie.radius + other_orbie.radius));
      }
    });
  });
  
  orbeez.forEach(orbie => {
    orbie.dx_next = orbie.dx;
    orbie.dy_next = orbie.dy;
    orbie.squishe = 1;
      orbeez.forEach(other_orbie => {
      
      let lx = orbie.x - other_orbie.x;
      let ly = orbie.y - other_orbie.y;
      let distance = Math.hypot(lx, ly);
      if (distance < (orbie.radius + other_orbie.radius + 2) * 4 && orbie != other_orbie) {
        orbie.dx_next += other_orbie.dx * Math.max((1 + (.25/(orbie.radius + other_orbie.radius + 2)))/(distance + 1) - (.25/(orbie.radius + other_orbie.radius + 2)), 0) ;
        orbie.dy_next += other_orbie.dy * Math.max((1 + (.25/(orbie.radius + other_orbie.radius + 2)))/(distance + 1) - (.25/(orbie.radius + other_orbie.radius + 2)), 0) ;
        orbie.squishe += Math.max((1 + (.25/(orbie.radius + other_orbie.radius + 2)))/(distance + 1) - (.25/(orbie.radius + other_orbie.radius + 2)), 0);
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
    
    
  });
  
  requestAnimationFrame(tick);
}


alert("would not reccomend using on mobile")
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