exports.isUserLoggedIn = async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  next();
};

exports.isAdminLoggedIn = async (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/");
  }
  next();
};
