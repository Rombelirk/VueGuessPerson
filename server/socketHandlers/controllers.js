
import { User } from "../models/User";
import Question from "../models/Question";

export const getQuestions = async user => {
    let questions;
    if (user.player && user.player.currentGame && user.player.currentGame._id) {
        questions = await Question.find({ closed: false, whoAnswered: { $nin: [user._id] } }).where("game").ne(user.player.currentGame._id);
    } else {
        questions = await Question.find({ closed: false, whoAnswered: { $nin: [user._id] } });
    }
    await Question.populate(questions, {
        path: 'person',
        model: 'Person'
    });
    return questions;
}

export const getUser = async userId => {
    const user = await User.findById(userId);
    await User.populate(user, {
        path: "player.currentGame",
        populate: [
            {
                path: 'currentQuestion',
                model: 'Question',
                select: ['text', 'answeredYes', 'answeredNo']
            }, {
                path: "history",
                model: "Question",
                select: ['text', 'answeredYes', 'answeredNo']
            }
        ]
    });
    return user;
}


