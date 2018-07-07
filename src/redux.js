// Actions
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';

// Reducer
const initialState = {
  loginData: null,
  loading: false,
  error: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loading: true
      };
    case LOGIN_SUCCESS:
      //alert(JSON.stringify(action.payload.data));
      return {
        ...state,
        loading: false,
        loginData: action.payload.data
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        error: 'Error while login'
      };
    default:
      return state;
  }
}

// Action Creators
export function login(login, password) {
  return {
    type: LOGIN,
    payload: {
      request: {
        url: `/posts/1`
      }
    }
  };
}

// Middleware is empty