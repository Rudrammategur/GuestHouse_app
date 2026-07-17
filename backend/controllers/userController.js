exports.getCurrentUser = (req, res) => {

    res.json(req.user);

};