import React, { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import pdf from './sample.pdf'
import Viewer from './components/Viewer'

function MyApp() {

  return (
    <div>
      <Viewer />
    </div>
  );
}

export default MyApp