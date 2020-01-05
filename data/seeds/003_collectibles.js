const { LoremIpsum } = require('lorem-ipsum');

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

exports.seed = knex => {
  const collectibles = [];

  for (let i = 0; i <= 50; i += 1) {
    const newObj = {
      name: lorem.generateWords(3),
      description: lorem.generateParagraphs(1),
      imageUrl: 'https://via.placeholder.com/400',
    };

    collectibles.push(newObj);
  }

  return knex('collectibles').insert(collectibles);
};
