import Link from 'next/link';
import {FormattedMessage} from 'react-intl';
import {useRef, useEffect, useState, Fragment} from 'react';
import {option, subTab, subHeader, subHr} from './option.module.css';

export default function Option({role, title, sub, icon, href}) {

  const tabRef = useRef(null);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    if (focus) {
      tabRef.current.style.display='block';

      setTimeout(() => {
        tabRef.current.style.opacity = 1;
      }, 0);

    } else {
      tabRef.current.style.opacity = 0;

      setTimeout(() => {
        tabRef.current.style.display='none';
      }, 300);
    }
  }, [focus]);

  return <li style={{position: 'relative'}}>
    <button className={option} onClick={() => setFocus(!focus)} onBlur={() => setFocus(false)}>
      <span>{icon}</span>
      <span>
        <FormattedMessage id={title}/>
      </span>
    </button>
    <ul className={subTab} ref={tabRef}>
      <Link href={href}>
        <a>
          <li className={subHeader}>
            <FormattedMessage id={title}/>
          </li>
        </a>
      </Link>
      {
        sub?.filter(e => !e.admin || role === 'admin')
        .map((e, i) =>
          <Link href={e.href} key={e.href}>
            <a onClick={() => setFocus(false)}>
              <li>
                <FormattedMessage id={e.label}/>
              </li>
            </a>
          </Link>
        )
      }
    </ul>
  </li>;
}
