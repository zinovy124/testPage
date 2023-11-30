const api_key = 'Insert your Key here';
let data;
const setData = (question) => {
    data = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
          {
            "role": "system",
            "content": "You are a helpful assistant."
          },
          {
            "role": "user",
            "content": `${question}`
          }
        ]
    });
};

let answer;

function call(quest) {
    setData(quest);
    fetch(
        "https://api.openai.com/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${api_key}`
            },
            body: data,
        }
    )
        .then(response => response.json())
        .then(data => {
            console.log(data['choices'][0]['message']['content']);
            answer = data['choices'][0]['message']['content'];
            addAnswerToAnsArea(answer);
        })
        .catch(error => {
            console.error(error);
        });
};

let identifierNumber = 1;
const form = document.querySelector("form");
const userInput = document.querySelector("#prompt-textarea");
const textPlace = document.querySelector(".text-place");
const submitButton = document.querySelector("button[type=submit]");

// Functions locating Texts

const getWrapper = (convObj) => {
    const wrapper = document.createElement("div");
    wrapper.className = "element p-2";
    wrapper.id = `conversation_${identifierNumber}`;
    wrapper.appendChild(convObj);
    if (convObj.identity == "GPT") {
        identifierNumber++;
    }
    textPlace.appendChild(wrapper);
};

const addAnswerToQuestArea = (text) => {
    const userQuestion = document.createElement("div");
    userQuestion.className = "user-quest";
    const nameTagYou = document.createElement("span");
    nameTagYou.className = "text-2xl my-3";
    nameTagYou.innerText = "You";
    const userText = document.createElement("p");
    userText.innerText = text;
    userQuestion.appendChild(nameTagYou);
    userQuestion.appendChild(userText);
    userQuestion.identity = "user";
    getWrapper(userQuestion);
};

function addAnswerToAnsArea(ans) {
    const gptAnswer = document.createElement("div");
    gptAnswer.className = "gpt-ans my-3";
    const nameTagGpt = document.createElement("span");
    nameTagGpt.className = "text-2xl my-3";
    nameTagGpt.innerText = "ChatGPT";
    const gptText = document.createElement("p");
    gptText.innerText = ans;
    gptAnswer.appendChild(nameTagGpt);
    gptAnswer.appendChild(gptText);
    gptAnswer.identity = "GPT";
    getWrapper(gptAnswer);
};

// Event Listeners

form.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && !e.shiftKey && e.isComposing === false) {
        e.preventDefault();
        addAnswerToQuestArea(userInput.value);
        call(userInput.value);
        userInput.value = "";
    }
});
