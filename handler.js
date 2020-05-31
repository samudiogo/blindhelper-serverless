'use strict';


const aws = require('aws-sdk');
const Joi = require('@hapi/joi');
const decoratorValidator = require('./utils/decoratorValidator');
const globalEnum = require('./utils/globalEnum');

const rekognitionService = new aws.Rekognition();

class Handler {
  constructor({
    rekogSvc,
  }) {
    this._rekoService = rekogSvc;
  }

  // validation:

  static validator() {
    return Joi.object({
      imageUrl: Joi.string().required()
    });
  }


  async getImageBufferFromUrl(imageUrl) {

  }

  async detectImageFromBuffer(buffer) {

  }

  async translateText(text) {

  }

  formatTextResults(text, workingItems) {

  }

  handlerSuccess(data) {
    return {
      statusCode: 200,
      body: data
    }
  }

  handlerError(data) {
    return {
      statusCode: data.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create item!!'
    }
  }


  async main(event) {

    try {

      const data = event.queryStringParameters;

      return this.handlerSuccess(data);


    } catch (error) {
      console.log(`*** request error ***`, error);
      return this.error({ statusCode: 400 });
    }
  }
}

const myHandler = new Handler({ rekogSvc: rekognitionService });

module.exports.main = decoratorValidator(myHandler.main.bind(myHandler), Handler.validator(), globalEnum.ARG_TYPE.QUERYSTRING)
