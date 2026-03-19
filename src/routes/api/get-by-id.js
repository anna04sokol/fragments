const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

module.exports = async (req, res) => {
  try {
    let { id } = req.params;
    let extension = null;
    logger.debug({ id }, 'Getting fragment by id');

    if (id.includes('.')) {
      // ex: anna.html
      const parts = id.split('.');
      id = parts[0];
      extension = parts[1];
    }

    // Getting from data
    const fragment = await Fragment.byId(req.user, id);
    // Getting from metadata
    const data = await fragment.getData();

    if (extension === 'html' && fragment.type === 'text/markdown') {
      const html = md.render(data.toString());
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);

      // no extension
    } else {
      res.setHeader('Content-Type', fragment.type);
      res.status(200).send(data);
    }
  } catch (err) {
    logger.error({ err }, 'Error occurred getting fragment by id');
    res.status(404).json(createErrorResponse(404, 'Can not find fragment by id'));
  }
};
