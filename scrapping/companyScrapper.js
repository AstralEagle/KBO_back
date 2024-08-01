const cheerio = require('cheerio');
const requestHarvester = require('./utils/requestHarvester');

const companyScrapper = async (companyId) => {
    const kbopubData = await requestHarvester(
        `https://kbopub.economie.fgov.be/kbopub/toonvestigingps.html?lang=fr&ondernemingsnummer=${companyId}`,
        'get',
        null,
        null
    );

    if (!kbopubData){
        console.error("kbopubData data is null");
        return null
    }
    const $ = cheerio.load(kbopubData);
    const result =  { 
        [ extractGeneral($,'kbopub').enterpriseNumber]: {
                "name": extractGeneral($,'kbopub').name,
                "status":extractGeneral($,'kbopub').status,
                "address":extractGeneral($,'kbopub').address,
                "startDate":extractGeneral($,'kbopub').startDate

                
            }
        };
        

    const kbopubDataSingle = await requestHarvester(
        `https://kbopub.economie.fgov.be/kbopub/toonondernemingps.html?lang=fr&ondernemingsnummer=${companyId}`,
        'get',
        null,
        null
    )
    if (!kbopubData){
        console.error("kbopubDataSingle data is null");
        return null
    }
 
    const singleData = cheerio.load(kbopubDataSingle)

    result[extractGeneral($,'kbopub').enterpriseNumber] = {
        ...result[extractGeneral($,'kbopub').enterpriseNumber],
        "director": extractGeneral(singleData,'kbopub').gerant,
        "website": extractGeneral(singleData,'kbopub').website,
    
    };

    const companywebData = await requestHarvester(
        `https://www.companyweb.be/fr/${companyId}`,
        'get',
        null,
        null

    )
    if (!companywebData){
        console.error("companywebData data is null");
        return null
    }

    const companywebHtml = cheerio.load(companywebData)
    result[extractGeneral($,'kbopub').enterpriseNumber] = {
        ...result[extractGeneral($,'kbopub').enterpriseNumber],
        "capital": extractGeneral(companywebHtml,'companyweb').capital ,
    };

    console.log(result);

    return result;
};

function extractGeneral($,website) {
    const years = [];
    const capitals = [];

    if (website == 'companyweb'){
   
        $('thead .title-tab th').each((index, element) => {
            const year = $(element).text().trim();
            years.push(year);
        });
        
        $('tbody tr').each((index, element) => {
            const rowTitle = $(element).find('td.start-tab').text().trim();
            if (rowTitle.includes('Capitaux propres')) {
            $(element).find('td .financial-number').each((i, tdElement) => {
                const capitalText = $(tdElement).text().trim();
                if (capitalText) {
                capitals.push(capitalText.replace(/\s/g, ''));
                }
            });
            }
        });
    }
   

    return {
        enterpriseNumber: $('td:contains("entreprise:")').next().text()?.trim(),
        status: $('td:contains("Statut de l\'entité:")').next().text()?.trim(),
        startDate: $('td:contains("Date de début:")').next().text()?.trim(),
        name: $('td:contains("Dénomination de l\'unité")').next().text()?.trim()?.split('Dénomination')[0],
        address: $('td:contains("Adresse de l\'unité")').next().html()?.replaceAll('\t', '').replaceAll('<br/>', '').replaceAll('<br>','').replaceAll('&nbsp;','').replaceAll('\n','').split('<span')[0]?.trim(),
        email: $('td:contains(E-mail:")').next().text()?.trim(),
        gerant: $('td:contains(Gérant)').next().text().trim(),
        website:  $('td:contains(Adresse web)').next().text().trim(),
        capital: years.map((year, index) => ({
            year: year,
            capital: capitals[index * 2]
        })).filter(result => result.capital !== undefined)
    };
}

module.exports = companyScrapper;
