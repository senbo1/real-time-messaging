import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import { db } from '../drizzle/db';
import { usersTable } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const GoogleStrategy = passportGoogle.Strategy;

declare global {
  namespace Express {
    interface User {
      id?: string;
    }
  }
}

passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/redirect',
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.googleId, profile.id));

      if (user.length === 0) {
        const newUser = await db
          .insert(usersTable)
          .values({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails![0].value,
            profilePicture: profile.photos![0].value,
          })
          .returning({
            id: usersTable.id,
          });

        done(null, newUser[0]);
      } else {
        done(null, user[0]);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await db.select().from(usersTable).where(eq(usersTable.id, id));
  done(null, user[0]);
});
