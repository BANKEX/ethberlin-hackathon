/** */
const Value = require('./../models/Value')

module.exports = {
    addValue: (req, res, next) => {
        var newValue = new Value(req.body);
        newValue.generateM();
        newValue.signing();
        newValue.save((err, newValue) => {
            if (err)
                res.send(err)
            else if (!newValue)
                res.send(400)
            else
                res.send(newValue)
            next()
        });
    },
    getValue: (req, res, next) => {
        Value.findById(req.params.id).then
        /*populate('following').exec*/((err, value)=> {
            if (err)
                res.send(err)
            else if (!value)
                res.send(404)
            else
                res.send(value)
            next()            
        })
    }
}