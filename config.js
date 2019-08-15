const environements = {};

environements.development = {
  httpPort: 3000,
  httpsPort: 3001,
  stage: 'development'
};

environements.production = {
  httpPort: 5000,
  httpsPort: 5001,
  stage: 'production'
};

const passedStage = process.env.NODE_ENV || '';

const exportEnv = environements.hasOwnProperty(passedStage) ?
                  environements[passedStage] :
                  environements.development;

module.exports = exportEnv;
