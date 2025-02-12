// @flow
import models from "./models";
import graphql from "./graphql";
import security from "./security";

export default config => [models(config), graphql, security];
