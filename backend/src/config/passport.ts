import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from '../models/User';
import { isMongoConnected } from './db';

export function configurePassport(): void {
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user as any);
    } catch (err) {
      done(err, null);
    }
  });

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            if (!isMongoConnected()) {
              done(new Error('Database is not connected. Please try again later.'), undefined);
              return;
            }

            let user: IUser | null = await User.findOne({ googleId: profile.id });

            if (!user) {
              user = await User.findOne({ email: profile.emails?.[0]?.value });

              if (user) {
                user.googleId = profile.id;
                user.avatar = profile.photos?.[0]?.value || user.avatar;
                await user.save();
              } else {
                user = await User.create({
                  googleId: profile.id,
                  name: profile.displayName,
                  email: profile.emails?.[0]?.value || `${profile.id}@google.com`,
                  avatar: profile.photos?.[0]?.value,
                });
              }
            }

            done(null, user as any);
          } catch (err) {
            done(err as Error, undefined);
          }
        }
      )
    );
  } else {
    console.warn('[Auth] Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
  }
}

export default configurePassport;
