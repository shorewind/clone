# Wordle+

This is a project originally created for StormHacks 2022.
+ Checkout our Devpost submission: https://devpost.com/software/wordle

It is a variant of the popular word-guessing game Wordle with two new features aimed towards educating the user about English words, their synonyms, and their meanings.
  1. Added hint button that displays associated word
  2. Added display of definition after game is played

## How to Run Locally

In order to run this project you will need to subscribe to Random Words API and Word Dictionary API on rapidapi.com:
  
  - Random Words API: https://rapidapi.com/sheharyar566/api/random-words5/
  - Word Dictionary API: https://rapidapi.com/twinword/api/word-dictionary/
  
Then create a .env file in the root of the project and input `RAPID_API_KEY={your_rapid_api_key`.
  
In the terminal, type `npm i` to install the necessary dependencies and `npm run start:backend` to start running on the localhost port.

Copy the path to the file and paste in your browser to see and play the game.
 
You should be all set!
