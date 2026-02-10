const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    if (!Buffer.isBuffer(req.body)) {
      logger.error('Unsupported type');
      return res.status(415).json(createErrorResponse(415));
    }

    const contentType = req.get('Content-Type');
    logger.debug({ contentType }, 'Parsing content type');

    // Fragment obj creation
    const fragment = new Fragment({
      ownerId: req.user,
      type: contentType,
    });
    logger.debug({ fragment }, 'Fragment object creation');

    await fragment.save();
    await fragment.setData(req.body);
    logger.info({ fragment }, 'Fragment object was created');

    const apiURL = process.env.API_URL || `http://${req.headers.host}`;
    const location = `${apiURL}/v1/fragments/${fragment.id}`;

    res
      .location(location)
      .status(201)
      .json(
        createSuccessResponse({
          fragment: fragment,
        })
      );
  } catch (err) {
    logger.error({ err }, 'Error occurred during a fragment creation');
    res.status(500).json(createErrorResponse(500));
  }
};
