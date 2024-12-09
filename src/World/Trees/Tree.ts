import { Vector3 } from "three";

export default class Tree {

  position: Vector3

  constructor({ position = new Vector3(0)}) {
    this.position = position
  }

  getBlockPosition(x = 0, y = 0, z= 0) {
    const p = this.position.clone()
    p.x += x
    p.y += y
    p.z += z
    return p
  }

}