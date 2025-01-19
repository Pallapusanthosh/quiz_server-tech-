const express = require('express');
const cors = require('cors');
const Quiz = require('../Models/Quiz'); 
const adminTokenCheck = require('../Middleware/tokenCheck');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find(); 
        res.status(200).json(quizzes); 
    } catch (error) {
        console.error('Error fetching quizzes:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.post('/', async (req, res) => {
    const { quizName, quizDesc, quizTime, quizCategory, quizQuestions, quizCreator } = req.body;
    

    try {
        const newQuiz = new Quiz({
            quizName,
            quizDesc,
            quizTime,
            quizCategory,
            quizQuestions,
            quizCreator
        });

        await newQuiz.save();
        res.status(201).json({ quiz: newQuiz });
    } catch (error) {
        console.error('Error creating quiz:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
});



module.exports = router;