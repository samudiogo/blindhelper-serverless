'use strict';

class Handler {
  constructor({
    rekogSvc,
  }) {
    this._rekoService = rekogSvc;
  }


  async getImageBufferFromUrl(imageUrl) {

  }

  async detectImageFromBuffer(buffer) {

  }

  async translateText(text) {

  }

  formatTextResults(text, workingItems) {

  }


  async main(event) {
    
    return {
      statusCode: 200,
      body: `Hello, initial`
    }
  }
}

const aws = require('aws-sdk');
const rekognitionService = new  aws.Rekognition();

const myHandler = new Handler({rekogSvc: rekognitionService});

module.exports.main = myHandler.main.bind(myHandler);
