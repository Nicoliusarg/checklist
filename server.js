const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

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
      user: 'tu_correo@gmail.com', // Tu correo
      pass: 'tu_contraseña',       // Tu contraseña
    },
  });

  const mailOptions = {
    from: 'tu_correo@gmail.com',
    to: check1 === 'ok' ? 'correo_ok@gmail.com' : 'correo_no_ok@gmail.com',
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
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
