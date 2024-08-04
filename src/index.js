import moment from 'moment'
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferWindowMemory } from "langchain/memory";
import {ChatPromptTemplate,SystemMessagePromptTemplate,HumanMessagePromptTemplate} from "@langchain/core/prompts"
import ChatService from './chatservice.js';


export default {
	async fetch(request, env, ctx) {
		const chatPrompt = ChatPromptTemplate.fromMessages([
		SystemMessagePromptTemplate.fromTemplate("Translate the following from English into Italian:"),
		HumanMessagePromptTemplate.fromTemplate("{input}")
		]);

		var a = moment('2016-01-01');
		const baseUrl = 'https://api.deepseek.com';
		const apiKey = 'sk-7c51b68ff66243d1945effc882b65885';
		const model = new ChatOpenAI({ model: "deepseek-chat",configuration:{baseURL: baseUrl},apiKey: apiKey });
		const memory = new BufferWindowMemory({ k: 10 }); 
		const chain = new ConversationChain({ 
            llm: model, 
            memory: memory,
			prompt: chatPrompt
        });

		  try {
			const chat = new ChatService()
			let response = await chat.fetch("Hi! I'm Lynn.")
			response = await response.json()
			return new Response(JSON.stringify(response.response),{status:200})
			// const res1 = await chain.call({ input: "Hi! I'm Jim." });
			// console.log({ res1 });
			// const res2 = await chain.call({ input: "What's my name?" });
			// console.log({ res2 });
			// const result = await chain.call({ input: "What's your name?" });
			// console.log(memory.chatHistory.getMessages())
			// return new Response(res1.response, { status: 200 });
		  } catch (error) {
			// Log the error and return a 500 response
			console.error('Error invoking model:', error);
			return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
		  }
	},
};
