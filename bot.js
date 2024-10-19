const { Client } = require('whatsapp-web.js');

const client = new Client({
  webVersionCache: {
    remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/refs/heads/main/html/2.3000.1015773999-alpha.html",
  },
});

const qrcode = require('qrcode-terminal');
const nodemailer = require('nodemailer'); // npm install nodemailer

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu-email@gmail.com',
    pass: 'tu-contraseña'
  }
});

async function run() {
  try {
    client.on('qr', qr => {
      qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
      console.log('¡Bien! WhatsApp conectado.');
    });

    await client.initialize();

    // Función que devuelve una frase inspiradora
    function obtenerFraseInspiradora() {
      return "Recuerda: El éxito no se mide por lo que logras, sino por los obstáculos que superas. 💪";
    }

    // Función que devuelve una curiosidad interesante
    function obtenerCuriosidad() {
      return "¿Sabías que el corazón de un camarón está en su cabeza? 🦐";
    }

    // Función de despedida
    function despedirse() {
      return "Gracias por usar InfoBot! Vuelve pronto! 🌻";
    }

    const menuInfoBot = `
    Bienvenido al *InfoBot* 🌟 Por favor elige una opción:
    1. Obtener una frase inspiradora ✨
    2. Conocer una curiosidad interesante 🤓
    3. Despedirse 👋🏻
    `;

    const delay = ms => new Promise(res => setTimeout(res, ms));

    client.on('message', async msg => {
      if (
        msg.body.match(/(hola|info|menu)/i) &&
        msg.from.endsWith('@c.us')
      ) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        await delay(500);
        await client.sendMessage(msg.from, `${menuInfoBot} `);
      } 
      
      else if (msg.body.match(/(1|frase)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        const frase = obtenerFraseInspiradora();
        await client.sendMessage(msg.from, frase);
        await client.sendMessage(msg.from, `${menuInfoBot} `);
      } 
      
      else if (msg.body.match(/(2|curiosidad)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        const curiosidad = obtenerCuriosidad();
        await client.sendMessage(msg.from, curiosidad);
        await client.sendMessage(msg.from, `${menuInfoBot} `);
      }

      else if (msg.body.match(/(3|despedida)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        const despedidaMensaje = despedirse();
        await client.sendMessage(msg.from, despedidaMensaje);
      }
    });

  } catch (error) {
    console.error('Error en la ejecución:', error);
  }
}

run().catch(err => console.error(err));
