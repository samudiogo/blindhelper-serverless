'use strict';


const aws = require('aws-sdk');
const Joi = require('@hapi/joi');
const decoratorValidator = require('./utils/decoratorValidator');
const globalEnum = require('./utils/globalEnum');
const { get } = require('axios');
const rekognitionService = new aws.Rekognition();
const translateService = new aws.Translate();
class Handler {
  constructor({
    rekogSvc,
    translatorSvc,
  }) {
    this._rekoService = rekogSvc;
    this._translatorService = translatorSvc;
  }

  // validation:

  static validator() {
    return Joi.object({
      imageUrl: Joi.string().required()
    });
  }


  async getImageBufferFromUrlAsync(imageUrl) {

    const response = await get(imageUrl, { responseType: 'arraybuffer' });

    const buffer = Buffer.from(response.data, 'base64');

    return buffer;

  }

  async detectImageFromBufferAsync(buffer) {

    const result = await this._rekoService.detectLabels({ Image: { Bytes: buffer } }).promise();

    const workingItems = result.Labels.filter(({ Confidence }) => Confidence > 80);

    const names = workingItems.map(({ Name }) => Name).join(' and ');

    return { names, workingItems };

  }

  async translateTextAsync(text) {

    const translateParams = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'pt',
      Text: text
    };

    const { TranslatedText } = await this._translatorService.translateText(translateParams).promise();

    return TranslatedText.split(' e ');
  }

  formatTextResults(texts, workingItems) {

    const finalText = [];

    for (const indextTxt in texts) {
      const namePt = texts[indextTxt];
      const confidence = workingItems[indextTxt].Confidence;

      finalText.push(`${confidence.toFixed(2)}% de ser do tipo ${namePt}`)
    }

    return finalText;
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

      const { imageUrl } = event.queryStringParameters;

      const imgBuffer = await this.getImageBufferFromUrlAsync(imageUrl);

      const { names, workingItems } = await this.detectImageFromBufferAsync(imgBuffer);

      const texts = await this.translateTextAsync(names);

      const finalText = this.formatTextResults(texts, workingItems);

      return this.handlerSuccess(finalText);



    } catch (error) {
      console.log(`*** request error ***`, error);
      return this.error({ statusCode: 400 });
    }
  }
}

const myHandler = new Handler({ rekogSvc: rekognitionService, translatorSvc: translateService });

module.exports.main = decoratorValidator(myHandler.main.bind(myHandler), Handler.validator(), globalEnum.ARG_TYPE.QUERYSTRING);
