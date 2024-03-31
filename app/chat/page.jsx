'use client';

import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import Highlight from '../../components/Highlight';

function External() {

  return (
    <>
      <div className="mb-5" data-testid="external">
        <h1 data-testid="external-title">Coming Soon: Chat Feature</h1>
        <div data-testid="external-text">
          <p className="lead">Talk to your mentors through chat and video!</p>
        </div>
      </div>
    </>
  );
}

export default withPageAuthRequired(External, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
