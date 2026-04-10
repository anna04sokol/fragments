const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const contentType = require('content-type');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    logger.debug({ id }, 'Updating fragment by id');

    if (!Buffer.isBuffer(req.body)) {
      const type = req.get('Content-Type');
      const message = `Unsupported Content-Type: ${type || 'not provided'}`;
      logger.error(message);
      return res.status(415).json(createErrorResponse(415, message));
    }

    let fragment;

    try {
      fragment = await Fragment.byId(req.user, id);
    } catch {
      return res.status(404).json(createErrorResponse(404, 'Fragment was not found'));
    }

    const incomingTypeHeader = req.get('Content-Type');
    if (!incomingTypeHeader) {
      return res
        .status(400)
        .json(createErrorResponse(400, 'Content-Type header is required for updates'));
    }

    let existingType;
    let incomingType;
    
    try {
      existingType = contentType.parse(fragment.type).type;
      incomingType = contentType.parse(incomingTypeHeader).type;
    } catch (err) {
      logger.error({ err }, 'Error occurred parsing content type header during update');
      return res.status(400).json(createErrorResponse(400, 'Invalid Content-Type header'));
    }

    if (existingType !== incomingType) {
      return res
        .status(400)
        .json(createErrorResponse(400, 'Fragment type can not be changed'));
    }

    await fragment.setData(req.body);

    return res.status(200).json(
      createSuccessResponse({
        fragment,
      })
    );
  } catch (err) {
    logger.error({ err }, 'Error occurred during fragment update');
    return res.status(500).json(createErrorResponse(500));
  }
};
