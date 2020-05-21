import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Form,
  Button,
  TextInput,
  Loading,
  InlineNotification,
} from '@carbon/ibm-security';

import variables from '../../utils/scss/variables.utils';
import { authenticateMSS } from '../../actions/user.actions';

import getCurrentTime from '../../utils/date.utils';
import Router from 'next/router'

export const BLOCK_CLASS_NAME = `${variables.prefix}--signin`;

const Signin = props => {
  // Adding background css for the whole page, this is being added specifically for this page
  useEffect(() => {
    document.body.classList.add(`${BLOCK_CLASS_NAME}__body-bg`);
    return () => {
      document.body.classList.remove(`${BLOCK_CLASS_NAME}__body-bg`);
    };
  }, []);

  return (
    <div className={`bx--row ${BLOCK_CLASS_NAME}__content`}>
      <div className={`bx--col-lg-12 ${BLOCK_CLASS_NAME}__content__announcement`}>
        <AnnouncementSection />
      </div>
      <div className={`${BLOCK_CLASS_NAME}__content__login`}>
        <LoginSection {...props} />
      </div>
    </div>
  );
};

const AnnouncementSection = () => {
  const style = {
    background: 'url(assets/login/login-background.png) no-repeat center center fixed',
    backgroundSize: 'cover',
  };
  // Using this state to update the time
  const [, updateTime] = useState(Date.now());
  useEffect(() => {
    const secondTimer = () => {
      updateTime(Date.now());
    };
    const interVal = setInterval(secondTimer, 1000);
    return () => {
      clearInterval(interVal);
    };
  }, []);

  return (
    <div style={style} className={`${BLOCK_CLASS_NAME}__announcement`}>
      <h1 className={`${BLOCK_CLASS_NAME}__time`}>{getCurrentTime()}</h1>
      <ImportantAnnouncement />
      <Alertcon />
    </div>
  );
};

const ImportantAnnouncement = () => {
  return (
    <div className={`${BLOCK_CLASS_NAME}__important-announcement`}>
      <h2>Important Announcement</h2>
      <p>At the present time, all services are actively being delivered from our Global IBM X-Force Command Center. All systems within the IBM MSS SOC are operating under normal conditions. If you are experiencing any difficulties, contact us at: Phone: (877) 563-8739 / Intl Phone: +1 (404) 236 3290 / Email: ibmsoc@us.ibm.com</p>
      <br />
      <p>Currently, there are no Internet Emergencies. In an event of an Internet Emergency, a status update will be provided at this URL, and Managed Services clients will be notified accordingly.</p>
      
      </div>
  );
};

const Alertcon = () => {
  return (
    <div className={`${BLOCK_CLASS_NAME}__alertcon-announcement`}>
      <h2>Alertcon</h2>
      <span>1</span>
      <img src="assets/login/Alertcon-threatLevel-1.png" alt="Alertcon" />
    </div>
  );
};

const LoginSection = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ username: '', password: '', error: '' })
  const [shouldShowError, setShouldShowError] = useState(false);

  const callback= error => {    
    setLoading(false);
    if (error != null) {
      setShouldShowError(true);
    } else {      
      Router.push('/check-rules');
    }
  };
  

  const handleSubmit = async event => {
    event.preventDefault()
    setUserData(Object.assign({}, userData, { error: '' }))

    setLoading(true);
    dispatch(
      authenticateMSS(
        userData.username,
        userData.password,
        callback
      )
    );
  }
  

  return (
    <section className={`${BLOCK_CLASS_NAME}__section`}>
      {shouldShowError ? (
        <InlineNotification
          subtitle="Credentials Invalid"
          kind="error"
          title="Unauthenticated"
          onCloseButtonClick={() => {
            setShouldShowError(false);
          }}
        />
      ) : null}
      <img
        className={`${BLOCK_CLASS_NAME}__shield-image`}
        src="assets/login/siem_analytics.png"
        alt="SIEM Analytics"
      />
      <div className={`${BLOCK_CLASS_NAME}__app-title`}>SIEM Analytics</div>
      <Form onSubmit={handleSubmit} method="post">
        <TextInput
          labelText=""
          name="email"
          id="email"
          size="sm"
          placeholder="Email"
          value={userData.username}
            onChange={event =>
              setUserData(
                Object.assign({}, userData, { username: event.target.value })
              )
          }
        />
        <TextInput.PasswordInput
          labelText=""
          name="password"
          id="password"
          placeholder="Password"
          value={userData.password}
            onChange={event =>
              setUserData(
                Object.assign({}, userData, { password: event.target.value })
              )
          }
        />
        <br />
        <Button type="submit" disabled={loading}>
          {loading ? <Loading small withOverlay={false} /> : ''}
          Signin
        </Button>
      </Form>
    </section>
  );
};

export default Signin;
