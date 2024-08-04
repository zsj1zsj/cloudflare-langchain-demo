import moment from 'moment';
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferWindowMemory } from "langchain/memory";
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";

class ChatService {
  constructor() {
    this.apiKey = 'sk-7c51b68ff66243d1945effc882b65885';
    this.baseUrl = 'https://api.deepseek.com';
    this.chatPrompt = this.createChatPrompt();
    this.model = this.createModel();
    this.memory = this.createMemory();
    this.chain = this.createChain();
  }

  createChatPrompt() {
    return ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate("Translate the following from English into Italian:"),
      HumanMessagePromptTemplate.fromTemplate("{input}")
    ]);
  }

  createModel() {
    return new ChatOpenAI({
      model: "deepseek-chat",
      configuration: { baseURL: this.baseUrl },
      apiKey: this.apiKey
    });
  }

  createMemory() {
    return new BufferWindowMemory({ k: 10 });
  }

  createChain() {
    return new ConversationChain({
      llm: this.model,
      memory: this.memory,
      prompt: this.chatPrompt
    });
  }
  
  async fetch(input) {
    try {
      const response = await this.chain.call({ input });
      console.log(this.memory.chatHistory.getMessages());
      return new Response(response.response, { status: 200 });
    } catch (error) {
      console.error('Error invoking model:', error);
      return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
    }
  }
}

export default ChatService;