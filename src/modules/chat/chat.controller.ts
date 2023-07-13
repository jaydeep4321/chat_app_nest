import { Controller, Get, Render, Res } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // @Get('/')
  // @Render('login')
  // Login() {
  //   // return { message: 'Hello world!' };
  // }

  // @Get('/register')
  // @Render('register')
  // Register() {
  //   // return { message: 'Hello world!' };
  // }
  @Get('/')
  @Render('index')
  Home() {
    // return { message: 'Hello world!' };
  }

  @Get('/chat')
  @Render('chat')
  async Chat(@Res() res) {
    // const messages = await this.chatService.getMessages();
    // res.json(messages);
  }

  //=================== demo chat ========================//

  // @Get('/demo')
  // @Render('demo')
  // Demo() {
  // return { message: 'Hello world!' };
  // }

  //======================== old chat app ====================//

  // @Get('/chat')
  // @Render('index')
  // Home() {
  //   return { message: 'Hello world!' };
  // }

  // @Get('/api/chat')
  // async Chat(@Res() res) {
  //   const messages = await this.chatService.getMessages();
  //   res.json(messages);
  // }

  //======================= node code (Reference) =================//

  // app.get("/", (req, res) => {
  //   //console.log(req);
  //   res.sendFile(__dirname + "/index.html");
  // });

  // app.get("/chat", (req, res) => {
  //   res.sendFile(__dirname + "/chat.html");
  // });
}
