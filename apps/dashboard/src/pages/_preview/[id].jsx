import Post from '@/components/post';
import {parse as cookieParser} from 'cookie';
import {getSession} from 'next-auth/react';
import {getPreview} from '@/lib/mongo/posts';
import jwt from 'jsonwebtoken';

export const getServerSideProps = async ({req, res, query}) => {  
  const {id, hl = 'en'} = query;
  const {notFound, post} = await getPreview(id);

  if (notFound)
    return {
      notFound: true
    };

  const lang = await import(`@/translations/post/${hl}.json`);

  const messages = Object.assign({}, lang.default);

  //Parse Mongo Object IDs
  const props = JSON.parse(JSON.stringify({
    post
  }));

  return {
    props: {
      ...props,
      messages,
      isPreview: true,
      recommendation: {},
      accessToken: jwt.sign({subdomain: 'davidsdevel'}, process.env.JWT_AUTH)
    }
  };
};

export default Post;
