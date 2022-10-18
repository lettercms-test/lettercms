import sdk from '@lettercms/sdk';
import Image from 'next/image';
import Cross from '@/components/svg/cross';

const Categories = ({categories, onDelete}) => <ul id="categories">
  {categories.map((name) => (
    <li key={name}>
      <span className="name">{name}</span>
      <Cross style={{cursor: 'pointer'}} width='24' height='24' fill='#999' onClick={() => onDelete(name)}/>
    </li>
  ))}
  <style jsx>{`
    #categories li {
      background: white;
      box-shadow: 1px 1px 3px gray;
      border-radius: 5px;
      margin: 10px 0;
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: .5rem;
      padding-left: .5rem;
    }
    #categories li .alias {
      width: 40%;
      font-weight: bold;
      font-size: 20px;
    }
    #categories li .name {
      color: gray;
    }
  `}</style>
</ul>;

export default Categories;
