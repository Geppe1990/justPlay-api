import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import User, { IUser } from '../models/User'
import { Request } from 'express'

const opts: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET || 'secret',
	passReqToCallback: false // Modifica questo valore a seconda se hai bisogno di passare req a callback
}

passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
	try {
		const user = await User.findById(jwtPayload.id)
		if (user) {
			return done(null, user)
		}
		return done(null, false)
	} catch (err) {
		return done(err, false)
	}
}))

export default passport
