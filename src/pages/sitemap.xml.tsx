//pages/sitemap.xml.js
import { getAllPostIds } from '@store/features/post/request';
import { getHotLocationsRequest } from '@store/features/main/request';

const EXTERNAL_DATA_URL = 'https://grouphub.app/group';

function generateSiteMap(ids, colleges) {
    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://grouphub.app</loc>
     </url>
     <url>
       <loc>https://grouphub.app/login</loc>
     </url>
     <url>
       <loc>https://grouphub.app/group</loc>
     </url>
     <url>
       <loc>https://grouphub.app/groups</loc>
     </url>
     <url>
       <loc>https://grouphub.app/groups/college</loc>
     </url>
     
     ${colleges.map((college) => {
        college = encodeURIComponent(college.location.locationId);
        return `
            <url>
                <loc>${`${EXTERNAL_DATA_URL}s/college/${college}`}</loc>
            </url>
        `;
    }).join('')}

     ${ids.map((id) => {
        id = encodeURIComponent(id);
        return `
            <url>
                <loc>${`${EXTERNAL_DATA_URL}/${id}`}</loc>
            </url>
        `;
    }).join('')}
   </urlset >
    `;
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
    const allPostIds = await getAllPostIds();
    const ids = allPostIds['data'].data;

    const allColleges = await getHotLocationsRequest();
    const colleges = allColleges.data['data'].hotLocations;

    const sitemap = generateSiteMap(ids, colleges);

    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default SiteMap;