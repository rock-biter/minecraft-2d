import { Vector3 } from "three";
import Block, { BlockProps } from "./Block";

export default class Grass extends Block {
  constructor({ position = new Vector3(), r, g, b, depth }: BlockProps) {

    super({position, r,g,b,depth})

    console.log('this is grass')

    // edit top and bottom face texture
  }
}