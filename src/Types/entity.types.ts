import RAPIER from "@dimforge/rapier3d"
import { Mesh } from "three"

export interface Entity {
	body?: RAPIER.RigidBody
	mesh?: Mesh,
	collider?: RAPIER.Collider
}