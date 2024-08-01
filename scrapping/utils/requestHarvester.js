const axios = require('axios');


const requestHarvester = async (
    url,
    method,
    data,
    headerss
    ) => {
    try {
        if (method == 'get'){

            const headers = new Headers();
            if (headerss){
                for (const key in headerss) {
                    if (headerss.hasOwnProperty(key)) {
                        headers.append(String(key), String(headerss[key]));
                    }
                }
            }
          
            const response = await fetch(url, {
                method: 'GET',
                headers: headers 
                });

            const responseText = await response.text();
            return responseText;

        }

        else if(method == 'post'){
            return await axios.post(url);
        }

        return null
        
    } catch (error) {
        console.error("Error during scraping:", error);
        return null;
    }
};




module.exports = requestHarvester;
