import * as dotenv from "dotenv";

dotenv.config();

function buildModel(model, config) {
  return new model(config);
}

export default buildModel;
