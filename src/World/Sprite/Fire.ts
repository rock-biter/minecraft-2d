import { MeshBasicMaterial, ShaderMaterial, Vector3 } from "three";
import Sprite from "./Sprite";

export default class Fire extends Sprite {
  constructor({ position = new Vector3(), width = 1, height = 1}) {
    super({ position, width, height })

    console.log('fire!!')
  }

  get material(): MeshBasicMaterial | ShaderMaterial {
    return this.game.world.materials.fireMaterial
  }
}