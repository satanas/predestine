class Collision {

  isRect(obj) {
    return (obj.bounds && Object.keys(obj.bounds).length === 4);
  }

  /**
   * Check if a vector is inside an object (Rectangle)
   * @return True if the vector collides with the rectangle. False otherwise
   */
  vector(v, obj) {
    // FIXME: Dirty hack to improve performance
    if (!$.cam.inView(obj)) return false;
    if (!this.isRect(obj)) return false;
    return (v.x < obj.bounds.right && v.x > obj.bounds.left &&
            v.y < obj.bounds.bottom && v.y > obj.bounds.top);
  }

  /**
   * Check for collisions of an object against any element of a group
   * @return An array of objects that collided with `obj1` or an empty array is there were no collisions
   */
  group(obj1, group) {
    let obj2, result = [];
    for(obj2 in group.all()) {
      if (this.between(obj1, obj2)) result.push(obj2);
    }
    return result;
  }

  between(obj1, obj2) {
    // FIXME: Dirty hack to improve performance
    if (!$.cam.inView(obj2)) return false;
    if (!this.isRect(obj1) || !this.isRect(obj2)) return false;
    return (obj1.bounds.left < obj2.bounds.right &&
            obj1.bounds.left > obj2.bounds.left &&
            obj1.bounds.top < obj2.bounds.bottom &&
            obj1.bounds.bottom > obj2.bounds.top);
  }

  faces(obj1, obj2) {
    return new Bounds(
      abs(obj1.bounds.bottom - obj2.bounds.top),
      abs(obj1.bounds.top - obj2.bounds.bottom),
      abs(obj1.bounds.right - obj2.bounds.left),
      abs(obj1.bounds.left - obj2.bounds.right)
    );
  }

  bottom(obj1, obj2) {
    let faces = this.faces(obj1, obj2);
    return (faces.top < faces.bottom && faces.top < faces.left && faces.top < faces.right);
  }

  top(obj1, obj2) {
    let faces = this.faces(obj1, obj2);
    return (faces.bottom < faces.top && faces.bottom < faces.left && faces.bottom < faces.right);
  }

  right(obj1, obj2) {
    let faces = this.faces(obj1, obj2);
    return (faces.left < faces.bottom && faces.left < faces.top && faces.left < faces.right);
  }

  left(obj1, obj2) {
    let faces = this.faces(obj1, obj2);
    return (faces.right < faces.bottom && faces.right < faces.left && faces.right < faces.top);
  }

}
