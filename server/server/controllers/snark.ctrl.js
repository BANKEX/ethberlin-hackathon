/** */
const Snark = require('./../models/Snark')

module.exports = {
    addSnark: (req, res, next) => {
        new Value(req.body).save((err, newSnark) => {
            if (err)
                res.send(err)
            else if (!newSnark)
                res.send(400)
            else
                res.send(newSnark)
            next()
        });
    },
    getSnark: (req, res, next) => {
        Value.findById(req.params.id).then
        /*populate('following').exec*/((err, snark)=> {
            if (err)
                res.send(err)
            else if (!snark)
                res.send(404)
            else
                res.send(snark)
            next()            
        })
    }
}