document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const chatOptions = document.getElementById('chat-options');
    const startBtn = document.getElementById('start-btn');

    // Smooth scroll for Launch Assistant button
    startBtn.addEventListener('click', () => {
        document.getElementById('assistant').scrollIntoView({ behavior: 'smooth' });
    });

    const assistantLogic = {
        'register': {
            botMessage: "To register to vote, you typically need to be a U.S. citizen, meet your state's residency requirements, and be 18 years old on or before Election Day. Would you like to know how to check your current registration status or find your state's online registration portal?",
            options: [
                { text: 'Check Status', action: 'check_status' },
                { text: 'State Portal', action: 'state_portal' }
            ]
        },
        'polling': {
            botMessage: "Your polling place is assigned based on your residential address. It can change between elections. Do you need help finding where to look up your specific location?",
            options: [
                { text: 'Yes, help me find it', action: 'find_polling' },
                { text: 'Back to main menu', action: 'main_menu' }
            ]
        },
        'deadlines': {
            botMessage: "Deadlines vary wildly by state. Generally, registration closes 15-30 days before the election. Mail-in ballots must often be requested a week prior and postmarked by Election Day. What specific deadline are you curious about?",
            options: [
                { text: 'Registration Deadline', action: 'reg_deadline' },
                { text: 'Mail-in Deadline', action: 'mail_deadline' }
            ]
        },
        'process': {
            botMessage: "Great! Let's walk through the complete election journey step-by-step. <br><br><b>Step 1: Voter Registration</b><br>Before you can vote, you must be registered. Deadlines vary by state, but it's typically 15-30 days before Election Day. Are you registered?",
            options: [
                { text: 'Yes, I am registered', action: 'process_step2' },
                { text: 'No, how do I register?', action: 'process_register_help' }
            ]
        },
        'process_register_help': {
            botMessage: "You can register online, by mail, or in person. Check your state's portal via USA.gov. Let me know when you're ready to move to the next step.",
            options: [
                { text: 'Ready for Step 2', action: 'process_step2' }
            ]
        },
        'process_step2': {
            botMessage: "<b>Step 2: Education & Research</b><br>Now that you're registered, it's time to learn about the candidates and ballot measures. Nonpartisan sites like Vote411.org or Ballotpedia can help you build your ballot. Ready to learn about voting methods?",
            options: [
                { text: 'Next: Voting Methods', action: 'process_step3' }
            ]
        },
        'process_step3': {
            botMessage: "<b>Step 3: Deciding How to Vote</b><br>You have options! Depending on your state, you can vote:<br>- By Mail (Absentee)<br>- Early In-Person<br>- On Election Day.<br>Which method are you planning to use?",
            options: [
                { text: 'By Mail', action: 'process_step4_mail' },
                { text: 'Early Voting', action: 'process_step4_early' },
                { text: 'Election Day', action: 'process_step4_day' }
            ]
        },
        'process_step4_mail': {
            botMessage: "<b>Step 4: Casting Your Ballot (Mail)</b><br>Make sure to request your ballot early! When it arrives, follow all instructions carefully, sign the envelope, and return it by the deadline. Congratulations, you've learned the complete process!",
            options: [
                { text: 'Back to main menu', action: 'main_menu' }
            ]
        },
        'process_step4_early': {
            botMessage: "<b>Step 4: Casting Your Ballot (Early)</b><br>Check your local election office for early voting dates and locations. Bring your ID if required by your state, and cast your vote ahead of the rush! Congratulations, you've learned the complete process!",
            options: [
                { text: 'Back to main menu', action: 'main_menu' }
            ]
        },
        'process_step4_day': {
            botMessage: "<b>Step 4: Casting Your Ballot (Election Day)</b><br>Find your polling place and note the hours. Expect lines, so plan ahead. Bring required ID and cast your vote! Congratulations, you've learned the complete process!",
            options: [
                { text: 'Back to main menu', action: 'main_menu' }
            ]
        },
        'check_status': {
            botMessage: "You can check your registration status by visiting Vote.org or your local Secretary of State website. You usually just need your name, date of birth, and address.",
            options: [{ text: 'Main Menu', action: 'main_menu' }]
        },
        'state_portal': {
            botMessage: "Most states offer online voter registration. You can find your state's official portal via the USA.gov voting section.",
            options: [{ text: 'Main Menu', action: 'main_menu' }]
        },
        'find_polling': {
            botMessage: "You can find your polling place by checking your state election website or using the polling place locator on Vote.org closer to Election Day.",
            options: [{ text: 'Main Menu', action: 'main_menu' }]
        },
        'reg_deadline': {
            botMessage: "It's best to aim for 30 days before the election. However, some states allow Same-Day Voter Registration at the polls. You should verify your state's specific laws.",
            options: [{ text: 'Main Menu', action: 'main_menu' }]
        },
        'mail_deadline': {
            botMessage: "Request your mail-in ballot as early as possible. Most states require the request to be received 7-10 days before the election, and the ballot itself must be postmarked by Election Day.",
            options: [{ text: 'Main Menu', action: 'main_menu' }]
        },
        'main_menu': {
            botMessage: "What else can I help you with?",
            options: [
                { text: 'Complete Election Process', action: 'process' },
                { text: 'How to Register', action: 'register' },
                { text: 'Find Polling Place', action: 'polling' },
                { text: 'Election Deadlines', action: 'deadlines' }
            ]
        }
    };

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function updateOptions(options) {
        chatOptions.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.classList.add('chat-btn');
            btn.textContent = opt.text;
            btn.dataset.action = opt.action;
            btn.addEventListener('click', handleOptionClick);
            chatOptions.appendChild(btn);
        });
    }

    function handleOptionClick(e) {
        const action = e.target.dataset.action;
        const buttonText = e.target.textContent;

        // Add user message
        addMessage(buttonText, 'user');

        // Disable options temporarily
        chatOptions.innerHTML = '';

        // Simulate thinking delay
        setTimeout(() => {
            const response = assistantLogic[action];
            if (response) {
                addMessage(response.botMessage, 'bot');
                updateOptions(response.options);
            }
        }, 600);
    }

    // Attach initial event listeners
    document.querySelectorAll('.chat-btn').forEach(btn => {
        btn.addEventListener('click', handleOptionClick);
    });
    // Quiz Logic
    const quizMessages = document.getElementById('quiz-messages');
    const quizOptions = document.getElementById('quiz-options');

    const quizData = [
        {
            question: "What is the minimum voting age in the United States?",
            options: [
                { text: "16", isCorrect: false },
                { text: "18", isCorrect: true },
                { text: "21", isCorrect: false }
            ],
            explanation: "You must be at least 18 years old on or before Election Day to vote in federal elections."
        },
        {
            question: "Which of these is NOT a common method of voting?",
            options: [
                { text: "Mail-in ballot", isCorrect: false },
                { text: "Text message", isCorrect: true },
                { text: "Early in-person", isCorrect: false }
            ],
            explanation: "Currently, no state allows voting via text message. Mail-in and early in-person are common."
        },
        {
            question: "When is Election Day typically held?",
            options: [
                { text: "First Tuesday in Nov", isCorrect: true },
                { text: "Last Friday in Oct", isCorrect: false },
                { text: "December 1st", isCorrect: false }
            ],
            explanation: "Election Day is statutorily set as the Tuesday next after the first Monday in November."
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    function addQuizMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerHTML = `<p>${text}</p>`;
        quizMessages.appendChild(messageDiv);
        quizMessages.scrollTop = quizMessages.scrollHeight;
    }

    function renderQuizQuestion() {
        quizOptions.innerHTML = '';
        
        if (currentQuestionIndex >= quizData.length) {
            addQuizMessage(`Quiz complete! You scored ${score} out of ${quizData.length}.`, 'bot');
            const restartBtn = document.createElement('button');
            restartBtn.classList.add('chat-btn');
            restartBtn.textContent = 'Restart Quiz';
            restartBtn.addEventListener('click', () => {
                currentQuestionIndex = 0;
                score = 0;
                addQuizMessage("Let's try again!", 'user');
                setTimeout(renderQuizQuestion, 600);
            });
            quizOptions.appendChild(restartBtn);
            return;
        }

        const currentQ = quizData[currentQuestionIndex];
        addQuizMessage(`Question ${currentQuestionIndex + 1}: ${currentQ.question}`, 'bot');

        currentQ.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.classList.add('chat-btn');
            btn.textContent = opt.text;
            btn.addEventListener('click', () => handleQuizAnswer(opt, currentQ.explanation));
            quizOptions.appendChild(btn);
        });
    }

    function handleQuizAnswer(selectedOption, explanation) {
        addQuizMessage(selectedOption.text, 'user');
        quizOptions.innerHTML = ''; // disable buttons

        setTimeout(() => {
            if (selectedOption.isCorrect) {
                score++;
                addQuizMessage(`✅ Correct! ${explanation}`, 'bot');
            } else {
                addQuizMessage(`❌ Incorrect. ${explanation}`, 'bot');
            }

            currentQuestionIndex++;
            setTimeout(renderQuizQuestion, 1500); // give time to read explanation
        }, 600);
    }

    // Attach initial quiz listener
    document.querySelector('#quiz-options .chat-btn[data-action="start_quiz"]').addEventListener('click', (e) => {
        addQuizMessage("Start Quiz", 'user');
        e.target.style.display = 'none';
        setTimeout(renderQuizQuestion, 600);
    });

});
