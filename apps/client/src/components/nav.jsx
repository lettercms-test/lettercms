import {useRef, useState, useEffect} from 'react';
import Bars from '@lettercms/icons/bars';

export default function Nav() {
  const prevScrollY = useRef(0);
  const [isOpen, setOpen] = useState(false);
  const [viewMenu, setViewMenu] = useState(false);

  const [opacity, setOpacity] = useState(0);
  const [left, setLeft] = useState('-100%');
  const [display, setDisplay] = useState('none');
    
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (prevScrollY.current  > 200 && !isOpen) {
        setOpen(true);
      }
      if (prevScrollY.current < 200 && isOpen) {
        setOpen(false);
      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  useEffect(() => {
    if (viewMenu) {
      setDisplay('block');

      setTimeout(() => {
        setOpacity(.8);
        setLeft(0);
      }, 0);
    } else {
      setOpacity(0);
      setLeft('-100%');

      setTimeout(() => {
        setDisplay('none');
      }, 310);
    }
  }, [viewMenu]);

  const buttons = <>
    <div>
      <img className='h-12' src={`${process.env.ASSETS_BASE}/assets/lettercms-logo.svg`}/>
    </div>
    <button onFocus={() => setViewMenu(true)} onBlur={() => setViewMenu(false)}>
      <Bars height='32' fill='#362e6f'/>
    </button>
  </>;

  return <nav className='relative'>
    <div className='absolute right-0 top-0 z-20 flex justify-between w-full py-4 px-2 lg:px-8 items-center'>
      {buttons}
    </div>
    <div style={{top: isOpen ? 0 : '-80px'}} className='transition-all ease-in duration-150 shadow shadow-1 shadow-gray bg-white fixed right-0 z-20 flex justify-between w-full py-4 px-2 lg:px-8 items-center'>
      {buttons}
    </div>
    <div style={{display}} className='z-30 fixed h-full w-full'>
      <div style={{opacity}} className='transition-all ease-in duration-300 bg-black absolute h-full w-full'/>
      <div style={{left}} className='transition-all ease-in duration-300 bg-white w-4/5 max-w-md h-full absolute top-0'/>
    </div>
  </nav>;
}
