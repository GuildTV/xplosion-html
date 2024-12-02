export function handleUint(entry, setter, max = 999999) {
	try {
		const val = Number(entry.value)
		if (isNaN(val) || val > max || val < 0) {
			throw new Error(`Bad value for key: ${entry.key}`)
		}

		setter(val)
	} catch (e) {
		console.log(`Invalid ${entry.key} value: ${entry.value}`)
		console.log(e.stack)
	}
}

export function handleBool(entry, setter) {
	try {
		setter(entry.value === 'true' || entry.value === true)
	} catch (e) {
		console.log(`Invalid ${entry.key} value: ${entry.value}`)
		console.log(e.stack)
	}
}

export function handleEnum(entry, setter, options) {
	try {
		const val = entry.value
		if (!options.includes(val)) {
			throw new Error(`Bad value for key: ${entry.key}`)
		}

		setter(val)
	} catch (e) {
		console.log(`Invalid ${entry.key} value: ${entry.value}`)
		console.log(e.stack)
	}
}
