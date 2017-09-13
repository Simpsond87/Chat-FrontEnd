const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (comMod) => (componentModule) => {
  comMod(null, componentModule.default);
};

export default function createRoutes() {

  return [
      {
       path: '/',
       name: 'home',
       getComponent(nextState, comMod) {
         import('containers/Home')
           .then(loadModule(comMod))
           .catch(errorLoading);
       },
     },

     {
      path: '/RoomList',
      name: 'RoomList',
      getComponent(nextState, comMod) {
        import('containers/RoomList')
          .then(loadModule(comMod))
          .catch(errorLoading);
      },
    },

    {
     path: '/SignUpPage',
     name: 'SignUpPage',
     getComponent(nextState, comMod) {
       import('containers/SignUpPage')
         .then(loadModule(comMod))
         .catch(errorLoading);
     },
   },

    {
     path: '/ChatRoom/:id',
     name: 'ChatRoom',
     getComponent(nextState, comMod) {
       import('containers/ChatRoom')
         .then(loadModule(comMod))
         .catch(errorLoading);
     },
   },

     {
      path: '*',
      name: 'notfound',
      getComponent(nextState, comMod) {
        import('containers/NotFoundPage')
          .then(loadModule(comMod))
          .catch(errorLoading);
      },
    },
  ];
}
