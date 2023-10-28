import express from 'express';
import path from 'path';
import fs from 'fs';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { App } from '../src/components/app';
import { StaticRouter } from 'react-router-dom';
import { log } from 'console';
import { matchPath } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchData } from '../src/components/post';

const app = express();

app.listen(9000, () => {
  console.log('Server started on port: 9000');
});

app.get(
  /\.(js|css|map|ico)$/,
  express.static(path.resolve(__dirname, '../dist'))
);

app.use('*', async (req, res, next) => {
  let indexHtml = fs.readFileSync(
    path.resolve(__dirname, '../dist/index.html'),
    { encoding: 'utf-8' }
  );

  let componentData = null;

  if (matchPath(req.originalUrl, '/post')) {
    componentData = await fetchData();
  }

  const appAsString = ReactDOMServer.renderToString(
    <StaticRouter location={req.originalUrl} context={componentData}>
      <App />
    </StaticRouter>
  );

  indexHtml = indexHtml.replace(
    '<div id="app"></div>',
    `<div id="app">${appAsString}</div>`
  );

  indexHtml = indexHtml.replace(
    'var initial_state = null;',
    `var initial_state = ${JSON.stringify(componentData)};`
  );

  res.contentType('text/html').send(indexHtml);
});
