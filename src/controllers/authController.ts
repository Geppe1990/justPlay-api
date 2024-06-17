import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

export const register = async (req: Request, res: Response) => {
	const { username, password } = req.body
	try {
		const user = new User({ username, password })
		await user.save()
		res.status(201).json({ message: 'User registered successfully' })
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ error: error.message })
		} else {
			res.status(500).json({ error: 'An unknown error occurred' })
		}
	}
}

export const login = async (req: Request, res: Response) => {
	const { username, password } = req.body
	try {
		const user = await User.findOne({ username })
		if (!user || !(await user.comparePassword(password))) {
			return res.status(401).json({ message: 'Invalid credentials' })
		}
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' })
		res.json({ token })
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ error: error.message })
		} else {
			res.status(500).json({ error: 'An unknown error occurred' })
		}
	}
}
