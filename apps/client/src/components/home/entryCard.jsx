import Router from 'next/router';
import Link from 'next/link';

export default function EntryCard({title, thumbnail, description, author, tags, comments, url}) {

  return <div className='flex flex-col mx-3 my-16 md:w-3/4 lg:w-full lg:flex-row-reverse'>
    <div className='lg:w-2/3'>
      <div className='flex flex-col items-center'>
        <Link href={`/${url}`}>
          <a>
            <div className='w-full h-32 lg:h-48 bg-cover bg-center rounded-lg mb-4' style={{backgroundImage: `url(${thumbnail})`}}/>
          </a>
        </Link>
        <h3 className='px-1 text-lg text-slate-500 font-bold'>{title}</h3>
      </div>
      <p className='py-3 mt-4'>{description}</p>
      <div className='hidden lg:block'>
        <button className='w-48 cursor-pointer w-full border border-solid border-main-500 py-2 mt-4 text-main-500 rounded-full hover:text-white hover:bg-main-500' onClick={() => Router.push('/' + url)}>Ver Más</button>
      </div>
    </div>
    <div className='lg:flex lg:flex-col-reverse lg:justify-between lg:w-1/3'>
      <div className='flex justify-between items-end my-4 lg:flex-col lg:m-0'>
        <div className='lg:hidden'>
          <span>c: {comments}</span>
        </div>
        <div className='flex flex-row-reverse items-end lg:px-4 lg:items-center'>
          <div className='w-12 h-12 bg-cover bg-center rounded-full shrink-0' style={{backgroundImage: `url(${author.photo})`}}/>
          <h4 className='mx-2 text-sm'>{author.name} {author.lastname}</h4>
        </div>
      </div>
      <ul className='flex flex-wrap'>
        {
          tags.map((e, i) => <li className='bg-main-500 rounded-md m-1 px-2 text-white' key={e + i}>{e}</li>)
        }
      </ul>
      <div className='lg:hidden'>
        <button className='cursor-pointer w-full border border-solid border-main-500 py-2 mt-4 text-main-500 rounded-full hover:text-white hover:bg-main-500' onClick={() => Router.push('/' + url)}>Ver Más</button>
      </div>
    </div>
  </div>;
}