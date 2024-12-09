import { Texture, Vector3 } from "three";
import Collectable from "./Collectable";
import { bodyType } from "../../Utils/BodyTypes";

export default class GoldenApple extends Collectable {

  position: Vector3
  bodyType: number
  enchanted = false

  constructor(position = new Vector3(), type: number = bodyType.FIXED ) {
    super(position)

    this.position = position
    this.bodyType = type
    
    // this.init()
    this.texture = this.resources.items['golden-apple'] as Texture
    // console.log('golden apple type',type)
    this.build(type)

    this.on('collect',() => {
      // console.log('collect golden apple')
      if(this.game.world.player) {
        // this.game.world.player.life.points += 4
        const value = this.enchanted ? 16 : 4
        this.game.world.player.addEffect({ name: 'regeneration', value: value, damage: - 0.5 })
      }
    })

  }

}