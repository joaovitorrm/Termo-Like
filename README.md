# TERMO LIKE

## About

This is a React + TypeScript + Vite setup in the frontend, and a Node.js server with Express and Axios in the backend.

This project is an attempt to make the game Termo, where you have to guess the word using other words that will give you hints about the word that you are trying to guess.

It is in __Brazilian portuguese__, but it could be in other languages depending on the API.

## How to use

To start, follow these steps:

- Clone the repository: `git clone https://github.com/brunocotrim/termo-like`
- Change directory: `cd termo-like/frontend`
- Install dependencies: `npm install`
- Run the frontend: `npm run dev`
- In a new terminal: `cd termo-like/backend`
- Install dependencies: `npm install`
- Run the server: `npm run dev`

## Backend

In the backend, i used [Express](https://expressjs.com/) to run the server. And i used [Axios](https://github.com/axios/axios) to make requests to the APIs.

I used the [Dicio](https://dicio.com.br/) API to check if the word exists, and the [Dicionário Aberto](https://dicionario-aberto.net/) API to get random words.

## Frontend

In the frontend, i used [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/) to build the frontend. I used [Vite](https://vitejs.dev/) to run the frontend. And i used [Axios](https://github.com/axios/axios) to make requests to the backend.