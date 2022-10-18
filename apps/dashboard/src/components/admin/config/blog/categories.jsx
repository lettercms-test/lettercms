import Categories from '../blogCategories';
import Input from '../../../input';
import {useState} from 'react';

export default function BlogCategories({categories, onAdd, onDelete}) {
  const [categoryName, setName] = useState('');

  const addCategory = () => {
    onAdd(categoryName);
    setName('');
  };

  return <div>
    <Input id='category' value={categoryName} onChange={({target: {value}}) => setName(value)} label='CategorÍa'/>
    <button onClick={addCategory}>Añadir</button>
    {
      categories?.length > 0
      && <Categories categories={categories} onDelete={onDelete}/>
    }
  </div>;
}
