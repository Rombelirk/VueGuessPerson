import { User } from "../models/User";
import Question from "../models/Question";

export const getQuestions = async user => {
    let questions;
    if (user.player && user.player.currentGame && user.player.currentGame._id) {
        questions = await Question
            .find({ closed: false, whoAnswered: { $nin: [user._id] } })
            .where("loginOfAsker").ne(user.login);
    }
    else {
        questions = await Question.find({ closed: false, whoAnswered: { $nin: [user._id] } });
    }

    await Question.populate(questions, {
        path: 'person',
        model: 'Person'
    });

    return questions;
};

export const getUser = async userId => {
    const user = await User.findById(userId);
    await User.populate(user, {
        path: "player.currentGame",
        populate: [
            {
                path: 'currentQuestion',
                model: 'Question',
                select: ['text', 'answeredYes', 'answeredNo', 'answeredDontKnow']
            }, {
                path: "history",
                model: "Question",
                select: ['text', 'answeredYes', 'answeredNo', 'answeredDontKnow']
            }
        ]
    });

    return user;
};


