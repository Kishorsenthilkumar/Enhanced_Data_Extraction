const amqp = require('amqplib/callback_api');

// Connect to RabbitMQ
amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }
        const queue = 'data_sync';

        channel.assertQueue(queue, {
            durable: false
        });

        app.post('/api/upload', upload.single('file'), (req, res) => {
            const filePath = path.join(__dirname, 'uploads', req.file.filename);

            Tesseract.recognize(
                filePath,
                'eng',
                {
                    logger: info => console.log(info) // Log progress
                }
            ).then(({ data: { text } }) => {
                console.log('Extracted Text:', text);
                // Send extracted text to RabbitMQ
                channel.sendToQueue(queue, Buffer.from(text));
                res.send('File processed and text extracted.');
            }).catch(err => {
                console.error('Error during OCR:', err);
                res.status(500).send('Error processing file.');
            });
        });
    });
}); 