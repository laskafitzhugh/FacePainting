//path to draw circles on
class Path {
  constructor(w, h) {
    this.circles = [];
    this.width = w;
    this.height = h;
    this.color = [random(255), random(255), random(255)]; //go back and make color of circle
  }
  add(pW, pH, position, force) {
    // Add a new circle with a position, force, and color
    this.circles.push(new Circle(pW, pH, position, force, this.color));
  }
  
  // Display path
  update() {  
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].update();
    }
  }  
  
  // Display plath
  display() {    
    // Loop through backwards
    for (let i = this.circles.length - 1; i >= 0; i--) {
      // If we shold remove it
      if (this.circles[i].lifespan <= 0) {
        this.circles.splice(i, 1);
      // Otherwise, display it
      } else {
        this.circles[i].display(this.circles[i+1]);
      }
    }
  }
}

// Circles along the path
class Circle {
  constructor(w, h, position, force, color) {
    this.width = w;
    this.height = h;
    this.position = createVector(position.x, position.y);
    this.velocity = createVector(force.x, force.y);
    this.drag = 0.95;
    this.lifespan = 255;
    this.color = color;
  }

  update() {
    // Move it
    this.position.add(this.velocity);
    // Slow it down
    this.velocity.mult(this.drag);
    // Fade it out
    this.lifespan--;
  }

  // Draw circles
  display(other) {
    stroke(0, this.lifespan);
    fill(this.color, this.lifespan/2);    
    ellipse(this.position.x,this.position.y, this.width, this.height);    
  }
}
