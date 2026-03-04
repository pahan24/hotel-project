const Content = require('../models/Content');

async function getContent(key, fallback) {
  const item = await Content.findOne({ key });
  return item ? item.value : fallback;
}

async function setContent(key, value) {
  await Content.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
}

module.exports = { getContent, setContent };
