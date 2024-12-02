import fs from 'fs'

const DEFAULT_STATE = {
	in: true,

	quarter: 0,

	scoreL: 0,
	scoreR: 0,

	timeoutsL: 0,
	timeoutsR: 0,

	possession: '0', // '0', '1', '2'

	downs: 0,
	gains: '',

	nameL: 'Team L',
	nameR: 'Team R',

	setsL: 0,
	setsR: 0,
}

export function loadState(filename) {
	try {
		const data = fs.readFileSync(filename)
		return {
			...DEFAULT_STATE,
			...JSON.parse(data),
		}
	} catch (e) {
		console.log('Error loading state:', e)
		return { ...DEFAULT_STATE }
	}
}

export function saveState(filename, state) {
	try {
		fs.writeFileSync(filename, JSON.stringify(state, undefined, '\t'))
	} catch (e) {
		console.log('Error saving state:', e)
	}
}
