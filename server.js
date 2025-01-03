const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

// Render proporciona el puerto en la variable de entorno PORT
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Rutas
app.post('/submit-checklist', (req, res) => {
  const { equipment, check1, signature } = req.body;

  // Configurar Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia esto según tu proveedor
    auth: {
      user: process.env.EMAIL_USER, // Usa la variable de entorno configurada en Render
      pass: process.env.EMAIL_PASS, // Usa la variable de entorno configurada en Render
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: check1 === 'ok' ? 'nruiz@tasalogistica.com.ar' : 'abuzetti@tasalogistica.com.ar',
    subject: `Checklist del equipo: ${equipment}`,
    text: `Revisión de equipo:\nEquipo: ${equipment}\nEstado: ${check1}`,
    attachments: [
      {
        filename: 'signature.png',
        content: signature.split('base64,')[1],
        encoding: 'base64',
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al enviar el correo' });
    } else {
      res.json({ message: 'Checklist enviado correctamente' });
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
