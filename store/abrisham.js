// import {User} from "../Model/User";

export const state = () => (
  {
    studyPlanDays: [],
    studyPlanEvents: [],
    url: null, // baseUrl
    appProps: null,
    user: {},
    ticket: {},
    studyPlanEvent:[],
    windowSize: { 'x': 1920, 'y': 976 },
    cart: null
  })
export const mutations = {
    updateCart (state, newInfo) {
      state.cart = newInfo
    },
    setStudyPlanEvent(state, newInfo) {
      state.studyPlanEvent = newInfo;
    },
    updateAppProps(state, newInfo) {
      if (typeof newInfo === 'function') {
        newInfo(state.appProps);
      } else {
        state.appProps = newInfo;
      }
    },
    updateUrl(state, newInfo) {
      state.url = newInfo;
    },
    updateStudyPlanDays(state, newInfo) {
      state.studyPlanDays = newInfo;
    },
    updateStudyPlanEvents(state, newInfo) {
      state.studyPlanEvents = newInfo;
    },
    updateWindowSize(state, newInfo) {
      state.windowSize = newInfo
    },
    updateUser(state, newInfo) {
      state.user = newInfo;
    },
  }

export const actions = {
    updateUserInfo(state, newInfo) {
      state.commit('updateUserInfo', newInfo);
    },
    updateStudyPlanDays(state, newInfo) {
      state.commit('updateStudyPlanDays', newInfo);
    },
    updateStudyPlanEvents(state, newInfo) {
      state.commit('updateStudyPlanEvents', newInfo);
    }
}

export const getters = {
    cart (state) {
      return state.cart
    },
    studyPlanEvent(state) {
      return state.studyPlanEvent;
    },
    url(state) {
      return state.url;
    },
    appProps(state) {
      return state.appProps;
    },
    url_crud_model: (state) => (object) => {
      // let modelName = object.constructor.name;
      // modelName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
      let urlKey = object.url_key;

      if (state && state.url && state.url[urlKey]) {
        return state.url[urlKey];
      } else {
        return null;
      }
    },
    url_crud_collection: (state) => (object) => {
      // let collectionName = object.constructor.name;
      // collectionName = collectionName.charAt(0).toLowerCase() + collectionName.slice(1);
      // // remove List from name
      // collectionName = collectionName.slice(0, collectionName.length - 4);

      // if (state && state.url && state.url[collectionName]) {
      //     return state.url[collectionName];
      // } else {
      //     return null;
      // }

      let urlKey = object.url_key;
      if (state && state.url && state.url[urlKey]) {
        return state.url[urlKey];
      } else {
        return null;
      }
    },
    user(state) {
      return state.user;
    },
    ticket(state) {
      return state.ticket;
    },
    studyPlanDays(state) {
      return state.studyPlanDays;
    },
    studyPlanEvents(state) {
      return state.studyPlanEvents;
    },
    windowSize(state) {
      return state.windowSize;
    }

}
