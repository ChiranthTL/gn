var axios = require('axios');
const https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
axios.defaults.httpsAgent = httpsAgent;
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://103.66.50.180:8081/geonetwork/srv/ita/csw',
  'headers': {
    'Content-Type': 'application/xml',
    'Cookie': 'XSRF-TOKEN=488d2684-7ff1-4f67-ab89-4ef457846a86; serverTime=1660888169980; sessionExpiry=1660888169980; JSESSIONID=node01fsn7z57khf7mlw1sxmib3r302362.node0'
  },
  body: '<?xml version="1.0"?>\r\n<csw:GetRecords\r\n	xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" version="2.0.2" resultType="results" >\r\n	<csw:Query typeNames="csw:Record">\\ \r\n		<csw:ElementSetName>full</csw:ElementSetName>\r\n		<csw:Constraint version="1.1.0">\r\n			<ogc:Filter\r\n				xmlns:ogc="http://www.opengis.net/ogc">\r\n				<ogc:BBOX>\r\n					<ogc:PropertyName>iso:BoundingBox</ogc:PropertyName>\r\n					<gml:Envelope\r\n						xmlns:gml="http://www.opengis.net/gml">\r\n						<gml:lowerCorner>77.2805589808573 12.42756448925366</gml:lowerCorner>\r\n						<gml:upperCorner>77.5613969935526 12.658133048390866</gml:upperCorner>\r\n					</gml:Envelope>\r\n				</ogc:BBOX>\r\n			</ogc:Filter>\r\n		</csw:Constraint>\r\n	</csw:Query>\r\n</csw:GetRecords>',
  tls: {
    rejectUnauthorized: false
},

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});











// var axios = require('axios');
// const https = require('https');
// const httpsAgent = new https.Agent({ rejectUnauthorized: false });
// axios.defaults.httpsAgent=httpsAgent;
// var data = '<?xml version="1.0"?>\r\n<csw:GetRecords\r\n\txmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" version="2.0.2" resultType="results" >\r\n\t<csw:Query typeNames="csw:Record">\\ \r\n\t\t<csw:ElementSetName>full</csw:ElementSetName>\r\n\t\t<csw:Constraint version="1.1.0">\r\n\t\t\t<ogc:Filter\r\n\t\t\t\txmlns:ogc="http://www.opengis.net/ogc">\r\n\t\t\t\t<ogc:BBOX>\r\n\t\t\t\t\t<ogc:PropertyName>iso:BoundingBox</ogc:PropertyName>\r\n\t\t\t\t\t<gml:Envelope\r\n\t\t\t\t\t\txmlns:gml="http://www.opengis.net/gml">\r\n\t\t\t\t\t\t<gml:lowerCorner>77.2805589808573 12.42756448925366</gml:lowerCorner>\r\n\t\t\t\t\t\t<gml:upperCorner>77.5613969935526 12.658133048390866</gml:upperCorner>\r\n\t\t\t\t\t</gml:Envelope>\r\n\t\t\t\t</ogc:BBOX>\r\n\t\t\t</ogc:Filter>\r\n\t\t</csw:Constraint>\r\n\t</csw:Query>\r\n</csw:GetRecords>';

// var config = {
//   method: 'post',
//   url: 'https://103.66.50.180.traefik.me:8081/geonetwork/srv/ita/csw',
//   headers: { 
//     'Content-Type': 'application/xml', 
//     'Cookie': 'XSRF-TOKEN=488d2684-7ff1-4f67-ab89-4ef457846a86; serverTime=1660888169980; sessionExpiry=1660888169980; JSESSIONID=node01fsn7z57khf7mlw1sxmib3r302362.node0'
//   },
//   tls: {
//         rejectUnauthorized: false
//     },
//   data : data
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });

// // const axios = require('axios')
// // const parseString = require('xml2js').parseString

// // const xml = `<?xml version="1.0"?><csw:GetRecords xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" version="2.0.2" resultType="results" ><csw:Query typeNames="csw:Record">\ <csw:ElementSetName>full</csw:ElementSetName> <csw:Constraint version="1.1.0"> <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"> <ogc:BBOX> <ogc:PropertyName>iso:BoundingBox</ogc:PropertyName> <gml:Envelope xmlns:gml="http://www.opengis.net/gml"> <gml:lowerCorner>77.2805589808573 12.42756448925366</gml:lowerCorner> <gml:upperCorner>77.5613969935526 12.658133048390866</gml:upperCorner> </gml:Envelope> </ogc:BBOX> </ogc:Filter> </csw:Constraint> </csw:Query> </csw:GetRecords>`

// // const options = {
// //   method: 'post',
// //   url: 'https://103.66.50.180.traefik.me:8081/geonetwork/srv/ita/csw',
// //   headers: {
// //     'Content-Type': 'application/xml',
// //             'Cookie': 'XSRF-TOKEN=497f2a22-7f18-4a32-b30c-c218a1e88058; serverTime=1659605759435; sessionExpiry=1659605759435; JSESSIONID=node011t2gh7egsyf11gtwzfk6n1rvx2.node0'
// //   },
// //   tls: {
// //     rejectUnauthorized: false
// // },
// //   data: xml,
  
// // }


// // axios(options)
// //   .then(response => {
// //     console.log(response.data);
// //     parseString(response.data, (err, result) => {

// //       console.log(result)
// //       // console.log(JSON.stringify(result['soap:Envelope']['soap:Body']))
// //     //   var searchResult = result['soap:Envelope']['soap:Body'][0]['QASearchResult'][0]['QAPicklist'][0]['PicklistEntry']
// //     //   searchResult.forEach((item) => {
// //     //     console.dir(item)
// //     //   })
// //     })
// //   })
// //   .catch( err => {
// //     console.log(err)
// //   })

// // if (process.env.NODE_ENV === 'development') {
// //     const httpsAgent = new https.Agent({
// //       rejectUnauthorized: false,
// //     })
// //     axios.defaults.httpsAgent = httpsAgent
// //     // eslint-disable-next-line no-console  console.log(process.env.NODE_ENV, `RejectUnauthorized is disabled.`)
// //   }