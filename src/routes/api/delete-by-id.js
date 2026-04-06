const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    logger.debug({ id }, 'Fragment deleting by id');

    try {
      await Fragment.byId(req.user, id);
    } catch {
      return res.status(404).json(createErrorResponse(404, 'Fragment was not found'));
    }

    await Fragment.delete(req.user, id);

    res.status(200).json(createSuccessResponse({ id }));
  } catch (err) {
    logger.error({ err }, 'Error occurred during deleting a fragment');
    res.status(500).json(createErrorResponse(500, 'Error happened during a fragment deletion'));
  }
};