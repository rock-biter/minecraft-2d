import { Texture, Vector3 } from "three";
import Collectable from "./Collectable";
import { bodyType } from "../../Utils/BodyTypes";

export default class Diamond extends Collectable {

  position: Vector3
  bodyType: number

  constructor(position = new Vector3(), type: number = bodyType.FIXED ) {
    super(position)

    this.position = position
    this.bodyType = type
    
    // this.init()
    this.texture = this.resources.items['diamond'] as Texture
    this.build(type)

    this.on('collect',() => {
      console.log('collect diamond')
    })

  }

}