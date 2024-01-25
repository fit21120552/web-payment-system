const sessionModel = require('../models/session.m');
module.exports = {
  authentication: async (req, res, next) => {
    try {
     
      const sessionID =req.headers.sessionid||"null";
      const data = await sessionModel.GetOneSession(sessionID);
      if (data != undefined) {
        const parsedSession = JSON.parse(data.session);
        req.session.isAuthenticated = parsedSession.isAuthenticated || false;
        req.session.idUser = parsedSession.idUser;
        req.session.username = parsedSession.username;
        req.session.role = parsedSession.role
        req.session.cookie.maxAge = 60*60*1000;
      }
      if (req.session.isAuthenticated) {
        return next();
      }
      else {
        return res.redirect("/");
      }
    } catch (error) {
      next(error);
    }
  }
};