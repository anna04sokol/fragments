const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    logger.debug({ id }, 'Getting fragment by id');

    // Getting from data
    const fragment = await Fragment.byId(req.user, id);

    // Getting from metadata
    const data = await fragment.getData();
    res.setHeader('Content-Type', fragment.type);
    res.status(200).send(data);
  } catch (err) {
    logger.error({ err }, 'Error occurred getting fragment by id');
    res.status(404).json(createErrorResponse(404, 'Can not find fragment by id'));
  }
};
