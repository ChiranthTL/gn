var axios = require('axios');
var convert = require('xml-js')
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
axios.defaults.httpsAgent = httpsAgent;
var request = require('request');
const cors = require('cors');
var bodyParser = require('body-parser')
var parseString = require('xml2js').parseString;

const app = express();
app.use(cors({ origin: '*' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
const PORT = 3000;

app.post('/bbox',(req , res, err) => {
    let { lowerCorner, upperCorner } = req.body.bbox;
    console.log({ lowerCorner, upperCorner })
    lowerCorner = `${lowerCorner.lng} ${lowerCorner.lat}`;
    upperCorner = `${upperCorner.lng} ${upperCorner.lat}`; 
    var pass_body = `<?xml version="1.0"?><csw:GetRecords xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" version="2.0.2" resultType="results" ><csw:Query typeNames="csw:Record"><csw:ElementSetName>full</csw:ElementSetName><csw:Constraint version="1.1.0"><ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"><ogc:BBOX><ogc:PropertyName>iso:BoundingBox</ogc:PropertyName><gml:Envelope xmlns:gml="http://www.opengis.net/gml"><gml:lowerCorner>${lowerCorner}</gml:lowerCorner><gml:upperCorner>${upperCorner}</gml:upperCorner></gml:Envelope></ogc:BBOX></ogc:Filter></csw:Constraint></csw:Query></csw:GetRecords>`;
    var options = {
        method : 'POST',
        url : `https://103.66.50.180:8081/geonetwork/srv/ita/csw`,
        headers : {
            'Content-Type': 'application/xml',
            'Cookie': 'XSRF-TOKEN=497f2a22-7f18-4a32-b30c-c218a1e88058; serverTime=1659605759435; sessionExpiry=1659605759435; JSESSIONID=node011t2gh7egsyf11gtwzfk6n1rvx2.node0'
        },

        rejectUnauthorized : false,
        body : pass_body

    }
    let data = [], layers = [];
    request(options, function (error, response) {
        if(error || response == 'null') {
            response.send(-1)

        }
        parseString(response.body, function (err, result) {
            if (err) {
                result.send("-1")
            }
            const obj = result["csw:GetRecordsResponse"]["csw:SearchResults"][0]['csw:Record'];
            // console.log(obj);
            Object.keys(obj).forEach(key => {
                const row = obj[key];
                // console.log(row)
                data.push({
                    'id': row['dc:identifier'],
                    'title': row['dc:title'],
                    'name': row['dc:URI'][0]['$'].name,
                    'description': row['dc:description'],
                });
                layers.push(row['dc:URI'][0]['$'].name);
                console.log(data)
            });
            data = { data: data, layers: layers.join(',') }
            return res.json(data)
        })
    });



    // let data = [], layers = [] , result = [];

    // request(options , (request , response) => {
    //     xml_res = response.body
    //     var result1 = convert.xml2json(xml_res, {compact:true , spaces: 4})
    //     //console.log(result1)
    //     result1.forEach(d => {
    //         console.log(result1[d])
    //     })
    //     console.log(result)

    //     //console.log(csw_searchresult)
    //     key= Object.keys(result1)
    //     console.log(key)
            
    //     // parseString(response,function(err,result) {
    //     //     const obj = result["csw:GetRecordsResponse"]["csw:SearchResults"][0]['csw:Record'];
    //     //     console.log(obj)
    //     // })
    //     console.log(data)
    // })
})

// app.post('/bbox', (req, res) => {
//     // function bbox() {
//     let { lowerCorner, upperCorner } = req.body.bbox;
//     console.log({ lowerCorner, upperCorner })
//     lowerCorner = `${lowerCorner.lng} ${lowerCorner.lat}`;
//     upperCorner = `${upperCorner.lng} ${upperCorner.lat}`;
    
//     const url = 'https://103.66.50.180.traefik.me:8081/geonetwork/srv/ita/csw';

//     var data1 = `<?xml version="1.0"?><csw:GetRecords\r\n\txmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" version="2.0.2" resultType="results" >\r\n\t<csw:Query typeNames="csw:Record"><csw:ElementSetName>full</csw:ElementSetName>\r\n\t\t<csw:Constraint version="1.1.0">\r\n\t\t\t<ogc:Filter\r\n\t\t\t\txmlns:ogc="http://www.opengis.net/ogc">\r\n\t\t\t\t<ogc:BBOX>\r\n\t\t\t\t\t<ogc:PropertyName>iso:BoundingBox</ogc:PropertyName>\r\n\t\t\t\t\t<gml:Envelope\r\n\t\t\t\t\t\txmlns:gml="http://www.opengis.net/gml">\r\n\t\t\t\t\t\t<gml:lowerCorner>${lowerCorner}</gml:lowerCorner>\r\n\t\t\t\t\t\t<gml:upperCorner>${upperCorner}</gml:upperCorner>\r\n\t\t\t\t\t</gml:Envelope>\r\n\t\t\t\t</ogc:BBOX>\r\n\t\t\t</ogc:Filter>\r\n\t\t</csw:Constraint>\r\n\t</csw:Query>\r\n</csw:GetRecords>`;

//     var config = {
//         method: 'post',
//         url: url,
//         headers: {
//             'Content-Type': 'application/xml',
//             'Cookie': 'XSRF-TOKEN=488d2684-7ff1-4f67-ab89-4ef457846a86; serverTime=1660888169980; sessionExpiry=1660888169980; JSESSIONID=node01fsn7z57khf7mlw1sxmib3r302362.node0'
//         },
//         tls: {
//             rejectUnauthorized: false
//         },
//         data: data1
//     };
//     axios(config)
//         .then(function (response) {
//             console.log(response.data);

//         })
//         .catch(function (error) {
//             console.log(error);
//         });
// })

// let data = [], layers = [];
// request(data, function (error, response) {
//     if (error) throw new Error(error)
//     parseString(response.body, function (err, result) {
//         const obj = result["csw:GetRecordsResponse"]["csw:SearchResults"][0]['csw:Record'];
//         // console.log(obj);
//         Object.keys(obj).forEach(key => {
//             const row = obj[key];
//             // console.log(row)
//             data.push({
//                 'id': row['dc:identifier'],
//                 'title': row['dc:title'],
//                 'name': row['dc:URI'][0]['$'].name,
//                 'description': row['dc:description'],
//             });
//             layers.push(row['dc:URI'][0]['$'].name);
//             console.log(data)
//         });
//         data = { data: data1, layers: layers.join(',') }
//         return res.json(data)
//     })
// });



app.listen(PORT, (error) => {
    console.log('listen :' + PORT)
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
});

    


























































// const express = require('express');
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
// const xml = require('xml')
// const cors = require('cors');
// var bodyParser = require('body-parser')
// var parseString = require('xml2js').parseString;
// const https = require("https");
// var request = require("request")

// const app = express();
// app.use(cors({ origin: '*' }))
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())
// app.use(express.json());
// const PORT = 3000;

// var body_pass =

// app.post('/bbox', (req, res) => {
//     let { lowerCorner, upperCorner } = req.body.bbox;
//     console.log({ lowerCorner, upperCorner })
//     lowerCorner = `${lowerCorner.lng} ${lowerCorner.lat}`;
//     upperCorner = `${upperCorner.lng} ${upperCorner.lat}`;
//     var request = require('request');
//     var options = {
//         'url': 'https://103.66.50.180:8081/geonetwork/srv/ita/csw',
//         'method': 'POST',
//         'headers': {
//             'Content-Type': 'application/xml',
//             'Cookie': 'XSRF-TOKEN=488d2684-7ff1-4f67-ab89-4ef457846a86; serverTime=1660888284980; sessionExpiry=1660888284980; JSESSIONID=node01fsn7z57khf7mlw1sxmib3r302362.node0'
//         },
//         'rejectUnauthorized': false,
//          body: `<?xml version="1.0"?> <csw:GetRecords xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" version="2.0.2" resultType="results" > <csw:Query typeNames="csw:Record"> <csw:Constraint version="1.1.0"> <ogc:Filter> <ogc:And> <ogc:PropertyIsLike escapeChar="\" singleChar="?" wildCard="*"> <ogc:PropertyName>dc:title</ogc:PropertyName> <ogc:Literal>*TL_MAP*</ogc:Literal> </ogc:PropertyIsLike> <ogc:Intersects> <ogc:PropertyName>iso:BoundingBox</ogc:PropertyName> <gml:Envelope xmlns:gml="http://www.opengis.net/gml"> <gml:lowerCorner>${lowerCorner}</gml:lowerCorner> <gml:upperCorner>${upperCorner}</gml:upperCorner> </gml:Envelope> </ogc:Intersects> </ogc:And> </ogc:Filter> </csw:Constraint> </csw:Query> </csw:GetRecords>`,
//          XMLDocument: true,
//         //  body: `<?xml version="1.0"?><csw:GetRecords xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" version="2.0.2" resultType="results" ><csw:Query typeNames="csw:Record">\ <csw:ElementSetName>full</csw:ElementSetName> <csw:Constraint version="1.1.0"> <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"> <ogc:BBOX> <ogc:PropertyName>iso:BoundingBox</ogc:PropertyName> <gml:Envelope xmlns:gml="http://www.opengis.net/gml"> <gml:lowerCorner>${lowerCorner}</gml:lowerCorner> <gml:upperCorner>${upperCorner}</gml:upperCorner> </gml:Envelope> </ogc:BBOX> </ogc:Filter> </csw:Constraint> </csw:Query> </csw:GetRecords>`
//         //  body: '<?xml version="1.0"?><csw:GetRecords xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" version="2.0.2" resultType="results" ><csw:Query typeNames="csw:Record">\ <csw:ElementSetName>full</csw:ElementSetName> <csw:Constraint version="1.1.0"> <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"> <ogc:BBOX> <ogc:PropertyName>iso:BoundingBox</ogc:PropertyName> <gml:Envelope xmlns:gml="http://www.opengis.net/gml"> <gml:lowerCorner>77.2805589808573 12.42756448925366</gml:lowerCorner> <gml:upperCorner>77.5613969935526 12.658133048390866</gml:upperCorner> </gml:Envelope> </ogc:BBOX> </ogc:Filter> </csw:Constraint> </csw:Query> </csw:GetRecords>'
//         // body: `<?xml version="1.0"?><csw:GetRecords xmlns:csw="http://www.opengis.net/cat/csw/2.0.2"service="CSW" version="2.0.2"resultType="results"><csw:Query typeNames="csw:Record"><csw:ElementSetName>summary</csw:ElementSetName><ogc:SortBy xmlns:ogc="http://www.opengis.net/ogc"><ogc:SortProperty><ogc:PropertyName>title</ogc:PropertyName><!--<ogc:PropertyName>popularity</ogc:PropertyName><ogc:PropertyName>rating</ogc:PropertyName><ogc:PropertyName>date</ogc:PropertyName>CHECKME--><ogc:SortOrder>ASC</ogc:SortOrder></ogc:SortProperty></ogc:SortBy></csw:Query></csw:GetRecords>`
//     };
//     let data = [], layers = [];
//     request(options, function (error, response, body) {
//          console.log(body)
//         if (error) throw new Error(error)
//         parseString(response.body, function (err, result ,) {
//             const obj = body["csw:GetRecordsResponse"]["csw:SearchResults"][0]['csw:Records'];
//             // console.log(result);
//             Object.keys(obj).forEach(key => {
//                 const row = obj[key];
//                 data.push({
//                     'id': row['dc:identifier'],
//                     'title': row['dc:title'],
//                     'name': row['dc:URI'][0]['$'].name,
//                     'description': row['dc:description'],
//                 });
//                 layers.push(row['dc:URI'][0]['$'].name);
//                 console.log(data)
//             });
//             data = { data: data, layers: layers.join(',') }
//             return res.json(data)
//         })
//     });
// })

// // GetCapabilities()
// // function GetCapabilities() {
// //     var request = require('request');
// //     var options = {
// //         'method': 'GET',
// //         'url': 'https://103.66.50.180:8081/geonetwork/srv/ita/csw?Request=GetCapabilities&service=CSW&version=2.0.2',
// //         'headers': {
// //             'Cookie': 'XSRF-TOKEN=488d2684-7ff1-4f67-ab89-4ef457846a86; JSESSIONID=node01fsn7z57khf7mlw1sxmib3r302362.node0'
// //         },
// //         'rejectUnauthorized': false,
// //     };
// //     request(options, function (error, response) {
// //         if (error) throw new Error(error);
// //         console.log(response.body);
// //     });
// // }


// app.listen(PORT, (error) => {
//     console.log('listen :' + PORT)
//     if (!error)
//         console.log("Server is Successfully Running, and App is listening on port " + PORT)
//     else
//         console.log("Error occurred, server can't start", error);
// }
// );
