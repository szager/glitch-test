const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

class orbee {
  constructor() {
    this.x = Math.random * canvas.width;
    this.y = Math.random * canvas.height;
    this.dx = Math.random * 20 - 10;
    this.dy = Math.random * 20 - 10;
  }
}


ctx.fillStyle = "red";
var orbeez = [new orbee()];

function tick() {
  if(orbeez.length < 4) {
    orbeez.push(new orbee());
  }
  
  orbeez.forEach(orbie => {
    orbie.dy += 1;
    
    //wall collision
    if(orbie.y + orbie.dy > canvas.height) {
      orbie.y = canvas.height;
      orbie.dy *= -0.5;
    }
    if(orbie.x + orbie.dx > canvas.width) {
      orbie.x = canvas.width;
      orbie.dx *= -0.5;
    }
    if(orbie.x + orbie.dx < 0) {
      orbie.x = 0;
      orbie.dx *= -0.5;
    }
    
    
    orbie.x += orbie.dx;
    orbie.y += orbie.dy;
    
    
    ctx.beginPath();
    ctx.arc(orbie.x, orbie.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    
    
  });
  
  requestAnimationFrame(tick);
}

tick();