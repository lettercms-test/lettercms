import {Component} from 'react';
import Router from 'next/router';
import sdk from '@lettercms/sdk';
import {createAccount, createCollaborator} from '@lettercms/admin';
import Input from '@/components/input';
import Spinner from '@lettercms/icons/spinner';
import {signIn} from 'next-auth/react';
import Button from '@/components/button';

export default class UserTab extends Component {
  state = {
    name: '',
    lastname: '',
    email: '',
    password: '',
    existsEmail: null,
    emailLoad: false,
    isLoad: false
  };
  validityEmail = email => {
    const isValid = /\w*@[a-z]{1,10}\.[a-z]{2}/.test(email);

    if (isValid) {
      this.setState({
        emailLoad: true
      });

      sdk.Letter.existsAccount({email})
        .then(exists => {

          this.setState({
            existsEmail: exists,
            emailLoad: false
          });
        });
    }
  };
  handleInput = ({target: {name, value, type}}) => {
    this.setState({
      existsEmail: null
    });

    this.setState({
      [name]: value
    });

    if (type === 'email')
      this.validityEmail(value);
  };
  register = async e => {

    e.preventDefault();

    try {
      const {
        name,
        lastname,
        password,
        email
      } = this.state;

      if (!name || !lastname || !password || !email)
        return alert('Por favor rellene todos los campos');

      this.setState({
        isLoad: true
      });

      const opts = {
        name,
        lastname,
        password,
        email
      };

      //Create Temp Hex String with user data, this will be deleted on success verification
      //This will be used to resend verification email
      const userData = JSON.stringify(opts);
      const userToken = Buffer.from(userData).toString('hex');

      localStorage.setItem('userToken', userToken);
      localStorage.setItem('userEmail', email);

      const {status} = await createAccount({
        name,
        email
      });

      if (status !== 'OK')
        return alert('Error enviando los datos');

      this.setState({
        isLoad: false,
        tab: 'verify'
      });

      this.props.onRegister(email);
    } catch(err) {
      alert('Error Registrando usuario');
      throw err;
    }
  };
  createCollab = async e => {
    this.setState({
      isLoad: true
    });

    e.preventDefault();

    const {
      email
    } = this.props;

    const {
      name,
      lastname,
      password
    } = this.state;

    await createCollaborator({
      name,
      lastname,
      email,
      password
    });

    this.setState({
      isLoad: false
    });

    const user = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (user.ok)
      Router.push('/dashboard');
  }
  render() {
    const {isCollab} = this.props;
    const {name, lastname, password, email, existsEmail, isLoad, emailLoad} = this.state;
    let emailStatus = '';

    if (existsEmail === true)
      emailStatus = 'invalid';
    else if (existsEmail === false)
      emailStatus = 'valid' ;
    else
      emailStatus = 'loading';

    return <form className='form' onSubmit={!isCollab ? this.register : this.createCollab}>
      <div className='username'>
        
        <Input
          disabled={isLoad}
          value={name}
          id='name'
          onInput={this.handleInput}
          label='Nombre'
          autoComplete='false'
        />
        <Input
          disabled={isLoad}
          value={lastname}
          id='lastname'
          onInput={this.handleInput}
          label='Apellido'
          autoComplete='false'
        />
      </div>
        {
          !isCollab &&
          <div id='emailLoad'>
            <Input
              status={emailStatus}
              disabled={isLoad}
              value={email}
              id='email'
              type='email'
              onInput={this.handleInput}
              label='Email'
              autoComplete='false'
            />
            {
              emailLoad &&
              <div className='load-container'>
                <Spinner width='50' height='50' style={{animation: 'rotation linear 1s infinite'}}/>
              </div>
            }
            {
              existsEmail === true &&
              <div className='tooltip'>
                <span>Una cuenta con el mismo correo ya existe</span>
              </div>
            }
          </div>
        }
        <Input
          disabled={isLoad}
          value={password}
          id='password'
          onInput={this.handleInput}
          label='Contraseña'
          type='password'
          autoComplete='false'
        />
        <Button type='solid' style={{width: '100%'}}  loading={isLoad}>Registrar</Button>
      <style jsx>{`
        .username {
          display: flex;
          justify-content: space-between;
        }
        .load-container {
          width: 50px;
          height: 50px;
          position: absolute;
          top: 0;
          right: 0;
        }
        #emailLoad {
          position: relative;
        }
        .tooltip {
          margin-top: -1rem;
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
        }
      `}</style>
    </form>;
  }
}
