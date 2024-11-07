export type keyNames = 'right' | 'down'| 'left' | 'jump' | 'attack'

export interface input {
	name: keyNames
	keys: string[]
}

export type inputMap = Array<input>

export type keys = {
	[key in keyNames]: boolean
}