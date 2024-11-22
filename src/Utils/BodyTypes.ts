import RAPIER from "@dimforge/rapier3d"

interface BodyTypes {
  [type: string]: number
}

export const bodyType: BodyTypes = {
  'NONE': 0,
  'FIXED': 1,
  'DYNAMIC': 2,
}

export function getRigidBodyDesc(type = bodyType.NONE) {
  switch(type) {
    case bodyType.NONE:
      return null
    case bodyType.FIXED: 
      return RAPIER.RigidBodyDesc.fixed()
    case bodyType.DYNAMIC:
      return RAPIER.RigidBodyDesc.dynamic()
    default:
      return null
  }
}