import React, { useEffect, useState } from 'react';
import { getAllPostIds } from '@store/features/post/request';
import { v4 as uuidv4 } from 'uuid';
import Head from 'next/head';

export async function getStaticProps() {
    const allPostIds = await getAllPostIds();
    const postIds = allPostIds['data'].data;
    return {
        props: {
            postIds
        },
        revalidate: 1,
    }
}

function allPosts({ postIds }) {
    const description = "Find and share group chats easily for your college. Grouphub compiles group chat links on various platforms: Discord, GroupMe, WhatsApp and Telegram. A simple way to share group chat links with friends and followers.";

    return (
        <div>
            <Head>
                <title>All groups</title>
                <meta name="description" content={description} />
                <meta itemProp="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="twitter:description" content={description} />
                <meta itemProp="name" content='All colleges' />
                <meta property="og:title" content='All colleges' />
                <meta property="og:site_name" content='All colleges' />
                <meta name="twitter:title" content='All colleges' />
            </Head>
            <h1>All groups</h1>
            <div>
                {postIds.map((id) => {
                    const url = `https://grouphub.app/group/${id}`;
                    return (
                        <div>
                            {id}:
                            <a key={uuidv4()} href={url}>
                                {id}
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default allPosts;