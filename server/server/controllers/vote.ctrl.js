/** */
const Vote = require('./../models/Vote')

module.exports = {
    getVote: (req, res, next) => {
        Vote.findById(req.params.id).then
        /*populate('following').exec*/((err, value)=> {
            if (err)
                res.send(err)
            else if (!value)
                res.send(404)
            else
                res.send(value)
            next()            
        })
    },
    getAllVote:(req, res, next)=>{
        Vote.find({}).then
        /*populate('following').exec*/((err, value)=> {
            if (err)
                res.send(err)
            else if (!value)
                res.send(404)
            else
                res.send(value)
            next()
        })
    },
    checkVotes: (next) => {

        Vote.find({}, function(err, value) {
            if (err)
                console.log(err)
            else if (!value)
                console.log("null votes")
            else
            {
                var BreakException = {};
                try {
                    value.forEach(function (vote) {
                        if (vote.participants.length == vote.votes.length) {
                            var data = new Array();
                            vote.votes.forEach(function (element) {
                                data.push(element.answer);
                            });
                            next(data);
                        }
                    });
                }
                catch (e) {
                    if (e !== BreakException) throw e;
                }
            }
        })
    }

}