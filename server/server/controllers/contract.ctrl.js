/** */
const Contract = require('./../models/Contract')

module.exports = {
    getValue: (req, res, next) => {
        res.send(value);
        next();
        // Value.find({}).then
        // /*populate('following').exec*/((err, value)=> {
        //     if (err)
        //         res.send(err)
        //     else if (!value)
        //         res.send(404)
        //     else
        //         res.send(value)
        //     next()
        // })
    },
}