import {
  ALL_COORDINATES,
  DELETE_COORDINATES,
  CIRCLE,
  DELETE_CIRCLE,
} from "./actions";

const initialState = {
  myCoordinates: [],
  myCircles: [],
};

const rootReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ALL_COORDINATES:
      return {
        ...state,
        myCoordinates: [...state.myCoordinates, payload],
      };
    case CIRCLE:
      return {
        ...state,
        myCircles: [...state.myCircles, payload],
      };
    case DELETE_COORDINATES:
      return {
        ...state,
        myCoordinates: [],
      };
    case DELETE_CIRCLE:
      return {
        ...state,
        myCircles: [],
      };
    default:
      return state;
  }
};
export default rootReducer;
