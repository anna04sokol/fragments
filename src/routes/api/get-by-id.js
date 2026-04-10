const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const MarkdownIt = require('markdown-it');
const sharp = require('sharp');
const md = new MarkdownIt();

const extensionToMime = {
  txt: 'text/plain',
  md: 'text/markdown',
  html: 'text/html',
  json: 'application/json',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
};

const conversionMap = {
  'text/plain': ['text/plain'],
  'text/markdown': ['text/markdown', 'text/html', 'text/plain'],
  'text/html': ['text/html', 'text/plain'],
  'application/json': ['application/json', 'text/plain'],
  'image/png': ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'],
  'image/jpeg': ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'],
  'image/webp': ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'],
  'image/avif': ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'],
  'image/gif': ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'],
};

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

    if (!extension) {
      res.setHeader('Content-Type', fragment.type);
      return res.status(200).send(data);
    }

    const targetMime = extensionToMime[extension.toLowerCase()];
    if (!targetMime) {
      return res
        .status(415)
        .json(createErrorResponse(415, `Unsupported extension: .${extension}`));
    }

    const sourceMime = fragment.mimeType;

    if (sourceMime === targetMime) {
      res.setHeader('Content-Type', fragment.type);
      return res.status(200).send(data);
    }

    const allowedTargets = conversionMap[sourceMime] || [];
    if (!allowedTargets.includes(targetMime)) {
      return res
        .status(415)
        .json(createErrorResponse(415, `Cannot convert ${sourceMime} to ${targetMime}`));
    }

    if (sourceMime === 'text/markdown' && targetMime === 'text/html') {
      
      const html = md.render(data.toString());
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    }

    if (targetMime === 'text/plain') {
      // For now, treat the underlying data as UTF-8 text
      const text = data.toString();
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(text);
    }

    if (sourceMime === 'application/json' && targetMime === 'application/json') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(200).send(data);
    }

    // Image conversions using sharp
    if (sourceMime.startsWith('image/') && targetMime.startsWith('image/')) {
      let image = sharp(data);

      switch (targetMime) {
        case 'image/png':
          image = image.png();
          break;
        case 'image/jpeg':
          image = image.jpeg();
          break;
        case 'image/webp':
          image = image.webp();
          break;
        case 'image/avif':
          image = image.avif();
          break;
        case 'image/gif':
          image = image.gif();
          break;
        default:
          return res
            .status(415)
            .json(createErrorResponse(415, `Unsupported image conversion to ${targetMime}`));
      }

      const converted = await image.toBuffer();
      res.setHeader('Content-Type', targetMime);
      return res.status(200).send(converted);
    }

    // If we get here, we don't know how to convert this combination
    return res
      .status(415)
      .json(createErrorResponse(415, `Cannot convert ${sourceMime} to ${targetMime}`));
  } catch (err) {
    logger.error({ err }, 'Error occurred getting fragment by id');
    res.status(404).json(createErrorResponse(404, 'Can not find fragment by id'));
  }
};
