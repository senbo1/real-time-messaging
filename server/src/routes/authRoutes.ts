import { Router } from 'express';
import passport from 'passport';
import { isAuth } from '../middleware/authmiddleware';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect(process.env.CLIENT_URL!);
});

router.get('/user', isAuth, (req, res) => {
  res.send(req.user);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      res.status(500).send('Error logging out');
    } else {
      res.send('Logged out');
    }
  });
});

export default router;
