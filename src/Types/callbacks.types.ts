
export type CollideArg = {
	handle1: number,
	handle2: number,
	started: boolean
}

export type InputsArg = boolean

export type CallbackArg = CollideArg | InputsArg | undefined