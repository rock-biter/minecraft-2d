import { TpChangeEvent } from "tweakpane"

export type CollideArg = {
	handle1: number,
	handle2: number,
	started: boolean
}

export type InputsArg = boolean

export type PaneArgs = TpChangeEvent<string>

export type CallbackArg = CollideArg | InputsArg | PaneArgs | undefined