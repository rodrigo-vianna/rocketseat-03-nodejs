import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe('Search Gyms (E2E)', () => {

	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to search for gyms', async () => {
		const { token } = await createAndAuthenticateUser(app)

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Gym Test',
				description: null,
				phone: null,
				latitude: -27.2092052,
				longitude: -49.6401091,
			})

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'One Gym',
				description: null,
				phone: null,
				latitude: -27.2092052,
				longitude: -49.6401091,
			})

		const response = await request(app.server)
			.get('/gyms/search')
			.query({
				q: 'One',
			})
			.set('Authorization', `Bearer ${token}`)
			.send()
			
		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms[0]).toEqual(expect.objectContaining({
			title: 'One Gym',
		}))
	})

})