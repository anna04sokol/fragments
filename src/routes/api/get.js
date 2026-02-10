// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    const expand = req.query.expand === '1';

    logger.debug({ expand }, 'Getting fragments details for a user');
    const fragments = await Fragment.byUser(req.user, expand);
    res.status(200).json(createSuccessResponse({ fragments }));
  } catch (err) {
    logger.error({ err }, 'Error occurred during getting details about al fragments, using expand');
    res.status(500).json(createErrorResponse(500, 'Can not get all fragments details'));
  }
};
