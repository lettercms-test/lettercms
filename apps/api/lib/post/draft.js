import posts from '@lettercms/models/posts';
import blogs from '@lettercms/models/blogs';
import {Ratings} from '@lettercms/models/users';

import {isValidObjectId} from 'mongoose';
import revalidate from '@lettercms/utils/lib/revalidate';
import {getFullUrl} from '@lettercms/utils/lib/posts';

export default async function() {
  const {req, res} = this;

  const {url} = req.query;
  const {subdomain} = req;

  const isId = isValidObjectId(url);

  const updateCondition = {};

  if (isId)
    updateCondition._id = url;
  else {
    updateCondition.url = url;
    updateCondition.subdomain = subdomain;
  }

  const {_id: postID, url: _url, postStatus, category, published, views} = await posts.findOneAndUpdate(updateCondition, {postStatus: 'draft'}, {select: '_id url postStatus category published views'});

  if (postStatus === 'draft')
    return res.status(400).json({
      status: 'posts/post-already-draft'
    });

  //Delete recommendations entries
  Ratings.deleteMany({post: postID});
  const {mainUrl, url: urlID} = await blogs.find({subdomain}, 'mainUrl url', {lean: true});

  //is Post has views, revalidate
  if (views > 0) {
    const revalidateUrl = mainUrl + getFullUrl({category, published,url: _url}, urlID);
    
    revalidate(subdomain, revalidateUrl);
  }

  //Revalidate Home path
  revalidate(subdomain, mainUrl);

  res.json({
    status: 'OK',
    id: postID
  });
};
