
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

function microphoneStream() {
    // [START micStreamRecognize]
  
    // Node-Record-lpcm16
    const record = require('node-record-lpcm16');

    // Imports the Google Cloud client library
    const speech = require('@google-cloud/speech');
  
    process.env.GOOGLE_APPLICATION_CREDENTIALS = "C:\\Users\\laxmikantm\\project_area\\python_speech_recognition\\speechRecognition-0e0e00aa7157.json"; 

    const config = {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
    };
  
    const request = {
      config,
      interimResults: false, //Get interim results from stream
    };
  
    
    // Creates a client
    const client = new speech.SpeechClient();
  
    // Create a recognize stream
    const recognizeStream = client
      .streamingRecognize(request)
      .on('error', console.error)
      .on('data', data =>
        process.stdout.write(
          data.results[0] && data.results[0].alternatives[0]
            ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
            : `\n\nReached transcription time limit, press Ctrl+C\n`
        )
      );
  
    // Start recording and send the microphone input to the Speech API
    record
      .start({
        sampleRateHertz: sampleRateHertz,
        threshold: 0, //silence threshold
        recordProgram: 'sox', // Try also "arecord" or "sox"
        silence: '5.0', //seconds of silence before ending
      })
      .on('error', console.error)
      .pipe(recognizeStream);
  
    console.log('Listening, press Ctrl+C to stop.');
    // [END micStreamRecognize]
  }

  microphoneStream();