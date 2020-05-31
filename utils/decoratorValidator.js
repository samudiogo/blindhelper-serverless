const decoratorValidator = (fn, schema, argsType) => {
    return async function (event) {

        try {
            let data = {};

            if(typeof event[argsType] === 'string') {
                data = JSON.parse(event[argsType]);
            } else {
                data = event[argsType];
            }

            const res = await schema.validate(data, { abortEarly: true });

            const { error, value } = res;

            event[argsType] = value;

            if (!error) return fn.apply(this, arguments);

            throw (error || { statusCode: 400, message: 'Bad request' });


        } catch (ex) {
            console.log(ex);
            
            return {
                statusCode: ex.statusCode || 400,
                body: ex.message || 'Bad request',
            }
        }




    }
}
module.exports = decoratorValidator
