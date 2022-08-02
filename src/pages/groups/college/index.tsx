import React, { useEffect, useState } from 'react';
import { getHotLocationsRequest } from '@store/features/main/request';
import { v4 as uuidv4 } from 'uuid';
import Head from 'next/head';

export async function getStaticProps() {
    const allColleges = await getHotLocationsRequest();
    const colleges = allColleges.data['data'].hotLocations;
    return {
        props: {
            colleges
        },
        revalidate: 1,
    }
}

function allPosts({ colleges }) {
    const description = "Find and share group chats easily for your college. Grouphub compiles group chat links on various platforms: Discord, GroupMe, WhatsApp and Telegram. A simple way to share group chat links with friends and followers.";
    return (
        <div>
            <Head>
                <title>All colleges</title>
                <meta name="description" content={description} />
                <meta itemProp="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="twitter:description" content={description} />
                <meta itemProp="name" content='All colleges' />
                <meta property="og:title" content='All colleges' />
                <meta property="og:site_name" content='All colleges' />
                <meta name="twitter:title" content='All colleges' />
            </Head>
            <h1>All colleges</h1>
            <div>
                {colleges.map((college) => {
                    college = encodeURIComponent(college.location.locationId);
                    const url = `https://grouphub.app/groups/college/${college}`;
                    return (
                        <div>
                            {college}:
                            <a key={uuidv4()} href={url}>
                                {college}
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default allPosts;