import React, { useEffect, useState } from 'react';

import './post.style';

export function fetchData() {
  console.log('.. Post.fetchData()');

  return fetch('https://jsonplaceholder.typicode.com/posts/3').then(
    (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    }
  );
}

export function Post(props) {
  console.log('>> Post.render()');

  let initialState;
  try {
    initialState = window?.initial_state ?? null;
  } catch {
    initialState = null;
    console.error('Window is not defined.'); // ловим ошибку для сервера
  }

  const [state, setState] = useState(initialState);
  // это условие определяет, что мы на сервере и обновляет стейт
  if (!state && props.staticContext) {
    setState({
      ...state,
      isLoading: false,
      title: props.staticContext?.title,
      body: props.staticContext?.body,
    });
  }

  useEffect(() => {
    if (!state) {
      fetchData().then((data) => {
        setState({
          ...state,
          isLoading: false,
          title: data.title,
          body: data.body,
        });
      });
    }

    return () => {
      console.log('<< Post component Unmount()');
    };
  }, []); // when component mounts, fetch data

  return (
    <div className="ui-post">
      <p className="ui-post__title">Post Widget</p>

      {state?.isLoading ? (
        'loading...'
      ) : (
        <div className="ui-post__body">
          <p className="ui-post__body__title">{state?.title}</p>
          <p className="ui-post__body__description">{state?.body}</p>
        </div>
      )}
    </div>
  );
}
