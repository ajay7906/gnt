
const axios = require('axios');
const options = {
  method: 'post',
  url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
  headers: {
        accept: 'text/plain',
        'Content-Type': 'application/json',
				},
data: {

}
};
axios
  .request(options)
      .then(function (response) {
      console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });