const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    logger.debug({ id }, 'Getting fragment by id');

    // Getting from data
    const fragment = await Fragment.byId(req.user, id);

    if (fragment) {
      res.status(200).json(
        createSuccessResponse({
          fragment: {
            id: fragment.id,
            ownerId: fragment.ownerId,
            created: fragment.created,
            updated: fragment.updated,
            type: fragment.type,
            size: fragment.size,
          },
        })
      );
    } else {
      res.status(404).json(createErrorResponse(404, 'No such fragment exists'));
    }
  } catch (err) {
    logger.error({ err }, 'Error occurred getting fragment by id');
    res.status(404).json(createErrorResponse(404, 'No such fragment exists'));
  }
};
