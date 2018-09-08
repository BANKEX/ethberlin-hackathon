require('./connector');
const user = require('./schema/user');
const userVotes = require('./schema/userVotes');
const vote = require('./schema/vote');
const takePartInVotes = require('./schema/takePartInVotes');

const User = {
    create: (userId, publicKey) => user.create({userId: userId, publicKey: publicKey}, (err, doc) => {}),
    get: async (userId) => await user.find({userId: userId}, (err, doc) => {}),
};

const Vote = {
    create: async (userId, name, participants, answers) => {
        const uVotes = await Vote.getByUserId(userId);
        if (uVotes.length == 1) {
            const votesIdArray = uVotes[0].votes;
            const allVotes = await Vote.getAll();
            const lastVoteId = allVotes[allVotes.length - 1].id;
            const newVoteId = Number(lastVoteId) + 1;
            votesIdArray.push(newVoteId)
            vote.create({id: newVoteId, name: name, participants: participants, answers: answers}, (err, doc) => {});
            userVotes.updateOne({userId: userId}, {votes: votesIdArray}, (err, doc) => {});
        } else {
            vote.create({id: 0, name: name, participants: participants, answers: answers}, (err, doc) => {});
            userVotes.create({userId: userId, votes: [0]}, (err, doc) => {});
        }
    },
    vote: async (userId, voteId, textVote) => {
        const userTakePart = await Vote.getByTakePartUserId(userId);
        const selectVote = Vote.getByVoteId(voteId);
        const votes = selectVote[0].votes;
        votes[userId] = textVote;
        if (userTakePart.length == 1)
            takePartInVotes.updateOne({userId: userId}, {votes: userTakePart[0].votes.push(selectVote[0].id)}, (err, doc) => {});
        else
            takePartInVotes.create({userId: userId, votes: [selectVote[0].id]}, (err, doc) => {});
        Vote.updateVote(userId, votes);
        if (Object.keys(selectVote[0].votes).length == Object.keys(selectVote[0].participants).length)
            vote.updateOne({id: voteId}, {end: true}, (err, doc) => {});
    },
    updateVote: (voteId, votes) => vote.updateOne({id: voteId}, {votes: votes}, (err, doc) => {}),
    getTakePart: async () => await takePartInVotes.find({}, (err, doc) => {}),
    getByTakePartUserId: async (userId) => await takePartInVotes.find({userId: userId}, (err, doc) => {}),
    getAll: async () => await vote.find({}, (err, doc) => {}),
    getByUserId: async (userId) => await userVotes.find({userId: userId}, (err, doc) => {}),
    getByVoteId: async (voteId) => await vote.find({id: voteId}, (err, doc) => {})
}

module.exports = {
    user: User,
    vote: Vote
}