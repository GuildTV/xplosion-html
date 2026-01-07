import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { loadState, saveState } from './state.js'
import { handleBool, handleEnum, handleUint } from './util.js'

const STATE_FILENAME = path.join(import.meta.dirname, 'storage/state.json')

let state = loadState(STATE_FILENAME)

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(express.static('dist'))

io.on('connection', (socket) => {
	console.log('a user connected')
	socket.emit('state', state)
})

app.get('/api/main', (req, res) => {
	res.json(state)
})

app.post('/api/main', express.json(), (req, res) => {
	let newState = { ...state }
	let triggers = {}

	try {
		console.log('got', req.body)

		for (const entry of req.body.Updates) {
			switch (entry.key) {
				case 'in':
					handleBool(entry, (v) => (newState.in = v))
					break

				case 'quarter':
					handleUint(entry, (v) => (newState.quarter = v), 4)
					break

				case 'scoreL':
					handleUint(entry, (v) => (newState.scoreL = v))
					break
				case 'scoreR':
					handleUint(entry, (v) => (newState.scoreR = v))
					break

				case 'timeoutsL':
					handleUint(entry, (v) => (newState.timeoutsL = v), 3)
					break
				case 'timeoutsR':
					handleUint(entry, (v) => (newState.timeoutsR = v), 3)
					break

				case 'possession':
					handleEnum(entry, (v) => (newState.possession = v), ['0', '1', '2'])
					break

				case 'flag':
					triggers.flag = '1'
					break

				case 'downs':
					handleUint(entry, (v) => (newState.downs = v))
					break
				case 'gains':
					newState.gains = entry.value + ''
					break

				case 'touchdown':
					triggers.touchdown = entry.value
					break

				case 'nameL':
					newState.nameL = entry.value + ''
					break
				case 'nameR':
					newState.nameR = entry.value + ''
					break

				case 'setsL':
					handleUint(entry, (v) => (newState.setsL = v))
					break
				case 'setsR':
					handleUint(entry, (v) => (newState.setsR = v))
					break

				default:
					console.log(`Unhandled update key ${entry.key}`)
					break
			}
		}
	} catch (error) {
		console.error('Bad input', error)
		res.send(500)
		return
	}

	console.log('new state', newState, triggers)

	state = newState
	io.emit('trigger', triggers)
	io.emit('state', state)
	saveState(STATE_FILENAME, state)
	res.json(state)
})

server.listen(3000, () => {
	console.log('server running at http://localhost:3000')
})
