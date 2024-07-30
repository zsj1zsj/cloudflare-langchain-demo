/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import moment from 'moment'
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

export default {
	async fetch(request, env, ctx) {
		var a = moment('2016-01-01');
		const baseUrl = 'https://api.deepseek.com';
		const apiKey = 'sk-7c51b68ff66243d1945effc882b65885';
		const model = new ChatOpenAI({ model: "deepseek-chat",configuration:{baseURL: baseUrl},apiKey: apiKey });
		const messages = [
			new SystemMessage("Translate the following from English into Italian"),
			new HumanMessage("hi!"),
		  ];
		const result = await model.invoke(messages);

		return new Response(`Hello World! ${a} ${result.content}`);
	},
};
