var Handlebars = require('handlebars');

function renderTemplate(template, data) {
  var compiledTemplate = Handlebars.compile(template);
  return compiledTemplate(data);
}

module.exports = renderTemplate;