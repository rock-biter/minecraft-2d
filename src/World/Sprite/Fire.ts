import { MeshBasicMaterial, ShaderMaterial, Vector3 } from "three";
import Sprite from "./Sprite";
import { PaneArgs } from "../../Types/callbacks.types";
import ENUMS from "../../Utils/Enums";

export default class Fire extends Sprite {

  debugMaterial = new MeshBasicMaterial({ color: 0xff9900, wireframe: true})

  constructor({ position = new Vector3(), width = 1, height = 1}) {
    super({ position, width, height })

    console.log('fire!!')

    this.entity!.mesh!.renderOrder = 7

    if(this.debug.active) {
      this.debug.on('texturePackChange',(e) => {
        const event = e as PaneArgs
        this.entity.mesh!.material = event.value === ENUMS.TEXTURE_MINECRAFT_TRAILER ? this.material : this.debugMaterial
      })
    }
  }

  get material(): MeshBasicMaterial | ShaderMaterial {
    if(this.debug.active && (this.debug.params.texturePack === ENUMS.TEXTURE_PLACEHOLDER)) {
      return this.debugMaterial
    }
    return this.game.world.materials.fireMaterial
  }
}