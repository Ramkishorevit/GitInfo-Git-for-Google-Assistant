const request = require('request');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
exports.getRepositories = function(organizationName,cb) {

var options = {
    url: 'https://api.github.com/orgs/' + organizationName + '/repos',
    method: 'GET',
    headers: {
    'User-Agent': 'request'
  }
};
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    //console.log(JSON.parse(body)[0].name);
    cb(null,body)
  }
}

request(options, callback);


};