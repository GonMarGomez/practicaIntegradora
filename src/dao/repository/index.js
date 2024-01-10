import Users from '../mongoDB/UserMongo.js'
import Products from "../mongoDB/ProductsMongo.js";
import Carts from "../mongoDB/CartMongo.js";
import Tickets from "../mongoDB/ticketsMongo.js";
import Chat from "../mongoDB/chatMongo.js";

import ProductRepository from "./ProductsRepository.js";
import UserRepository from "./UsersRepository.js";
import CartRepository from "./CartsRepository.js";
import TicketRepository from "./TicketsRepository.js";
import MessageRepository from "./chatRepository.js";

export const productService = new ProductRepository(new Products());
export const userService = new UserRepository(new Users());
export const cartsService = new CartRepository(new Carts());
export const ticketsService = new TicketRepository(new Tickets())
export const chatsService = new MessageRepository(new Chat())