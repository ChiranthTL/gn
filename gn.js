const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');
var bodyParser = require('body-parser')
var parseString = require('xml2js').parseString;

const app = express();
app.use(cors({ origin: '*' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json());
const PORT = 3000;


// bbox()
app.post('/bbox', (req, res) => {
    // function bbox() {
    let { lowerCorner, upperCorner } = req.body.bbox;
    console.log({ lowerCorner, upperCorner })
    lowerCorner = `${lowerCorner.lng} ${lowerCorner.lat}`;
    upperCorner = `${upperCorner.lng} ${upperCorner.lat}`;
    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://103.66.50.180:8081/geonetwork/srv/ita/csw',
        'headers': {
            'Content-Type': 'application/xml',
            'Cookie': 'XSRF-TOKEN=497f2a22-7f18-4a32-b30c-c218a1e88058; serverTime=1659605759435; sessionExpiry=1659605759435; JSESSIONID=node011t2gh7egsyf11gtwzfk6n1rvx2.node0'
        },
        'rejectUnauthorized': false,
        // body: `<?xml version="1.0"?> <csw:GetRecords xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" version="2.0.2" resultType="results" > <csw:Query typeNames="csw:Record"> <csw:Constraint version="1.1.0"> <ogc:Filter> <ogc:And> <ogc:PropertyIsLike escapeChar="\" singleChar="?" wildCard="*"> <ogc:PropertyName>dc:title</ogc:PropertyName> <ogc:Literal>*TL_MAP*</ogc:Literal> </ogc:PropertyIsLike> <ogc:Intersects> <ogc:PropertyName>iso:BoundingBox</ogc:PropertyName> <gml:Envelope xmlns:gml="http://www.opengis.net/gml"> <gml:lowerCorner>77.2805589808573 12.42756448925366</gml:lowerCorner> <gml:upperCorner>77.5613969935526 12.658133048390866</gml:upperCorner> </gml:Envelope> </ogc:Intersects> </ogc:And> </ogc:Filter> </csw:Constraint> </csw:Query> </csw:GetRecords>`
        //  body: `<?xml version="1.0"?><csw:GetRecords xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" version="2.0.2" resultType="results" ><csw:Query typeNames="csw:Record">\ <csw:ElementSetName>full</csw:ElementSetName> <csw:Constraint version="1.1.0"> <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"> <ogc:BBOX> <ogc:PropertyName>iso:BoundingBox</ogc:PropertyName> <gml:Envelope xmlns:gml="http://www.opengis.net/gml"> <gml:lowerCorner>${lowerCorner}</gml:lowerCorner> <gml:upperCorner>${upperCorner}</gml:upperCorner> </gml:Envelope> </ogc:BBOX> </ogc:Filter> </csw:Constraint> </csw:Query> </csw:GetRecords>`
         body: '<?xml version="1.0"?><csw:GetRecords xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" version="2.0.2" resultType="results" ><csw:Query typeNames="csw:Record">\ <csw:ElementSetName>full</csw:ElementSetName> <csw:Constraint version="1.1.0"> <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"> <ogc:BBOX> <ogc:PropertyName>iso:BoundingBox</ogc:PropertyName> <gml:Envelope xmlns:gml="http://www.opengis.net/gml"> <gml:lowerCorner>77.2805589808573 12.42756448925366</gml:lowerCorner> <gml:upperCorner>77.5613969935526 12.658133048390866</gml:upperCorner> </gml:Envelope> </ogc:BBOX> </ogc:Filter> </csw:Constraint> </csw:Query> </csw:GetRecords>'
        // body: `<?xml version="1.0"?><csw:GetRecords xmlns:csw="http://www.opengis.net/cat/csw/2.0.2"service="CSW" version="2.0.2"resultType="results"><csw:Query typeNames="csw:Record"><csw:ElementSetName>summary</csw:ElementSetName><ogc:SortBy xmlns:ogc="http://www.opengis.net/ogc"><ogc:SortProperty><ogc:PropertyName>title</ogc:PropertyName><!--<ogc:PropertyName>popularity</ogc:PropertyName><ogc:PropertyName>rating</ogc:PropertyName><ogc:PropertyName>date</ogc:PropertyName>CHECKME--><ogc:SortOrder>ASC</ogc:SortOrder></ogc:SortProperty></ogc:SortBy></csw:Query></csw:GetRecords>`
    };
    let data = [], layers = [];
    request(options, function (error, response) {
        if (error) throw new Error(error)
        parseString(response.body, function (err, result) {
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
})
// }
// GetCapabilities()
// function GetCapabilities() {
//     var request = require('request');
//     var options = {
//         'method': 'GET',
//         'url': 'https://103.66.50.180:8081/geonetwork/srv/ita/csw?Request=GetCapabilities&service=CSW&version=2.0.2',
//         'headers': {
//             'Cookie': 'XSRF-TOKEN=7d463b60-901c-428e-9451-ff64a80c1ea5; JSESSIONID=node0lhr6azhrnem01u942qgwknv1e476.node0'
//         },
//         'rejectUnauthorized': false,
//     };
//     request(options, function (error, response) {
//         if (error) throw new Error(error);
//         console.log(response.body);
//     });
// }

app.listen(PORT, (error) => {
    console.log('listen :' + PORT)
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
}
);
